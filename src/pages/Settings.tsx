import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../components/UI/ModalProvider';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useModal();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    uploadNotifications: true,
    securityAlerts: true,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Profile Updated', 'Your profile has been updated successfully!');
    } catch (error) {
      showError('Update Failed', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Password Mismatch', 'New passwords do not match. Please try again.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Password Updated', 'Your password has been updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showError('Update Failed', 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'api', name: 'API Keys', icon: KeyIcon },
    // Could Implement: Additional Settings Tabs
    // { id: 'storage', name: 'Storage', icon: CloudIcon },
    // { id: 'sharing', name: 'Sharing', icon: ShareIcon },
    // { id: 'backup', name: 'Backup', icon: ArchiveBoxIcon },
    // { id: 'advanced', name: 'Advanced', icon: CogIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-text-muted hover:text-text-primary hover:bg-surface/50'
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <Input
                    label="Username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                  <div className="pt-4">
                    <Button type="submit" loading={loading}>
                      Update Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    helperText="Must be at least 6 characters long"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <div className="pt-4">
                    <Button type="submit" loading={loading}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Email Notifications</h4>
                      <p className="text-sm text-text-muted">Receive email updates about your account</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface/50 rounded bg-surface"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Upload Notifications</h4>
                      <p className="text-sm text-text-muted">Get notified when uploads complete</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.uploadNotifications}
                      onChange={(e) => setNotifications(prev => ({ ...prev, uploadNotifications: e.target.checked }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface/50 rounded bg-surface"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Security Alerts</h4>
                      <p className="text-sm text-text-muted">Important security notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.securityAlerts}
                      onChange={(e) => setNotifications(prev => ({ ...prev, securityAlerts: e.target.checked }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface/50 rounded bg-surface"
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for programmatic access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-surface/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-text-primary">Primary API Key</h4>
                        <p className="text-sm text-text-muted font-mono">kiri_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button>Generate New Key</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
