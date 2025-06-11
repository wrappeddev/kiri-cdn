import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  buttonText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  buttonText = 'OK',
}) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  const iconColors = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-primary',
  };

  const Icon = icons[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${iconColors[variant]}`} />
        </div>
        <div className="flex-1">
          <p className="text-text-primary mb-6">
            {message}
          </p>
          <div className="flex justify-end">
            <Button onClick={onClose}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
