import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { RootState } from '../pages/AllTasks/AllTasks';

const Toaster: React.FC = props => {  
  const toastMessage = useSelector((state: RootState)=> state.toaster.toastMessage);
  const toastType = useSelector((state: RootState)=> state.toaster.toastType);

  useEffect(() => {
    if (toastMessage) {
        switch(toastType) {
            case 'info':
                toast.info(toastMessage);
                break;
            case 'error':
                toast.error(toastMessage);
                break;
            case 'success':
                toast.success(toastMessage);
                break;
            default:
                toast.info(toastMessage);
                break;
        }
        
    };
  }, [toastMessage, toastType])

  return (
    <ToastContainer 
        pauseOnFocusLoss={false}
        closeOnClick
        autoClose={2000}/>
  )
}

export default Toaster;