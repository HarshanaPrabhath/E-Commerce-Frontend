import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productReducer";
import { errorReducer } from "./reducers/errorReducer";


export const store = configureStore({
    reducer:{
        productList:productReducer,
        errors:errorReducer,
    },
    preloadedState:{
        
    },
});

export default store;
