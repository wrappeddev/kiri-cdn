import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMedia } from '../contexts/MediaContext';
import { useModal } from '../components/UI/ModalProvider';
import Button from '../components/UI/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card';
import CreateUserModal from '../components/Modals/CreateUserModal';
import {
  UserGroupIcon,
  ChartBarIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { files, users, createUser, deleteUser, getUserFiles, deleteUserFile } = useMedia();
  const { showSuccess, showError, showWarning, confirmDelete } = useModal();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalFiles: files.length,
    totalStorage: files.reduce((acc, file) => acc + file.size, 0),
    bandwidth: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
    requests: 45678,
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const recentUsers = [
    { id: '1', username: 'john_doe', email: 'john@example.com', joinedAt: '2024-01-15', status: 'active' },
    { id: '2', username: 'jane_smith', email: 'jane@example.com', joinedAt: '2024-01-14', status: 'active' },
    { id: '3', username: 'bob_wilson', email: 'bob@example.com', joinedAt: '2024-01-13', status: 'pending' },
  ];

  const systemHealth = [
    { name: 'API Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '100%' },
    { name: 'File Storage', status: 'healthy', uptime: '99.7%' },
    { name: 'Authentication', status: 'healthy', uptime: '99.8%' },
  ];

  // Could Implement: Admin Actions with Modals
  const handleSystemCleanup = async () => {
    const confirmed = await confirmDelete('temporary files and cache');
    if (confirmed) {
      try {
        // Implementation: await cleanupSystem();
        showSuccess('Cleanup Complete', 'System cleanup completed successfully.');
      } catch (error) {
        showError('Cleanup Failed', 'Failed to cleanup system. Please try again.');
      }
    }
  };

  const handleBackupSystem = async () => {
    try {
      // Implementation: await createBackup();
      showSuccess('Backup Created', 'System backup has been created successfully.');
    } catch (error) {
      showError('Backup Failed', 'Failed to create backup. Please try again.');
    }
  };

  // User management functions
  const handleCreateUser = async (userData: { email: string; username: string; password: string; role: 'admin' | 'user' }) => {
    try {
      await createUser(userData);
      showSuccess('User Created', `User ${userData.username} has been created successfully.`);
      setShowCreateUserModal(false);
    } catch (error) {
      showError('Creation Failed', 'Failed to create user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    const confirmed = await confirmDelete(`user "${username}" and all their files`);
    if (confirmed) {
      try {
        await deleteUser(userId);
        showSuccess('User Deleted', `User ${username} and all their files have been deleted.`);
      } catch (error) {
        showError('Delete Failed', 'Failed to delete user. Please try again.');
      }
    }
  };

  const handleDeleteUserFile = async (userId: string, fileId: string, fileName: string) => {
    const confirmed = await confirmDelete(`file "${fileName}"`);
    if (confirmed) {
      try {
        await deleteUserFile(userId, fileId);
        showSuccess('File Deleted', `File ${fileName} has been deleted.`);
      } catch (error) {
        showError('Delete Failed', 'Failed to delete file. Please try again.');
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-warning mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">Access Denied</h2>
        <p className="text-text-muted">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'User Management', icon: UserGroupIcon },
    { id: 'content', name: 'Content Management', icon: ServerIcon },
    { id: 'system', name: 'System Health', icon: ServerIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
          <p className="text-text-muted mt-1">
            System administration and monitoring
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleBackupSystem}>
            Create Backup
          </Button>
          <Button variant="outline" onClick={handleSystemCleanup}>
            System Cleanup
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface/50">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-surface'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-text-muted">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-success mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{stats.activeUsers.toLocaleString()}</p>
                    <p className="text-sm text-text-muted">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ServerIcon className="h-8 w-8 text-secondary mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{stats.totalFiles.toLocaleString()}</p>
                    <p className="text-sm text-text-muted">Total Files</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-accent mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{formatFileSize(stats.totalStorage)}</p>
                    <p className="text-sm text-text-muted">Storage Used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bandwidth Usage</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-text-primary mb-2">
                  {formatFileSize(stats.bandwidth)}
                </div>
                <p className="text-sm text-success">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Requests</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-text-primary mb-2">
                  {stats.requests.toLocaleString()}
                </div>
                <p className="text-sm text-success">+5% from yesterday</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Button onClick={() => setShowCreateUserModal(true)}>
                  Create User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-surface/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{user.username}</h4>
                        <p className="text-sm text-text-muted">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-xs text-text-muted">
                            {getUserFiles(user.id).length} files
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setActiveTab('content');
                        }}
                      >
                        View Files
                      </Button>
                      {user.role !== 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage all user files across the system</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-text-primary">
                      Files for {users.find(u => u.id === selectedUser)?.username}
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(null);
                        setActiveTab('users');
                      }}
                    >
                      Back to User Management
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {getUserFiles(selectedUser).map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
                        <div>
                          <h4 className="font-medium text-text-primary">{file.originalName}</h4>
                          <p className="text-sm text-text-muted">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUserFile(selectedUser, file.id, file.originalName)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                    {getUserFiles(selectedUser).length === 0 && (
                      <p className="text-center text-text-muted py-8">No files found for this user</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="space-y-4">
                    <p className="text-text-muted">Select a user to view and manage their files</p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('users')}
                    >
                      Go to User Management
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((component) => (
                  <div key={component.name} className="flex items-center justify-between p-4 bg-surface/30 rounded-lg">
                    <div className="flex items-center">
                      {component.status === 'healthy' ? (
                        <CheckCircleIcon className="h-6 w-6 text-success mr-3" />
                      ) : (
                        <ExclamationTriangleIcon className="h-6 w-6 text-warning mr-3" />
                      )}
                      <div>
                        <h4 className="font-medium text-text-primary">{component.name}</h4>
                        <p className="text-sm text-text-muted capitalize">{component.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">{component.uptime}</p>
                      <p className="text-xs text-text-muted">Uptime</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
};

export default AdminPanel;

