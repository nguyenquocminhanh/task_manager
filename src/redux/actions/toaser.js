export const showToast = (toastType, toastMessage) => {
  return {
    type: 'SHOW_TOAST',
    payload: { toastType, toastMessage }
  };
};