import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productReducer";
import { errorReducer } from "./reducers/errorReducer";
import { cartReducer } from "./reducers/cartReducer";
import { authReducer } from "./reducers/authReducer";
import { orderReducer } from "./reducers/orderReducer";
import { getStoredAuth } from "../shared/utils/authStorage";

const user = getStoredAuth();

const orders = localStorage.getItem("orders")
    ? JSON.parse(localStorage.getItem("orders"))
    : [];

const initialState = {
    auth:{user:user},
    carts:{cart:[]},
    orders:{orders},
};

export const store = configureStore({
    reducer:{
        productList:productReducer,
        errors:errorReducer,
        carts:cartReducer,
        auth  : authReducer,
        orders: orderReducer,
    },
    preloadedState:initialState
});

export default store;
