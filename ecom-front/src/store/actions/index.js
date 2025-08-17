import { current } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import { toast } from "react-hot-toast";

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
export const fetchCategories = (queryString) => async (dispatch) => {
  try {
    dispatch({ type: "CATEGORY_LOADER" });
    const { data } = await api.get(`/public/categories`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });
    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong (CATEGORY)!",
    });
  }
};

export const addToCart =
  (data, qty = 1, toast) =>
  (dispatch, getState) => {
    const { products } = getState().productList;

    const getProduct = products.find(
      (item) => item.productId === data.productId
    );

    const isQuantityExist = getProduct.quantity >= qty;

    if (isQuantityExist) {
      dispatch({ type: "ADD_CART", payload: { ...data, quantity: qty } });
      toast.success(`${data?.productName} added to the cart`);
      localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    } else {
      toast.error("out of stock");
    }
  };

export const increaseCartQuantity =
  (data, toast, currentQuantity, setCurrentQuantity) =>
  (dispatch, getState) => {
    const { products } = getState().productList;

    const getProduct = products.find(
      (item) => item.productId === data.productId
    );
    if (!getProduct) {
      toast.error("Product not found!");
      return;
    }
    const newQuantity = currentQuantity + 1;

    const isQuantityExist = getProduct.quantity >= newQuantity;

    if (isQuantityExist) {
      setCurrentQuantity(newQuantity);

      dispatch({
        type: "ADD_CART",
        payload: { ...data, quantity: newQuantity }, // ✅ fixed
      });

      localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    } else {
      toast.error("Quantity Reached to Limit");
    }
  };

export const decreaseCartQuantity =
  (data, newQuantity) => (dispatch, getState) => {
    dispatch({
      type: "ADD_CART",
      payload: { ...data, quantity: newQuantity },
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
  };

export const addProduct = (sendData, toast,navigate) => async (dispatch) => {
  try {
    const { data } = await api.post("/admin/categories/5/product",sendData);
    toast.success(data?.message || "Product Added Successfully");
    navigate("/");
  } catch(error){
    toast.error(error?.message || "Product Not Added")
  }
};

export const removeFromCart = (data, toast) => (dispatch, getState) => {
  dispatch({
    type: "REMOVE_CART",
    payload: data,
  });

  toast.success(`${data.productName} removed from cart`);

  localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
};

export const authenticateSignInUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);

      const { data } = await api.post("/auth/signin", sendData);
      dispatch({ type: "LOGIN_USER", payload: data });
      localStorage.setItem("auth", JSON.stringify(data));
      reset();
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const registerNewUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);

      const { data } = await api.post("/auth/register", sendData);
      reset();
      toast.success(data?.message || "User Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.messsage || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const logOutUser = (navigate) => (dispatch) => {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("auth");
  navigate("/login");
};
