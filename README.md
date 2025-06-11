# Kiri CDN - Frontend UI

A modern, secure private CDN management interface built with React, TypeScript, and Tailwind CSS. This frontend application provides a comprehensive user interface for managing file uploads, media libraries, and user administration for a private CDN service.

> **Note**: This is the frontend UI only. The backend API is implemented in a separate private repository.

## 🚀 Features

### 📁 File Management
- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Media Library**: Browse, search, and filter uploaded files
- **File Preview**: View images, videos, and documents with built-in viewer
- **Bulk Operations**: Select and manage multiple files at once
- **File Organization**: Support for folders and file categorization (planned)

### 👥 User Management
- **Admin-Controlled Access**: No public registration - admin creates all accounts
- **Role-Based Access**: User and admin roles with appropriate permissions
- **User Dashboard**: Personalized dashboard for each user
- **Account Settings**: Profile management and preferences

### 🎨 Modern UI/UX
- **Dark Theme**: Beautiful dark theme with custom color palette
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Custom Components**: Reusable UI components built with Headless UI
- **Modal System**: Consistent modal dialogs for better UX
- **Loading States**: Smooth loading indicators and transitions

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **Session Management**: Automatic token refresh and logout

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API

## 🎨 Design System

The application uses a custom dark theme with the following color palette:

- **Primary**: `#80aaff` - Blue accent for primary actions
- **Secondary**: `#8fbcbb` - Teal for secondary elements
- **Accent**: `#d290ff` - Purple for highlights and admin features
- **Background**: `#1e1e2f` - Dark background
- **Surface**: `#2a2a3d` - Card and component backgrounds

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kiri-cdn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Sidebar, etc.)
│   ├── Modals/         # Modal dialogs
│   └── UI/             # Base UI components (Button, Input, etc.)
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

### Key Pages

- **Homepage** (`/`) - Landing page with authentication
- **Dashboard** (`/dashboard`) - User dashboard with quick actions
- **Media Library** (`/media`) - Browse and manage uploaded files
- **Upload** (`/upload`) - File upload interface with drag & drop
- **Media Viewer** (`/media/:id`) - Individual file preview and details
- **Settings** (`/settings`) - User account settings
- **Admin Panel** (`/admin`) - Admin-only user management interface

### Component Architecture

The application follows a modular component architecture:

- **Layout Components**: Header, Sidebar, and main layout structure
- **UI Components**: Reusable components like Button, Input, Card, Modal
- **Context Providers**: Authentication and Media state management
- **Custom Hooks**: Reusable logic for common operations

## 🔌 API Integration

This frontend is designed to work with a private backend API. The application expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### File Management
- `GET /api/files` - List user files
- `POST /api/files/upload` - Upload files
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file
- `PUT /api/files/:id` - Update file metadata

### User Management (Admin)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/files` - Get user's files

## 🚀 Deployment

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_CDN_BASE_URL=https://your-cdn-domain.com
```

### Build and Deploy

1. **Build the application**
   ```bash
npm run build
```

2. **Deploy the `dist` folder** to your preferred hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

### Nginx Configuration (Optional)

If deploying to a server with Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary. All rights reserved.

## 🔮 Future Enhancements

- **File Organization**: Folder structure and file categorization
- **Advanced Search**: Full-text search and metadata filtering
- **Batch Operations**: Multi-file operations and bulk editing
- **Analytics Dashboard**: Usage statistics and insights
- **API Keys**: User-generated API keys for programmatic access
- **Webhooks**: Event notifications for file operations
- **CDN Analytics**: Bandwidth usage and performance metrics

---

**Note**: This is the frontend interface only. The backend API implementation is maintained in a separate private repository for security reasons.
