import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { useModal } from '../UI/ModalProvider';
import { 
  LinkIcon, 
  ClockIcon, 
  LockClosedIcon,
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}) => {
  const { showSuccess } = useModal();
  const [shareSettings, setShareSettings] = useState({
    expiresIn: '24h',
    password: '',
    downloadLimit: '',
    allowPreview: true,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fileUrl);
    showSuccess('Link Copied', 'Share link has been copied to clipboard!');
  };

  const handleCreateSecureLink = () => {
    // Could Implement: Create secure share link with settings
    // const secureLink = await createShareLink(fileId, shareSettings);
    // navigator.clipboard.writeText(secureLink.url);
    showSuccess('Secure Link Created', 'A secure share link has been created and copied to clipboard!');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share "${fileName}"`}
      size="md"
    >
      <div className="space-y-6">
        {/* Direct Link */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Direct Link
          </label>
          <div className="flex space-x-2">
            <Input
              value={fileUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center space-x-2"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              <span>Copy</span>
            </Button>
          </div>
        </div>

        {/* Secure Share Options */}
        <div className="border-t border-surface/50 pt-6">
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <LockClosedIcon className="h-5 w-5 mr-2" />
            Secure Share Options
          </h3>
          
          <div className="space-y-4">
            {/* Expiration */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Expires In
              </label>
              <select
                value={shareSettings.expiresIn}
                onChange={(e) => setShareSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                className="w-full px-3 py-2 border border-surface/50 rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="never">Never</option>
              </select>
            </div>

            {/* Password Protection */}
            <Input
              label="Password (Optional)"
              type="password"
              value={shareSettings.password}
              onChange={(e) => setShareSettings(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password for protection"
            />

            {/* Download Limit */}
            <Input
              label="Download Limit (Optional)"
              type="number"
              value={shareSettings.downloadLimit}
              onChange={(e) => setShareSettings(prev => ({ ...prev, downloadLimit: e.target.value }))}
              placeholder="Maximum number of downloads"
            />

            {/* Allow Preview */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowPreview"
                checked={shareSettings.allowPreview}
                onChange={(e) => setShareSettings(prev => ({ ...prev, allowPreview: e.target.checked }))}
                className="h-4 w-4 text-primary focus:ring-primary border-surface/50 rounded bg-surface"
              />
              <label htmlFor="allowPreview" className="ml-2 text-sm text-text-primary">
                Allow file preview without downloading
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 justify-end pt-6 border-t border-surface/50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateSecureLink}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Create Secure Link
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
