import { api } from "../../services/api/api";
import {
  clearAuthSession,
  extractAuthToken,
  persistAuthSession,
} from "../../shared/utils/authStorage";
import toast from "react-hot-toast";

const mapCartDtoToState = (cartDto) => {
  if (!cartDto || typeof cartDto !== "object") {
    return { cartId: null, items: [], totalPrice: 0 };
  }

  const cartId = cartDto?.cartId ?? null;
  const rawItems = Array.isArray(cartDto?.product)
    ? cartDto.product
    : Array.isArray(cartDto?.products)
      ? cartDto.products
      : Array.isArray(cartDto?.items)
        ? cartDto.items
        : [];
  const items = rawItems.map((item) => ({
        ...item,
        cartId,
      }));
  const calculatedTotal = items.reduce(
    (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity),
    0
  );

  return {
    cartId,
    items,
    totalPrice: Number(cartDto?.totalPrice ?? calculatedTotal),
  };
};

const extractErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const isCartMissingError = (error) => {
  const status = error?.response?.status;
  const message = String(
    error?.response?.data?.message || error?.response?.data?.error || ""
  ).toLowerCase();

  return (
    status === 404 ||
    (message.includes("cart") && message.includes("not found")) ||
    message.includes("no cart exist")
  );
};

export const fetchUserCart = (toast) => async (dispatch) => {
  try {
    const { data } = await api.get("/carts/users/cart");
    const mapped = mapCartDtoToState(data);

    dispatch({
      type: "SET_CART",
      payload: mapped.items,
      cartId: mapped.cartId,
      totalPrice: mapped.totalPrice,
    });
  } catch (error) {
    if (isCartMissingError(error)) {
      dispatch({ type: "SET_CART", payload: [], cartId: null, totalPrice: 0 });
      return;
    }
    dispatch({ type: "SET_CART", payload: [], cartId: null, totalPrice: 0 });
    if (toast) {
      toast.error(extractErrorMessage(error, "Failed to load cart."));
    }
  }
};

export const fetchProducts = (queryString) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(
        `/public/products?pageSize=10&${queryString}`
    );
    dispatch({
      type: "FETCH_PRODUCTS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong!",
    });
  }
};
export const fetchCategories =
  (
    queryString = "pageNumber=0&pageSize=2&sortBy=categoryName&sortOrder=asc"
  ) =>
  async (dispatch) => {
  try {
    dispatch({ type: "CATEGORY_LOADER" });
    const params = new URLSearchParams(queryString);
    const pageSize = params.get("pageSize") || "2";
    const sortBy = params.get("sortBy") || "categoryName";
    const sortOrder = params.get("sortOrder") || "asc";
    let pageNumber = Number(params.get("pageNumber") || 0);
    let lastPage = false;
    let allCategories = [];
    let meta = null;

    while (!lastPage) {
      const pageParams = new URLSearchParams({
        pageNumber: String(pageNumber),
        pageSize,
        sortBy,
        sortOrder,
      });
      const { data } = await api.get(`/public/categories?${pageParams.toString()}`);
      const currentItems = Array.isArray(data?.content) ? data.content : [];

      allCategories = [...allCategories, ...currentItems];
      meta = data;
      lastPage = Boolean(data?.lastPage);
      pageNumber += 1;

      if (currentItems.length === 0) {
        break;
      }
    }

    dispatch({
      type: "FETCH_CATEGORIES",
      payload: allCategories,
      pageNumber: meta?.pageNumber ?? 0,
      pageSize: meta?.pageSize ?? Number(pageSize),
      totalElements: meta?.totalElements ?? allCategories.length,
      totalPages: meta?.totalPages ?? 1,
      lastPage: meta?.lastPage ?? true,
    });
    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "CATEGORY_ERROR",
      payload:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong (CATEGORY)!",
    });
  }
};

export const addToCart =
  (data, qty = 1, toast) =>
  async (dispatch) => {
    const productId = data?.productId ?? data?.id;
    const safeQty = Number(qty);

    if (!productId) {
      toast.error("Invalid product id.");
      return { success: false };
    }

    if (!Number.isFinite(safeQty) || safeQty <= 0) {
      toast.error("Invalid quantity.");
      return { success: false };
    }

    try {
      const { data: response } = await api.post(
        `/carts/products/${productId}/quantity/${safeQty}`
      );
      const statusFlag = response?.status;
      const isFailedStatus =
        statusFlag === false ||
        String(statusFlag).toLowerCase() === "false";

      if (isFailedStatus) {
        toast.error(response?.message || "Failed to add product to cart.");
        return { success: false };
      }

      await dispatch(fetchUserCart());
      toast.success(response?.message || `${data?.productName} added to the cart`);
      return { success: true };
    } catch (error) {
      const serverData = error?.response?.data;
      const message =
        serverData?.message ||
        serverData?.error ||
        (Array.isArray(serverData?.errors) ? serverData.errors[0] : null) ||
        (error?.response?.status === 401 || error?.response?.status === 403
          ? "Please login to add products to cart."
          : null) ||
        error?.message ||
        "Product Not Added To Cart";
      console.error("Add to cart failed:", serverData || error);
      toast.error(message);
      return { success: false };
    }
  };

