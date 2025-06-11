import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/Card';
import {
  CloudIcon,
  LockClosedIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

const Homepage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-20">
        <CloudIcon className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Private CDN
        </h1>
        <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
          Simple, secure file hosting for your private content. Upload, manage, and share your files with ease.
        </p>

        {user ? (
          <div className="space-x-4">
            <Link to="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="outline" size="lg">
                Upload Files
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link to="/login">
              <Button size="lg">
                Sign In
              </Button>
            </Link>
            <p className="text-sm text-text-muted mt-4">
              Contact your administrator for account access
            </p>
          </div>
        )}
      </div>

      {/* Simple Features */}
      <div className="py-16 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <ArrowUpTrayIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Easy Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted">
                  Drag and drop files or browse to upload. Supports images, videos, and documents.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <LockClosedIcon className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle>Private & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted">
                  Your files are private by default. Only you can access and manage your content.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CloudIcon className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted">
                  Quick access to your files with reliable hosting and fast download speeds.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
