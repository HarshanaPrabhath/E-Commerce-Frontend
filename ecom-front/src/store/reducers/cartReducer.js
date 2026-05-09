const initialState = {
    cart:[],
    totalPrice:0,
    cartId:null
}

export const cartReducer = (state = initialState,action)=>{
    switch(action.type){
        case "SET_CART": {
            const calculatedTotal =
                action.payload?.reduce(
                    (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity),
                    0
                ) ?? 0;

            return {
                ...state,
                cart: action.payload ?? [],
                cartId: action.cartId ?? state.cartId,
                totalPrice: action.totalPrice ?? calculatedTotal,
            };
        }
        case "ADD_CART": {
            const productToAdd = action.payload;
            const existingProduct = state.cart.find(
                (item) => item.productId === productToAdd.productId
            )

            if(existingProduct){
                const updatedCart = state.cart.map((item)=>{
                    if(item.productId === productToAdd.productId){
                        return productToAdd;
                    }else{
                        return item;
                    }
                })

                return{
                    ...state,
                    cart:updatedCart,
                }
            }else{
                const newCart = [...state.cart,productToAdd]
                return{
                    ...state,
                    cart:newCart,
            };
        }
        }
        case "REMOVE_CART":
            return {
                ...state,
                cart: state.cart.filter(
                    (item) => item.productId !== action.payload.productId 
                )
            }
        case "CLEAR_CART":
            return {
                ...state,
                cart: [],
                totalPrice: 0,
                cartId: null,
            };
        default:return state;
    }
}
