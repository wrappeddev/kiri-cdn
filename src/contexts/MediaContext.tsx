import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  description?: string;
}

export interface MediaContextType {
  files: MediaFile[];
  loading: boolean;
  uploadFiles: (files: File[]) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  refreshFiles: () => Promise<void>;

  // Admin user management
  users: User[];
  createUser: (userData: CreateUserData) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUserFiles: (userId: string) => MediaFile[];
  deleteUserFile: (userId: string, fileId: string) => Promise<void>;

  // Could Implement: Storage Management
  storageQuota: {
    used: number;
    total: number;
    percentage: number;
  };

  // Could Implement: File Organization
  folders: Folder[];
  createFolder: (name: string, parentId?: string) => Promise<void>;
  moveFiles: (fileIds: string[], targetFolderId: string) => Promise<void>;

  // Could Implement: File Sharing & Security
  createShareLink: (fileId: string, options: ShareLinkOptions) => Promise<ShareLink>;
  revokeShareLink: (linkId: string) => Promise<void>;
  updateFilePermissions: (fileId: string, permissions: FilePermissions) => Promise<void>;

  // Could Implement: Advanced Search & Filtering
  searchFiles: (query: string, filters?: SearchFilters) => Promise<MediaFile[]>;
  getFilesByTag: (tags: string[]) => MediaFile[];
  getFileAnalytics: () => Promise<FileAnalytics>;
}

// Could Implement: Additional Types
interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  fileCount: number;
}

interface ShareLinkOptions {
  expiresIn?: number; // milliseconds
  password?: string;
  downloadLimit?: number;
  allowPreview?: boolean;
}

interface ShareLink {
  id: string;
  url: string;
  fileId: string;
  expiresAt?: string;
  downloadCount: number;
  downloadLimit?: number;
  isActive: boolean;
}

interface FilePermissions {
  isPublic: boolean;
  allowDownload: boolean;
  allowPreview: boolean;
  accessLevel: 'private' | 'shared' | 'public';
}

interface SearchFilters {
  dateRange?: { start: Date; end: Date };
  sizeRange?: { min: number; max: number };
  mimeTypes?: string[];
  tags?: string[];
  folderId?: string;
}

interface FileAnalytics {
  totalFiles: number;
  totalSize: number;
  fileTypeBreakdown: { [mimeType: string]: number };
  uploadTrends: { date: string; count: number }[];
  popularFiles: { fileId: string; downloads: number }[];
  storageGrowth: { date: string; size: number }[];
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};

