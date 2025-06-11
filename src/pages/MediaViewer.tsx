import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMedia } from '../contexts/MediaContext';
import { useModal } from '../components/UI/ModalProvider';
import Button from '../components/UI/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card';
import ShareModal from '../components/Modals/ShareModal';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ShareIcon,
  TagIcon,
  CalendarIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

const MediaViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { files, deleteFile } = useMedia();
  const { showSuccess, showError, confirmDelete } = useModal();
  const [showShareModal, setShowShareModal] = useState(false);

  const file = files.find(f => f.id === id);

  if (!file) {
    return (
      <div className="text-center py-12">
        <DocumentIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">File Not Found</h2>
        <p className="text-text-muted mb-4">The file you're looking for doesn't exist.</p>
        <Link to="/media">
          <Button>Back to Media Library</Button>
        </Link>
      </div>
    );
  }

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

  const handleDelete = async () => {
    const confirmed = await confirmDelete(file.originalName);
    if (confirmed) {
      try {
        await deleteFile(file.id);
        showSuccess('File Deleted', `${file.originalName} has been successfully deleted.`);
        navigate('/media');
      } catch (error) {
        showError('Delete Failed', 'Failed to delete the file. Please try again.');
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const FileIcon = getFileIcon(file.mimeType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/media')}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{file.originalName}</h1>
            <p className="text-text-muted">{file.mimeType}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(file.url, '_blank')}
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-surface/30 rounded-lg flex items-center justify-center overflow-hidden">
                {file.mimeType.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.originalName}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : file.mimeType.startsWith('video/') ? (
                  <video
                    src={file.url}
                    controls
                    className="max-w-full max-h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-center">
                    <FileIcon className="h-16 w-16 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted">Preview not available</p>
                    <Button
                      className="mt-4"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      Open File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-muted">File Name</label>
                <p className="text-text-primary">{file.filename}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-text-muted">Original Name</label>
                <p className="text-text-primary">{file.originalName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-text-muted">File Size</label>
                <p className="text-text-primary">{formatFileSize(file.size)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-text-muted">MIME Type</label>
                <p className="text-text-primary font-mono text-sm">{file.mimeType}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-text-muted" />
                <div>
                  <label className="text-sm font-medium text-text-muted">Uploaded</label>
                  <p className="text-text-primary text-sm">
                    {new Date(file.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File URL</CardTitle>
              <CardDescription>Direct link to your file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-surface/30 rounded-lg">
                  <p className="text-sm font-mono text-text-primary break-all">
                    {file.url}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="w-full"
                >
                  Copy URL
                </Button>
              </div>
            </CardContent>
          </Card>

          {file.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TagIcon className="h-5 w-5 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {file.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {file.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-primary">{file.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        fileUrl={file.url}
        fileName={file.originalName}
      />
    </div>
  );
};

export default MediaViewer;
