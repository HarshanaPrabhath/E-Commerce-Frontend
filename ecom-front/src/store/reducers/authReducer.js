const initialState = {
  user: null,
  address: [],
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { user:null,
        address:null
       };

    default:
      return state;
  }
};
