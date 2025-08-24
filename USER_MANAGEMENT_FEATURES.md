# User Management Features

This document outlines the enhanced User Creation & Registration Management features that have been added to the Gym Management System.

## New Features Added

### 1. Admin User Creation

- **Interface**: Complete admin interface for creating new staff users
- **Features**:
  - Form-based user creation with validation
  - Role assignment (admin/staff)
  - Password creation
  - User profile information (name, email, username, phone)
- **Access**: Admin-only functionality
- **Route**: `/auth/management` (protected by admin middleware)

### 2. Bulk User Import

- **File Formats**: Support for CSV and Excel (.xlsx, .xls) files
- **Features**:
  - File upload with validation
  - Template download for correct format
  - Batch processing of multiple users
  - Error handling and reporting
  - Success/failure summary
- **File Size Limit**: 5MB maximum
- **Template**: Sample CSV template provided in `backend/sample_user_import_template.csv`

### 3. User Role Templates

- **Predefined Templates**:
  - **Administrator**: Full system access
  - **Staff Manager**: Member, equipment, and payment management
  - **Receptionist**: Member and payment management
  - **Trainer**: Member management only
- **Features**:
  - Permission-based role definitions
  - Quick application to new users
  - Customizable permissions

### 4. User Invitation System

- **Email Workflow**:
  - Automated email invitations
  - Temporary password generation
  - Professional HTML email templates
  - Invitation resend functionality
- **Features**:
  - SMTP email configuration
  - Customizable email templates
  - Invitation tracking
  - Password reset capabilities

## Technical Implementation

### Backend Changes

#### New Dependencies

```bash
npm install nodemailer multer csv-parser xlsx @types/nodemailer @types/multer
```

#### New Controllers

- `createUserByAdmin`: Admin-only user creation
- `bulkImportUsers`: CSV/Excel file processing
- `getUserTemplates`: Role template retrieval
- `inviteUser`: Email invitation system
- `resendInvitation`: Resend invitation emails

#### New Routes

```typescript
// Admin-only routes
router.post("/create", protect, adminRoute, createUserByAdmin);
router.post(
  "/bulk-import",
  protect,
  adminRoute,
  upload.single("file"),
  bulkImportUsers
);
router.get("/templates", protect, adminRoute, getUserTemplates);
router.post("/invite", protect, adminRoute, inviteUser);
router.post("/resend-invitation/:id", protect, adminRoute, resendInvitation);
```

#### Email Service

- `sendInvitationEmail`: User invitation emails
- `sendPasswordResetEmail`: Password reset emails
- SMTP configuration support
- Professional HTML email templates

### Frontend Changes

#### New Components

- `UserManagement.tsx`: Comprehensive user management dashboard
- Enhanced `AdministrativeFeatures.tsx`: User management tab

#### New Routes

```typescript
{
  path: "management",
  element: (
    <ProtectedRoute requireAdmin>
      <UserManagement />
    </ProtectedRoute>
  ),
}
```

#### API Integration

- `createUserByAdmin`: Create user API call
- `bulkImportUsers`: Bulk import API call
- `getUserTemplates`: Get templates API call
- `inviteUser`: Invite user API call

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Application Configuration
GYM_NAME="Gym Management System"
FRONTEND_URL="http://localhost:3000"
```

### File Upload Configuration

- Upload directory: `backend/uploads/`
- File size limit: 5MB
- Supported formats: CSV, Excel (.xlsx, .xls)
- Automatic file cleanup after processing

## Usage Guide

### 1. Accessing User Management

1. Navigate to Admin Dashboard
2. Click on "Administrative Features"
3. Select "User Management" tab
4. Click "Manage Users" to access full dashboard

### 2. Creating a New User

1. Click "Create User" button
2. Fill in user details (name, email, username, phone, password, role)
3. Submit form
4. User is created immediately

### 3. Bulk Importing Users

1. Download the CSV template
2. Fill in user data following the template format
3. Upload the file
4. Review import results
5. Address any errors if needed

### 4. Inviting Users

1. Click "Invite User" button
2. Fill in user details (no password required)
3. Submit invitation
4. User receives email with temporary credentials
5. User can log in and change password

### 5. Using Role Templates

1. Navigate to "User Templates" tab
2. Select desired template
3. Click "Use Template"
4. Template permissions are applied to new user creation

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── user.controller.ts (enhanced)
│   ├── routes/
│   │   └── user.route.ts (enhanced)
│   ├── utils/
│   │   └── email.ts (new)
│   └── uploads/ (new directory)
├── sample_user_import_template.csv (new)
└── .env.example (new)

frontend/
├── src/
│   ├── pages/users/
│   │   └── UserManagement.tsx (new)
│   ├── components/
│   │   └── AdministrativeFeatures.tsx (enhanced)
│   └── services/
│       └── api.ts (enhanced)
```

## Security Features

- **Admin-only access**: All new features require admin privileges
- **Input validation**: Comprehensive form validation
- **File type validation**: Only CSV and Excel files allowed
- **File size limits**: Prevents large file uploads
- **Email verification**: Secure invitation system
- **Password hashing**: Secure password storage

## Error Handling

- **File upload errors**: Invalid file types, size limits
- **Import errors**: Missing fields, duplicate emails, validation failures
- **Email errors**: SMTP failures, invalid email addresses
- **Database errors**: Connection issues, constraint violations
- **User feedback**: Clear error messages and success notifications

## Future Enhancements

- **Audit logging**: Track user creation and modification
- **Advanced permissions**: Granular permission system
- **User groups**: Group-based permission management
- **Two-factor authentication**: Enhanced security
- **SSO integration**: Single sign-on support
- **User activity monitoring**: Track user actions and login patterns

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP configuration and credentials
2. **File upload failing**: Verify file format and size
3. **Import errors**: Check CSV format matches template
4. **Permission denied**: Ensure user has admin role

### Debug Mode

Enable debug logging by setting environment variables:

```env
NODE_ENV=development
DEBUG=user-management:*
```

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.
