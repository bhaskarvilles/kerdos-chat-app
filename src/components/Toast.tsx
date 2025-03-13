import { toast } from "sonner";

// Instead of a component, we'll export functions to show toasts
export const showToast = (message: string, type: 'default' | 'success' | 'error' | 'info' = 'default') => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'info':
      toast.info(message);
      break;
    default:
      toast(message);
  }
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId);
  }
};
