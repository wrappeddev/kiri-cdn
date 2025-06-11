import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMedia } from '../contexts/MediaContext';
import Button from '../components/UI/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { files, storageQuota } = useMedia();

  // Calculate stats
  const totalFiles = files.length;
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const imageFiles = files.filter(file => file.mimeType.startsWith('image/')).length;
  const videoFiles = files.filter(file => file.mimeType.startsWith('video/')).length;
  const documentFiles = files.filter(file =>
    file.mimeType.includes('pdf') ||
    file.mimeType.includes('document') ||
    file.mimeType.includes('text')
  ).length;

  // Could Implement: Advanced Analytics
  // const [analyticsData, setAnalyticsData] = useState<FileAnalytics | null>(null);
  // const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // useEffect(() => {
  //   const loadAnalytics = async () => {
  //     const data = await getFileAnalytics();
  //     setAnalyticsData(data);
  //   };
  //   loadAnalytics();
  // }, [timeRange]);

  // Could Implement: Storage Monitoring
  // const [storageAlerts, setStorageAlerts] = useState<StorageAlert[]>([]);
  // const [cleanupSuggestions, setCleanupSuggestions] = useState<CleanupSuggestion[]>([]);

  // Could Implement: Recent Activity
  // const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  // const [systemHealth, setSystemHealth] = useState<SystemHealthStatus>('healthy');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const recentFiles = files.slice(0, 5);

  const stats = [
    {
      name: 'Total Files',
      value: totalFiles.toString(),
      icon: PhotoIcon,
      color: 'text-primary',
    },
    {
      name: 'Storage Used',
      value: formatFileSize(totalSize),
      icon: ChartBarIcon,
      color: 'text-secondary',
    },
    {
      name: 'Images',
      value: imageFiles.toString(),
      icon: PhotoIcon,
      color: 'text-success',
    },
    {
      name: 'Videos',
      value: videoFiles.toString(),
      icon: VideoCameraIcon,
      color: 'text-accent',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-text-muted mt-2">
          Manage your private files and uploads.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/upload">
          <Card className="hover:bg-surface/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center p-6">
              <CloudArrowUpIcon className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="font-semibold text-text-primary">Upload Files</h3>
                <p className="text-sm text-text-muted">Add new media to your CDN</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/media">
          <Card className="hover:bg-surface/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center p-6">
              <PhotoIcon className="h-8 w-8 text-secondary mr-4" />
              <div>
                <h3 className="font-semibold text-text-primary">My Files</h3>
                <p className="text-sm text-text-muted">Browse your uploaded files</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/settings">
          <Card className="hover:bg-surface/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center p-6">
              <ChartBarIcon className="h-8 w-8 text-accent mr-4" />
              <div>
                <h3 className="font-semibold text-text-primary">Settings</h3>
                <p className="text-sm text-text-muted">Manage your account</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <stat.icon className={`h-8 w-8 ${stat.color} mr-4`} />
                <div>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Files */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>Your most recently uploaded files</CardDescription>
            </div>
            <Link to="/media">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentFiles.length > 0 ? (
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-surface/30 transition-colors">
                  <div className="flex-shrink-0">
                    {file.mimeType.startsWith('image/') ? (
                      <PhotoIcon className="h-8 w-8 text-success" />
                    ) : file.mimeType.startsWith('video/') ? (
                      <VideoCameraIcon className="h-8 w-8 text-accent" />
                    ) : (
                      <DocumentIcon className="h-8 w-8 text-warning" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {file.originalName}
                    </p>
                    <p className="text-sm text-text-muted">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center text-text-muted">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs">
                      {new Date(file.uploadedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PhotoIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No files uploaded yet</p>
              <Link to="/upload">
                <Button className="mt-4">
                  Upload your first file
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
