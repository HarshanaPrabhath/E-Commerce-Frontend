const initialState = {
  orders: [],
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    default:
      return state;
  }
};

