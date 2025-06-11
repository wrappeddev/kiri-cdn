import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMedia } from '../contexts/MediaContext';
import { useModal } from '../components/UI/ModalProvider';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardContent } from '../components/UI/Card';

import {
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const MediaLibrary: React.FC = () => {
  const { files, loading, deleteFile } = useMedia();
  const { showSuccess, showError, confirmDelete } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos' | 'documents'>('all');

  // Could Implement: Better File Management
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('/');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Could Implement: Drag & Drop Upload
  const [isDragOver, setIsDragOver] = useState(false);

  // Could Implement: File Organization
  // const [folders, setFolders] = useState<Folder[]>([]);
  // const [showCreateFolder, setShowCreateFolder] = useState(false);

  // Could Implement: Advanced Filtering
  // const [dateRange, setDateRange] = useState<{start: Date, end: Date} | null>(null);
  // const [sizeRange, setSizeRange] = useState<{min: number, max: number} | null>(null);
  // const [tags, setTags] = useState<string[]>([]);

  // Could Implement: File Sharing
  // const [shareModal, setShareModal] = useState<{fileId: string, isOpen: boolean} | null>(null);
  // const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return PhotoIcon;
    if (mimeType.startsWith('video/')) return VideoCameraIcon;
    return DocumentIcon;
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'text-success';
    if (mimeType.startsWith('video/')) return 'text-accent';
    return 'text-warning';
  };

  // Filter files based on search term and type
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' ||
                       (filterType === 'images' && file.mimeType.startsWith('image/')) ||
                       (filterType === 'videos' && file.mimeType.startsWith('video/')) ||
                       (filterType === 'documents' && !file.mimeType.startsWith('image/') && !file.mimeType.startsWith('video/'));
    
    return matchesSearch && matchesType;
  });

  const handleDelete = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    const fileName = file?.originalName || 'this file';

    const confirmed = await confirmDelete(fileName);
    if (confirmed) {
      try {
        await deleteFile(fileId);
        showSuccess('File Deleted', `${fileName} has been successfully deleted.`);
      } catch (error) {
        showError('Delete Failed', 'Failed to delete the file. Please try again.');
      }
    }
  };

  // Could Implement: Bulk Operations
  // const handleBulkDelete = async () => {
  //   if (selectedFiles.length === 0) return;
  //   if (window.confirm(`Delete ${selectedFiles.length} files?`)) {
  //     try {
  //       await Promise.all(selectedFiles.map(id => deleteFile(id)));
  //       setSelectedFiles([]);
  //     } catch (error) {
  //       alert('Failed to delete some files');
  //     }
  //   }
  // };

  // const handleBulkMove = async (targetFolder: string) => {
  //   try {
  //     await moveFilesToFolder(selectedFiles, targetFolder);
  //     setSelectedFiles([]);
  //   } catch (error) {
  //     alert('Failed to move files');
  //   }
  // };

  // Could Implement: File Sharing
  // const handleCreateShareLink = async (fileId: string, expiresIn?: number) => {
  //   try {
  //     const link = await createShareableLink(fileId, {
  //       expiresIn: expiresIn || 24 * 60 * 60 * 1000, // 24 hours
  //       password: generateSecurePassword(),
  //       downloadLimit: 10
  //     });
  //     navigator.clipboard.writeText(link.url);
  //     alert('Share link copied to clipboard!');
  //   } catch (error) {
  //     alert('Failed to create share link');
  //   }
  // };

  // Could Implement: Advanced Search
  // const handleAdvancedSearch = (filters: {
  //   query: string;
  //   dateRange?: {start: Date, end: Date};
  //   sizeRange?: {min: number, max: number};
  //   tags?: string[];
  //   mimeTypes?: string[];
  // }) => {
  //   // Implement complex filtering logic
  //   const results = searchFiles(filters);
  //   setFilteredFiles(results);
  // };

  // Could Implement: Drag & Drop Upload
  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setIsDragOver(true);
  // };

  // const handleDragLeave = () => {
  //   setIsDragOver(false);
  // };

  // const handleDrop = async (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setIsDragOver(false);
  //   const droppedFiles = Array.from(e.dataTransfer.files);
  //   if (droppedFiles.length > 0) {
  //     try {
  //       await uploadFiles(droppedFiles);
  //       alert('Files uploaded successfully!');
  //     } catch (error) {
  //       alert('Upload failed');
  //     }
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Files</h1>
          <p className="text-text-muted mt-1">
            Manage your uploaded files ({filteredFiles.length} of {files.length} files)
          </p>
        </div>
        <Link to="/upload">
          <Button>Upload Files</Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-surface/50 rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="documents">Documents</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-surface/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-text-primary'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-text-primary'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Display */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-muted mt-2">Loading files...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">
              {searchTerm || filterType !== 'all' ? 'No files match your search criteria' : 'No files uploaded yet'}
            </p>
            <Link to="/upload">
              <Button className="mt-4">Upload Files</Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.mimeType);
            return (
              <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-surface/30 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {file.thumbnailUrl ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className={`h-12 w-12 ${getFileTypeColor(file.mimeType)}`} />
                    )}
                  </div>
                  
                  <h3 className="font-medium text-text-primary truncate mb-1">
                    {file.originalName}
                  </h3>
                  <p className="text-sm text-text-muted mb-3">
                    {formatFileSize(file.size)}
                  </p>
                  
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/media/${file.id}`}>
                      <Button size="sm" variant="outline" className="flex-1">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(file.url, '_blank')}
                      className="flex-1"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(file.id)}
                      className="flex-1 hover:bg-error hover:text-white"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-surface/50">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.mimeType);
                return (
                  <div key={file.id} className="p-4 hover:bg-surface/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {file.thumbnailUrl ? (
                          <img
                            src={file.thumbnailUrl}
                            alt={file.originalName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <FileIcon className={`h-8 w-8 ${getFileTypeColor(file.mimeType)}`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-text-primary truncate">
                          {file.originalName}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link to={`/media/${file.id}`}>
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(file.id)}
                          className="hover:bg-error hover:text-white"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaLibrary;
