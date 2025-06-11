import React, { createContext, useContext, useState, ReactNode } from 'react';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';

interface AlertOptions {
  title: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  buttonText?: string;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

interface ModalContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  confirmDelete: (itemName?: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalState {
  type: 'alert' | 'confirm' | null;
  isOpen: boolean;
  options: AlertOptions | ConfirmOptions | null;
  onConfirm?: () => void;
  loading?: boolean;
}

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
    options: null,
    loading: false,
  });

  const [confirmResolver, setConfirmResolver] = useState<((value: boolean) => void) | null>(null);

  const showAlert = (options: AlertOptions) => {
    setModalState({
      type: 'alert',
      isOpen: true,
      options,
      loading: false,
    });
  };

  const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmResolver(() => resolve);
      setModalState({
        type: 'confirm',
        isOpen: true,
        options,
        onConfirm: () => {
          resolve(true);
          closeModal();
        },
        loading: false,
      });
    });
  };

  const closeModal = () => {
    if (modalState.type === 'confirm' && confirmResolver) {
      confirmResolver(false);
      setConfirmResolver(null);
    }

    setModalState({
      type: null,
      isOpen: false,
      options: null,
      loading: false,
    });
  };

  const handleConfirm = async () => {
    if (modalState.onConfirm) {
      setModalState(prev => ({ ...prev, loading: true }));
      try {
        await modalState.onConfirm();
      } catch (error) {
        setModalState(prev => ({ ...prev, loading: false }));
      }
    }
  };

  // Convenience methods
  const showSuccess = (title: string, message: string) => {
    showAlert({ title, message, variant: 'success' });
  };

  const showError = (title: string, message: string) => {
    showAlert({ title, message, variant: 'error' });
  };

  const showWarning = (title: string, message: string) => {
    showAlert({ title, message, variant: 'warning' });
  };

  const showInfo = (title: string, message: string) => {
    showAlert({ title, message, variant: 'info' });
  };

  const confirmDelete = (itemName?: string) => {
    return showConfirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${itemName || 'this item'}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
  };

  const contextValue: ModalContextType = {
    showAlert,
    showConfirm,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirmDelete,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {modalState.type === 'alert' && modalState.options && (
        <AlertModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={modalState.options.title}
          message={modalState.options.message}
          variant={(modalState.options as AlertOptions).variant}
          buttonText={(modalState.options as AlertOptions).buttonText}
        />
      )}

      {modalState.type === 'confirm' && modalState.options && (
        <ConfirmModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={modalState.options.title}
          message={modalState.options.message}
          confirmText={(modalState.options as ConfirmOptions).confirmText}
          cancelText={(modalState.options as ConfirmOptions).cancelText}
          variant={(modalState.options as ConfirmOptions).variant}
          loading={modalState.loading}
        />
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
