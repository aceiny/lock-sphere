import { toast, Toast, ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastStyles {
  success: ToastOptions;
  error: ToastOptions;
  info: ToastOptions;
}

const toastStyles: ToastStyles = {
  success: {
    duration: 4000,
    icon: '✅',
    className: 'bg-green-50',
    style: {
      padding: '16px',
      color: '#15803d',
      border: '1px solid #86efac',
    },
  },
  error: {
    duration: 5000,
    icon: '❌',
    className: 'bg-red-50',
    style: {
      padding: '16px',
      color: '#b91c1c',
      border: '1px solid #fca5a5',
    },
  },
  info: {
    duration: 3000,
    icon: 'ℹ️',
    className: 'bg-blue-50',
    style: {
      padding: '16px',
      color: '#1d4ed8',
      border: '1px solid #93c5fd',
    },
  },
};

interface ToastHandlerProps {
  type: ToastType;
  message: string | string[];
  duration?: number;
}

const ToastHandler = ({
  type,
  message,
  duration,
}: ToastHandlerProps): string => {
  const displayMessage = Array.isArray(message) ? message[0] : message;
  switch (type) {
    case 'success' : return toast.success(displayMessage)
    break 
    case 'error' : return toast.error(displayMessage)
    break
  }
  return ''
};

// Convenience methods
export const showSuccessToast = (message: string | string[], duration?: number) => 
  ToastHandler({ type: 'success', message, duration });

export const showErrorToast = (message: string | string[], duration?: number) => 
  ToastHandler({ type: 'error', message, duration });

export default ToastHandler;