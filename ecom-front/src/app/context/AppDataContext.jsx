import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../../services/api/api";
import {
  clearAuthSession,
  extractAuthToken,
  getStoredAuth,
  persistAuthSession,
} from "../../shared/utils/authStorage";

const AppDataContext = createContext(null);

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

  const items = rawItems.map((item) => ({ ...item, cartId }));
  const calculatedTotal = items.reduce(
    (acc, cur) => acc + Number(cur?.specialPrice ?? 0) * Number(cur?.quantity ?? 0),
    0
  );

  return {
    cartId,
    items,
    totalPrice: Number(cartDto?.totalPrice ?? calculatedTotal),
  };
};

const getErrorMessage = (error, fallback = "Request failed.") =>
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

export function AppDataProvider({ children }) {
  const [user, setUser] = useState(getStoredAuth());
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setCartId(null);
      setCartTotal(0);
      return { success: true };
    }
    try {
      const { data } = await api.get("/carts/users/cart");
      const mapped = mapCartDtoToState(data);
      setCart(mapped.items);
      setCartId(mapped.cartId);
      setCartTotal(mapped.totalPrice);
      return { success: true };
    } catch (error) {
      if (isCartMissingError(error)) {
        setCart([]);
        setCartId(null);
        setCartTotal(0);
        return { success: true };
      }
      setCart([]);
      setCartId(null);
      setCartTotal(0);
      return { success: false, message: getErrorMessage(error, "Failed to load cart.") };
    }
  }, [user]);

  const addToCartItem = useCallback(async (product, qty = 1) => {
    const productId = product?.productId ?? product?.id;
    if (!productId) return { success: false, message: "Invalid product id." };
    try {
      const { data } = await api.post(`/carts/products/${productId}/quantity/${Number(qty)}`);
      const isFailed =
        data?.status === false || String(data?.status).toLowerCase() === "false";
      if (isFailed) return { success: false, message: data?.message || "Failed to add to cart." };
      await fetchCart();
      return { success: true, message: data?.message || "Added to cart." };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to add to cart.") };
    }
  }, [fetchCart]);

  const increaseCartItem = useCallback(async (productId) => {
    try {
      await api.put(`/carts/products/${productId}/quantity/add`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to update cart quantity.") };
    }
  }, [fetchCart]);

  const decreaseCartItem = useCallback(async (productId) => {
    try {
      await api.put(`/carts/products/${productId}/quantity/delete`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to update cart quantity.") };
    }
  }, [fetchCart]);

  const removeCartItem = useCallback(async (product) => {
    const safeCartId = product?.cartId ?? cartId;
    if (!safeCartId) return { success: false, message: "Cart not found." };
    try {
      await api.delete(`/carts/${safeCartId}/product/${product?.productId}`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to remove cart item.") };
    }
  }, [cartId, fetchCart]);

  const clearCartState = useCallback(() => {
    setCart([]);
    setCartId(null);
    setCartTotal(0);
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
      return;
    }
    clearCartState();
  }, [user, fetchCart, clearCartState]);

  const signIn = useCallback(async ({ email, password }) => {
    const loginPayload = {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || "").trim(),
    };
    if (!loginPayload.email || !loginPayload.password) {
      return { success: false, message: "Email and password are required." };
    }
    try {
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

      setUser(authPayload);
      persistAuthSession(authPayload);
      return { success: true, user: authPayload };
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        return { success: false, message: "Invalid email or password." };
      }
      return { success: false, message: getErrorMessage(error, "Login failed.") };
    }
  }, []);

  const signUp = useCallback(async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      return { success: true, message: data?.message || "User registered successfully." };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Registration failed.") };
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    clearAuthSession();
    clearCartState();
    return { success: true };
  }, [clearCartState]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      cart,
      cartId,
      cartTotal,
      fetchCart,
      addToCartItem,
      increaseCartItem,
      decreaseCartItem,
      removeCartItem,
      clearCartState,
      signIn,
      signUp,
      signOut,
    }),
    [
      user,
      cart,
      cartId,
      cartTotal,
      fetchCart,
      addToCartItem,
      increaseCartItem,
      decreaseCartItem,
      removeCartItem,
      clearCartState,
      signIn,
      signUp,
      signOut,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider.");
  }
  return context;
};
