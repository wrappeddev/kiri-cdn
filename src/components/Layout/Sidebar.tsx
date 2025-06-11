import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import {
  HomeIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Files', href: '/media', icon: PhotoIcon },
    { name: 'Upload', href: '/upload', icon: CloudArrowUpIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: UserGroupIcon },
  ];

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
      <div className="flex flex-col flex-grow bg-surface border-r border-surface/50 pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-surface/50 hover:text-text-primary'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-6 w-6',
                    isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
                  )}
                />
                {item.name}
              </Link>
            );
          })}

          {user.role === 'admin' && (
            <>
              <div className="pt-6">
                <div className="px-2">
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Administration
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  {adminNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-accent/10 text-accent'
                            : 'text-text-muted hover:bg-surface/50 hover:text-text-primary'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'mr-3 flex-shrink-0 h-6 w-6',
                            isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
