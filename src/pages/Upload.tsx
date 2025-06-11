import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedia } from '../contexts/MediaContext';
import { useModal } from '../components/UI/ModalProvider';
import Button from '../components/UI/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

interface FileWithPreview extends File {
  preview?: string;
}

const Upload: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { uploadFiles } = useMedia();
  const { showSuccess, showError } = useModal();
  const navigate = useNavigate();

  // Could Implement Upload Progress & Management
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadErrors, setUploadErrors] = useState<{[key: string]: string}>({});
  const [activeUploads, setActiveUploads] = useState<Set<string>>(new Set());

  // Could Implement: File Organization
  const [targetFolder, setTargetFolder] = useState<string>('/');
  const [createNewFolder, setCreateNewFolder] = useState<string>('');

  // Could Implement: File Processing Options
  const [compressionEnabled, setCompressionEnabled] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [autoTagging, setAutoTagging] = useState(true);

  // Could Implement: Upload Settings
  const [uploadSettings, setUploadSettings] = useState({
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['image/*', 'video/*', 'application/pdf', '.doc', '.docx'],
    generateThumbnails: true,
    virusScan: true,
    duplicateHandling: 'rename' as 'rename' | 'overwrite' | 'skip'
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return PhotoIcon;
    if (file.type.startsWith('video/')) return VideoCameraIcon;
    return DocumentIcon;
  };

  const getFileTypeColor = (file: File) => {
    if (file.type.startsWith('image/')) return 'text-success';
    if (file.type.startsWith('video/')) return 'text-accent';
    return 'text-warning';
  };

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => {
      const fileWithPreview = file as FileWithPreview;
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      return fileWithPreview;
    });
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      await uploadFiles(files);
      // Clean up previews
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      const fileCount = files.length;
      setFiles([]);
      showSuccess(
        'Upload Complete',
        `Successfully uploaded ${fileCount} ${fileCount === 1 ? 'file' : 'files'}.`
      );
      navigate('/media');
    } catch (error) {
      showError('Upload Failed', 'Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Could Implement: Advanced Upload with Progress
  // const handleAdvancedUpload = async () => {
  //   if (files.length === 0) return;
  //
  //   setUploading(true);
  //   const uploadPromises = files.map(async (file, index) => {
  //     const fileId = `file-${index}`;
  //     setActiveUploads(prev => new Set([...prev, fileId]));
  //
  //     try {
  //       // 1. Validate file
  //       await validateFile(file, uploadSettings);
  //
  //       // 2. Virus scan (if enabled)
  //       if (uploadSettings.virusScan) {
  //         await scanFileForViruses(file);
  //       }
  //
  //       // 3. Process file (compression, encryption)
  //       let processedFile = file;
  //       if (compressionEnabled && file.type.startsWith('image/')) {
  //         processedFile = await compressImage(file, { quality: 0.8 });
  //       }
  //       if (encryptionEnabled) {
  //         processedFile = await encryptFile(processedFile);
  //       }
  //
  //       // 4. Upload with progress tracking
  //       await uploadFileWithProgress(processedFile, {
  //         folder: targetFolder,
  //         onProgress: (progress) => {
  //           setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
  //         },
  //         generateThumbnail: uploadSettings.generateThumbnails,
  //         autoTag: autoTagging
  //       });
  //
  //       // 5. Generate metadata
  //       if (autoTagging) {
  //         await generateAutoTags(processedFile);
  //       }
  //
  //     } catch (error) {
  //       setUploadErrors(prev => ({
  //         ...prev,
  //         [fileId]: error.message || 'Upload failed'
  //       }));
  //     } finally {
  //       setActiveUploads(prev => {
  //         const newSet = new Set(prev);
  //         newSet.delete(fileId);
  //         return newSet;
  //       });
  //     }
  //   });
  //
  //   await Promise.allSettled(uploadPromises);
  //   setUploading(false);
  //
  //   // Show results summary
  //   const successCount = files.length - Object.keys(uploadErrors).length;
  //   alert(`Upload complete: ${successCount}/${files.length} files uploaded successfully`);
  // };

  // Could Implement: Cancel Upload
  // const cancelUpload = (fileId: string) => {
  //   // Cancel specific file upload
  //   cancelFileUpload(fileId);
  //   setActiveUploads(prev => {
  //     const newSet = new Set(prev);
  //     newSet.delete(fileId);
  //     return newSet;
  //   });
  // };

  // Could Implement: Duplicate Detection
  // const checkForDuplicates = async (newFiles: File[]) => {
  //   const duplicates = await findDuplicateFiles(newFiles);
  //   if (duplicates.length > 0) {
  //     const action = await showDuplicateDialog(duplicates);
  //     return handleDuplicates(newFiles, duplicates, action);
  //   }
  //   return newFiles;
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Upload Files</h1>
        <p className="text-text-muted mt-1">
          Upload your media files to the CDN
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-surface/50 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />
            
            <CloudArrowUpIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-text-muted">
              Support for images, videos, and documents up to 100MB each
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Files to Upload ({files.length})</CardTitle>
            <CardDescription>
              Review your files before uploading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {files.map((file, index) => {
                const FileIcon = getFileIcon(file);
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-surface/30 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <FileIcon className={`h-8 w-8 ${getFileTypeColor(file)}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-text-muted hover:text-error transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleUpload}
                loading={uploading}
                disabled={files.length === 0}
                className="flex-1"
              >
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  files.forEach(file => {
                    if (file.preview) {
                      URL.revokeObjectURL(file.preview);
                    }
                  });
                  setFiles([]);
                }}
                disabled={files.length === 0}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Supported Formats</h4>
              <ul className="text-sm text-text-muted space-y-1">
                <li>• Images: JPG, PNG, GIF, WebP, SVG</li>
                <li>• Videos: MP4, WebM, MOV, AVI</li>
                <li>• Documents: PDF, DOC, DOCX, TXT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">File Limits</h4>
              <ul className="text-sm text-text-muted space-y-1">
                <li>• Maximum file size: 100MB</li>
                <li>• Maximum files per upload: 50</li>
                <li>• Total storage limit: 10GB</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