interface MediaProviderProps {
  children: ReactNode;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    username: 'admin',
    role: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'john@example.com',
    username: 'john_doe',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'jane@example.com',
    username: 'jane_smith',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockFiles: MediaFile[] = [
  {
    id: '1',
    filename: 'sample-image-1.jpg',
    originalName: 'My Photo.jpg',
    mimeType: 'image/jpeg',
    size: 2048576,
    url: 'https://picsum.photos/800/600?random=1',
    thumbnailUrl: 'https://picsum.photos/200/150?random=1',
    uploadedBy: '1',
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['photo', 'landscape'],
    description: 'A beautiful landscape photo',
  },
  {
    id: '2',
    filename: 'document.pdf',
    originalName: 'Important Document.pdf',
    mimeType: 'application/pdf',
    size: 1024000,
    url: '/api/files/document.pdf',
    uploadedBy: '1',
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['document', 'pdf'],
    description: 'Important business document',
  },
  {
    id: '3',
    filename: 'video-sample.mp4',
    originalName: 'Sample Video.mp4',
    mimeType: 'video/mp4',
    size: 10485760,
    url: '/api/files/video-sample.mp4',
    thumbnailUrl: 'https://picsum.photos/200/150?random=3',
    uploadedBy: '1',
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
    tags: ['video', 'sample'],
    description: 'Sample video file',
  },
];

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<MediaFile[]>(mockFiles);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  const uploadFiles = async (filesToUpload: File[]) => {
    setLoading(true);
    try {
      // Mock upload - in real app, upload to your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFiles: MediaFile[] = filesToUpload.map((file, index) => ({
        id: Date.now().toString() + index,
        filename: `${Date.now()}-${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        uploadedBy: '1',
        uploadedAt: new Date().toISOString(),
        tags: [],
        description: '',
      }));
      
      setFiles(prev => [...newFiles, ...prev]);
    } catch (error) {
      throw new Error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id: string) => {
    setLoading(true);
    try {
      // Mock delete - in real app, call your API
      await new Promise(resolve => setTimeout(resolve, 500));
      setFiles(prev => prev.filter(file => file.id !== id));
    } catch (error) {
      throw new Error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshFiles = async () => {
    setLoading(true);
    try {
      // Mock refresh - in real app, fetch from your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo, we'll just keep the current files
    } catch (error) {
      throw new Error('Refresh failed');
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const createUser = async (userData: CreateUserData) => {
    setLoading(true);
    try {
      // Mock user creation - in real app, call your API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        username: userData.username,
        role: userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUsers(prev => [newUser, ...prev]);
    } catch (error) {
      throw new Error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      // Mock user deletion - in real app, call your API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Also delete all files belonging to this user
      setFiles(prev => prev.filter(file => file.uploadedBy !== userId));
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      throw new Error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getUserFiles = (userId: string): MediaFile[] => {
    return files.filter(file => file.uploadedBy === userId);
  };

  const deleteUserFile = async (userId: string, fileId: string) => {
    setLoading(true);
    try {
      // Mock file deletion - in real app, call your API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify the file belongs to the user before deleting
      const file = files.find(f => f.id === fileId && f.uploadedBy === userId);
      if (!file) {
        throw new Error('File not found or access denied');
      }

      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      throw new Error('Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  const value: MediaContextType = {
    files,
    loading,
    uploadFiles,
    deleteFile,
    refreshFiles,

    // User management
    users,
    createUser,
    deleteUser,
    getUserFiles,
    deleteUserFile,

    // Could Implement: Storage Management (placeholder implementations)
    storageQuota: {
      used: files.reduce((acc, file) => acc + file.size, 0),
      total: 10 * 1024 * 1024 * 1024, // 10GB
      percentage: (files.reduce((acc, file) => acc + file.size, 0) / (10 * 1024 * 1024 * 1024)) * 100
    },

    // Could Implement: File Organization (placeholder implementations)
    folders: [], // Would be loaded from API
    createFolder: async (name: string, parentId?: string) => {
      // Implementation: await api.createFolder({ name, parentId });
      console.log('Create folder:', name, parentId);
    },
    moveFiles: async (fileIds: string[], targetFolderId: string) => {
      // Implementation: await api.moveFiles(fileIds, targetFolderId);
      console.log('Move files:', fileIds, 'to', targetFolderId);
    },

    // Could Implement: File Sharing & Security (placeholder implementations)
    createShareLink: async (fileId: string, options: ShareLinkOptions) => {
      // Implementation: return await api.createShareLink(fileId, options);
      console.log('Create share link for:', fileId, options);
      return {
        id: 'mock-link-id',
        url: `https://cdn.example.com/share/${fileId}`,
        fileId,
        downloadCount: 0,
        isActive: true
      };
    },
    revokeShareLink: async (linkId: string) => {
      // Implementation: await api.revokeShareLink(linkId);
      console.log('Revoke share link:', linkId);
    },
    updateFilePermissions: async (fileId: string, permissions: FilePermissions) => {
      // Implementation: await api.updateFilePermissions(fileId, permissions);
      console.log('Update permissions for:', fileId, permissions);
    },

    // Could Implement: Advanced Search & Filtering (placeholder implementations)
    searchFiles: async (query: string, filters?: SearchFilters) => {
      // Implementation: return await api.searchFiles(query, filters);
      console.log('Search files:', query, filters);
      return files.filter(file =>
        file.originalName.toLowerCase().includes(query.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    },
    getFilesByTag: (tags: string[]) => {
      return files.filter(file =>
        tags.some(tag => file.tags.includes(tag))
      );
    },
    getFileAnalytics: async () => {
      // Implementation: return await api.getFileAnalytics();
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const fileTypeBreakdown = files.reduce((acc, file) => {
        const type = file.mimeType.split('/')[0];
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return {
        totalFiles: files.length,
        totalSize,
        fileTypeBreakdown,
        uploadTrends: [], // Would be calculated from upload history
        popularFiles: [], // Would be based on download counts
        storageGrowth: [] // Would be historical data
      };
    }
  };

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

