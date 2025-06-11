import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { UserPlusIcon } from '@heroicons/react/24/outline';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: {
    email: string;
    username: string;
    password: string;
    role: 'admin' | 'user';
  }) => Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreateUser,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onCreateUser(formData);
      setFormData({
        email: '',
        username: '',
        password: '',
        role: 'user',
      });
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        email: '',
        username: '',
        password: '',
        role: 'user',
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New User"
      size="md"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <UserPlusIcon className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-medium text-text-primary">Add User Account</h3>
            <p className="text-sm text-text-muted">Create a new user account for the CDN</p>
          </div>
        </div>

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={errors.email}
          placeholder="user@example.com"
          disabled={loading}
          required
        />

        <Input
          label="Username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          error={errors.username}
          placeholder="Enter username"
          disabled={loading}
          required
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          error={errors.password}
          placeholder="Enter password"
          helperText="Must be at least 6 characters long"
          disabled={loading}
          required
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
            disabled={loading}
            className="w-full px-3 py-2 border border-surface/50 rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
          <p className="text-xs text-text-muted mt-1">
            Users can upload and manage their own files. Administrators have full system access.
          </p>
        </div>

        <div className="flex space-x-3 justify-end pt-6 border-t border-surface/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;
