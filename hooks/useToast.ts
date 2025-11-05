import { useState, useCallback } from 'react';
import { ToastType } from '../components/Toast';

interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  icon?: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    icon?: string,
    duration: number = 5000
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, message, type, icon, duration };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, icon?: string, duration?: number) => {
    return showToast(message, 'success', icon, duration);
  }, [showToast]);

  const error = useCallback((message: string, icon?: string, duration?: number) => {
    return showToast(message, 'error', icon, duration);
  }, [showToast]);

  const warning = useCallback((message: string, icon?: string, duration?: number) => {
    return showToast(message, 'warning', icon, duration);
  }, [showToast]);

  const info = useCallback((message: string, icon?: string, duration?: number) => {
    return showToast(message, 'info', icon, duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};