export const increaseCartQuantity =
  (productId, toast) => async (dispatch) => {
    try {
      await api.put(`/carts/products/${productId}/quantity/add`);
      await dispatch(fetchUserCart());
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to update cart quantity."));
    }
  };

export const decreaseCartQuantity =
  (productId, toast) => async (dispatch) => {
    try {
      await api.put(`/carts/products/${productId}/quantity/delete`);
      await dispatch(fetchUserCart());
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to update cart quantity."));
    }
  };

export const addProduct =
  (categoryId, sendData, toast, navigate) => async () => {
  try {
    const { data } = await api.post(
      `/admin/categories/${categoryId}/product`,
      sendData
    );
    toast.success(data?.message || "Product Added Successfully");
    navigate("/");
  } catch (error) {
    const serverData = error?.response?.data;
    const message =
      serverData?.message ||
      serverData?.error ||
      (Array.isArray(serverData?.errors) ? serverData.errors[0] : null) ||
      error?.message ||
      "Product Not Added";
    console.error("Add product failed:", serverData || error);
    toast.error(message);
  }
};

export const createCategory = (sendData, toast) => async () => {
  try {
    const { data } = await api.post(
      "/public/categories",
      sendData
    );
    toast.success(data?.message || "Category Created Successfully");
    return { success: true, data };
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Category Not Created"
    );
    return { success: false, error };
  }
};

export const removeFromCart = (data, toast) => async (dispatch, getState) => {
  const cartId = data?.cartId ?? getState().carts.cartId;

  if (!cartId) {
    toast.error("Cart not found.");
    return;
  }

  try {
    await api.delete(`/carts/${cartId}/product/${data.productId}`);
    await dispatch(fetchUserCart());
    toast.success(`${data.productName} removed from cart`);
  } catch (error) {
    toast.error(extractErrorMessage(error, "Failed to remove cart item."));
  }
};

export const clearCart = () => (dispatch) => {
  dispatch({ type: "CLEAR_CART" });
};

export const createOrder = (orderData) => (dispatch, getState) => {
  dispatch({ type: "CREATE_ORDER", payload: orderData });
  const updatedOrders = getState().orders.orders;
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
};

export const authenticateSignInUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      const loginPayload = {
        email: String(sendData?.email || "").trim().toLowerCase(),
        password: String(sendData?.password || "").trim(),
      };

      if (!loginPayload.email || !loginPayload.password) {
        toast.error("Email and password are required.");
        return;
      }

      const { data, headers } = await api.post("/auth/signin", loginPayload);
      const headerTokenRaw =
        headers?.authorization ||
        headers?.Authorization ||
        headers?.["jwt-token"] ||
        headers?.["x-auth-token"];
      const headerToken = headerTokenRaw
        ? String(headerTokenRaw).replace(/^Bearer\s+/i, "").trim()
        : null;

      const bodyToken = extractAuthToken(data);
      const resolvedToken = bodyToken || headerToken;
      const authPayload = resolvedToken ? { ...data, token: resolvedToken } : data;

      dispatch({ type: "LOGIN_USER", payload: authPayload });
      persistAuthSession(authPayload);
      reset();
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      }
    } finally {
      setLoader(false);
    }
  };

export const registerNewUser =
  (sendData, toast, reset, navigate, setLoader) => async () => {
    try {
      setLoader(true);
      const { data } = await api.post("/auth/register", sendData);
      reset();
      toast.success(data?.message || "User Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const logOutUser = (navigate) => async (dispatch) => {
  const shouldCallServerSignout =
    String(import.meta.env.VITE_ENABLE_SERVER_SIGNOUT || "").toLowerCase() ===
    "true";

  try {
    if (shouldCallServerSignout) {
      await api.post("/auth/signout");
    }
  } catch (error) {
    const status = error?.response?.status;
    if (status !== 401 && status !== 403) {
      console.error("Signout request failed:", error?.response?.data || error);
    }
  } finally {
    dispatch({ type: "LOGOUT" });
    clearAuthSession();
    toast.success("User Signout Successfully");
    navigate("/login");
  }
};
