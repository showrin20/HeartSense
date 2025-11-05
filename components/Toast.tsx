import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  icon
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: icon || '✓',
          iconBg: 'bg-green-500',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: icon || '✕',
          iconBg: 'bg-red-500',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: icon || '⚠',
          iconBg: 'bg-amber-500',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: icon || 'ℹ',
          iconBg: 'bg-blue-500',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-slide-in-right`}>
      <div className={`${styles.bg} ${styles.border} border-2 rounded-xl shadow-2xl p-4 backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className={`${styles.iconBg} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
            {styles.icon}
          </div>
          <div className="flex-1">
            <p className={`${styles.text} font-medium text-sm sm:text-base leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="Close notification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className={`h-full ${styles.iconBg} animate-progress`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Container for multiple toasts
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: ToastType;
    icon?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="animate-slide-in-right"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          } border-2 rounded-xl shadow-2xl p-4 backdrop-blur-sm`}>
            <div className="flex items-start gap-3">
              <div className={`${
                toast.type === 'success' ? 'bg-green-500' :
                toast.type === 'error' ? 'bg-red-500' :
                toast.type === 'warning' ? 'bg-amber-500' :
                'bg-blue-500'
              } w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {toast.icon || (
                  toast.type === 'success' ? '✓' :
                  toast.type === 'error' ? '✕' :
                  toast.type === 'warning' ? '⚠' :
                  'ℹ'
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm sm:text-base leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="hover:opacity-70 transition-opacity flex-shrink-0"
                aria-label="Close notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress bar */}
            {toast.duration && toast.duration > 0 && (
              <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    toast.type === 'success' ? 'bg-green-500' :
                    toast.type === 'error' ? 'bg-red-500' :
                    toast.type === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  } animate-progress`}
                  style={{ animationDuration: `${toast.duration}ms` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
