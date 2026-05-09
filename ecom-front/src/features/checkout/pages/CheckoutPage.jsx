import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MdCheckCircle } from "react-icons/md";
import { api } from "../../../services/api/api";
import { clearAuthSession } from "../../../shared/utils/authStorage";
import { clearCart, createOrder, fetchUserCart } from "../../../store/actions";
import AddressStep from "../components/AddressStep";
import CheckoutCartSummary from "../components/CheckoutCartSummary";
import CheckoutSteps from "../components/CheckoutSteps";
import PaymentStep from "../components/PaymentStep";
import ReviewStep from "../components/ReviewStep";
import {
  buildAddressLabel,
  digitsOnly,
  extractList,
  validateCardNumber,
} from "../utils/checkoutHelpers";

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.carts);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState("payment");
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [paymentMethod] = useState("CARD");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressForm, setAddressForm] = useState({
    street: "",
    buildingName: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "";

  const handleAuthFailure = (error) => {
    const status = error?.response?.status;
    const message = getErrorMessage(error);
    const normalized = String(message).toLowerCase();
    const isAuthError =
      status === 401 ||
      status === 403 ||
      normalized.includes("user not found") ||
      normalized.includes("full authentication is required");

    if (!isAuthError) {
      return false;
    }

    dispatch({ type: "LOGOUT" });
    clearAuthSession();
    toast.error("Your session has expired. Please login again.");
    navigate("/login");
    return true;
  };

  const totalPrice = useMemo(
    () =>
      cart?.reduce(
        (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity),
        0
      ) ?? 0,
    [cart]
  );

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      let data;
      try {
        const res = await api.get("/addresses");
        data = res.data;
      } catch {
        const fallbackRes = await api.get("/users/addresses");
        data = fallbackRes.data;
      }
      const parsed = extractList(data).map((item) => ({
        addressId: item?.addressId ?? item?.id,
        street: item?.street ?? "",
        buildingName: item?.buildingName ?? "",
        city: item?.city ?? "",
        state: item?.state ?? "",
        country: item?.country ?? "",
      }));
      setAddresses(parsed);
      if (!selectedAddressId && parsed.length > 0) {
        setSelectedAddressId(String(parsed[0].addressId));
      }
    } catch (error) {
      if (handleAuthFailure(error)) return;
      toast.error(
        getErrorMessage(error) || "Failed to load addresses."
      );
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      setIsLoadingCart(true);
      await dispatch(fetchUserCart(toast));
      setIsLoadingCart(false);
      await loadAddresses();
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, user]);

  const handleContinueToAddress = () => {
    if (!cardHolderName.trim()) {
      toast.error("Card holder name is required.");
      return;
    }
    if (!validateCardNumber(cardNumber)) {
      toast.error("Please enter a valid card number.");
      return;
    }
    if (!/^\d{1,2}$/.test(expMonth) || Number(expMonth) < 1 || Number(expMonth) > 12) {
      toast.error("Expiry month must be between 1 and 12.");
      return;
    }
    if (!/^\d{4}$/.test(expYear) || Number(expYear) < new Date().getFullYear()) {
      toast.error("Please enter a valid expiry year.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      toast.error("Please enter a valid CVV.");
      return;
    }

    setStep("address");
  };

  const handleAddAddress = async () => {
    const requiredFields = ["street", "city", "state", "country"];
    const missingField = requiredFields.find((field) => !addressForm[field].trim());
    if (missingField) {
      toast.error("Street, city, state, and country are required.");
      return;
    }

    setIsSavingAddress(true);
    try {
      const payload = {
        street: addressForm.street.trim(),
        buildingName: addressForm.buildingName.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        country: addressForm.country.trim(),
      };

      const { data } = await api.post("/addresses", payload);
      const createdAddressId = data?.addressId ?? data?.id;

      setAddressForm({
        street: "",
        buildingName: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });

      await loadAddresses();

      if (createdAddressId) {
        setSelectedAddressId(String(createdAddressId));
      }

      toast.success("Address added.");
    } catch (error) {
      if (handleAuthFailure(error)) return;
      toast.error(
        getErrorMessage(error) || "Failed to add address."
      );
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleContinueToReview = () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a delivery address.");
      return;
    }
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    if (!cart?.length) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Select a delivery address.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        addressId: Number(selectedAddressId),
        totalAmount: Number(totalPrice.toFixed(2)),
        paymentMethod,
        cardNumber: digitsOnly(cardNumber),
        cardHolderName: cardHolderName.trim(),
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        cvv: digitsOnly(cvv),
      };

      const { data } = await api.post("/order", orderPayload);

      const selectedAddress = addresses.find(
        (address) => String(address.addressId) === String(selectedAddressId)
      );

      dispatch(
        createOrder({
          orderId: data?.orderId ?? data?.id ?? `ORD-${Date.now()}`,
          userId: user?.userId,
          customerName: user?.username || "Customer",
          items: cart.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: Number(item.specialPrice),
            lineTotal: Number(item.specialPrice) * Number(item.quantity),
          })),
          subtotal: totalPrice,
          total: Number(data?.totalAmount ?? orderPayload.totalAmount),
          paymentMethod: data?.paymentMethod ?? paymentMethod,
          billingEmail: user?.email || "",
          deliveryAddress: buildAddressLabel(selectedAddress),
          status: data?.status || "Placed",
          createdAt: data?.createdAt || new Date().toISOString(),
        })
      );

      dispatch(clearCart());
      toast.success("Order placed successfully.");
      navigate("/products");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to place order."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const selectedAddress = addresses.find(
    (address) => String(address.addressId) === String(selectedAddressId)
  );

  return (
    <div className="lg:px-20 sm:px-10 px-4 py-16 min-h-screen bg-[#fcfcfc]">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <MdCheckCircle className="text-teal-600" size={28} />
          <h1 className="text-3xl font-black text-slate-900">Checkout Flow</h1>
        </div>

        <CheckoutSteps step={step} setStep={setStep} />

        <div className="grid lg:grid-cols-5 gap-8">
          <section className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 space-y-6">
            {step === "payment" ? (
              <PaymentStep
                cardHolderName={cardHolderName}
                setCardHolderName={setCardHolderName}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                expMonth={expMonth}
                setExpMonth={setExpMonth}
                expYear={expYear}
                setExpYear={setExpYear}
                cvv={cvv}
                setCvv={setCvv}
                digitsOnly={digitsOnly}
                onContinue={handleContinueToAddress}
              />
            ) : null}

            {step === "address" ? (
              <AddressStep
                isLoadingAddresses={isLoadingAddresses}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                buildAddressLabel={buildAddressLabel}
                addressForm={addressForm}
                setAddressForm={setAddressForm}
                isSavingAddress={isSavingAddress}
                onAddAddress={handleAddAddress}
                onBackPayment={() => setStep("payment")}
                onContinueReview={handleContinueToReview}
              />
            ) : null}

            {step === "review" ? (
              <ReviewStep
                paymentMethod={paymentMethod}
                selectedAddress={selectedAddress}
                buildAddressLabel={buildAddressLabel}
                totalPrice={totalPrice}
                onBackAddress={() => setStep("address")}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
                isLoadingCart={isLoadingCart}
              />
            ) : null}
          </section>

          <CheckoutCartSummary
            isLoadingCart={isLoadingCart}
            cart={cart}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
