import React from 'react';

export type ModalType = 'confirm' | 'alert' | 'info' | 'success' | 'error' | 'warning';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'confirm',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon,
}) => {
  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: icon || '✓',
          iconBg: 'bg-green-500',
          iconRing: 'ring-green-100',
          confirmBtn: 'bg-green-500 hover:bg-green-600 focus:ring-green-400',
        };
      case 'error':
        return {
          icon: icon || '✕',
          iconBg: 'bg-red-500',
          iconRing: 'ring-red-100',
          confirmBtn: 'bg-red-500 hover:bg-red-600 focus:ring-red-400',
        };
      case 'warning':
        return {
          icon: icon || '⚠',
          iconBg: 'bg-amber-500',
          iconRing: 'ring-amber-100',
          confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400',
        };
      case 'alert':
        return {
          icon: icon || '🔔',
          iconBg: 'bg-blue-500',
          iconRing: 'ring-blue-100',
          confirmBtn: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400',
        };
      case 'info':
        return {
          icon: icon || 'ℹ',
          iconBg: 'bg-blue-500',
          iconRing: 'ring-blue-100',
          confirmBtn: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400',
        };
      case 'confirm':
      default:
        return {
          icon: icon || '?',
          iconBg: 'bg-rose-500',
          iconRing: 'ring-rose-100',
          confirmBtn: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-400',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${styles.iconBg} ${styles.iconRing} w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ring-8 shadow-lg`}>
            <span className="text-white text-3xl sm:text-4xl font-bold">{styles.icon}</span>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {type !== 'alert' && type !== 'info' && (
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 ${styles.confirmBtn} text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Specific modal variants for common use cases
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={message}
      type="error"
      confirmText={confirmText}
      cancelText={cancelText}
      icon="🗑️"
    />
  );
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={message}
      type="confirm"
      confirmText={confirmText}
      cancelText={cancelText}
    />
  );
};

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  buttonText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'Got it',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      type={type}
      confirmText={buttonText}
    />
  );
};
