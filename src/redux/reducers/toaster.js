const initialState = {
    toastMessage: '',
    toastType: 'info'
  };
  
const toasterReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SHOW_TOAST':
        return {
          ...state,
          toastMessage: action.payload.toastMessage,
          toastType: action.payload.toastType
        };

      default:
        return state;
    }
};
  
export default toasterReducer;
  