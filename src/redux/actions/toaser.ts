export const showToast = (toastType: any, toastMessage: any) => {
  return {
    type: 'SHOW_TOAST',
    payload: { toastType, toastMessage }
  };
};