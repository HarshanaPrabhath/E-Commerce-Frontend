import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../../services/api/api";
import { useAppData } from "../../../app/context/AppDataContext";
import {
  buildAddressLabel,
  digitsOnly,
  extractList,
  validateCardNumber,
} from "../utils/checkoutHelpers";

function useCheckoutFlow() {
  const { user, cart, fetchCart, clearCartState, signOut } = useAppData();
  const navigate = useNavigate();

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
    error?.response?.data?.message || error?.response?.data?.error || error?.message || "";

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

    signOut();
    toast.error("Your session has expired. Please login again.");
    navigate("/login");
    return true;
  };

  const totalPrice = useMemo(
    () =>
      cart?.reduce((acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity), 0) ?? 0,
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
      toast.error(getErrorMessage(error) || "Failed to load addresses.");
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
      const cartResult = await fetchCart();
      if (!cartResult?.success) {
        toast.error(cartResult?.message || "Failed to load cart.");
      }
      setIsLoadingCart(false);
      await loadAddresses();
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user, fetchCart]);

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
    const requiredFields = ["street", "buildingName", "city", "state", "country"];
    const missingField = requiredFields.find((field) => !addressForm[field].trim());
    if (missingField) {
      toast.error("Street, building name, city, state, and country are required.");
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
      let data;
      try {
        const response = await api.post("/addresses", payload);
        data = response.data;
      } catch (primaryError) {
        const status = primaryError?.response?.status;
        if (status !== 404 && status !== 405) {
          throw primaryError;
        }
        const fallbackResponse = await api.post("/users/addresses", payload);
        data = fallbackResponse.data;
      }
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
      toast.error(getErrorMessage(error) || "Failed to add address.");
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

      await api.post("/order", orderPayload);

      clearCartState();
      toast.success("Order placed successfully.");
      navigate("/products");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const selectedAddress = addresses.find(
    (address) => String(address.addressId) === String(selectedAddressId)
  );

  return {
    step,
    setStep,
    isLoadingCart,
    isLoadingAddresses,
    isSavingAddress,
    isPlacingOrder,
    paymentMethod,
    cardHolderName,
    setCardHolderName,
    cardNumber,
    setCardNumber,
    expMonth,
    setExpMonth,
    expYear,
    setExpYear,
    cvv,
    setCvv,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addressForm,
    setAddressForm,
    totalPrice,
    selectedAddress,
    buildAddressLabel,
    digitsOnly,
    cart,
    handleContinueToAddress,
    handleAddAddress,
    handleContinueToReview,
    handlePlaceOrder,
  };
}

export default useCheckoutFlow;
