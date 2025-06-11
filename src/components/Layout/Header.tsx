import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  CloudIcon 
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Could Implement: Global Search
  // const [globalSearch, setGlobalSearch] = useState('');
  // const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Could Implement: Notifications
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [unreadCount, setUnreadCount] = useState(0);

  // Could Implement: Quick Actions
  // const [showQuickActions, setShowQuickActions] = useState(false);
  // const quickActions = [
  //   { name: 'Upload Files', action: () => navigate('/upload'), icon: CloudArrowUpIcon },
  //   { name: 'Create Folder', action: () => setShowCreateFolder(true), icon: FolderPlusIcon },
  //   { name: 'Share Link', action: () => setShowShareModal(true), icon: ShareIcon },
  // ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-surface border-b border-surface/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CloudIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-text-primary">Private CDN</span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/media"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Files
              </Link>
              <Link
                to="/upload"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Upload
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-text-muted" />
                  <span className="text-sm text-text-primary">{user.username}</span>
                </div>
                <Link
                  to="/settings"
                  className="p-2 text-text-muted hover:text-text-primary transition-colors"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-text-muted hover:text-error transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
