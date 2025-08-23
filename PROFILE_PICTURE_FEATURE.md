# Profile Picture Feature

This document describes the profile picture functionality implemented in the Gym Management System.

## Overview

The profile picture feature allows both staff members and gym members to:

- Upload and manage their profile pictures
- View their profile pictures in the header and profile dropdown
- Access a dedicated profile settings page
- Update profile information

## Features

### 1. Profile Picture Display

- **Header Avatar**: Shows profile picture or initials in the top-right corner
- **Profile Dropdown**: Larger profile picture display with user information
- **Hover Effects**: Camera icon overlay appears on hover to indicate editability

### 2. Profile Picture Management

- **Upload Interface**: Modal dialog for selecting and uploading images
- **File Validation**:
  - Image files only (JPG, PNG, GIF)
  - Maximum file size: 5MB
  - Recommended dimensions: 400x400 pixels
- **Preview**: Real-time preview of selected image before upload
- **Remove Option**: Ability to remove selected file before upload

### 3. Profile Settings Page

- **Dedicated Route**: `/profile` - Full profile management interface
- **Profile Information**: Editable fields for name, email, phone, etc.
- **Security Settings**: Password change and 2FA options (placeholder)
- **Responsive Design**: Works on both desktop and mobile devices

## Technical Implementation

### Backend Changes

#### Database Schema

```prisma
model User {
  // ... existing fields
  profile_picture String?  // URL to profile picture
}

model Member {
  // ... existing fields
  profile_picture String?  // URL to profile picture
}
```

#### API Endpoints

- `PUT /users/profile-picture/:id` - Update staff profile picture
- `PUT /members/profile-picture/:id` - Update member profile picture

#### Controllers

- `updateProfilePicture` in `user.controller.ts`
- `updateMemberProfilePicture` in `members.controller.ts`

### Frontend Changes

#### Components

- **ProfileManager**: Modal for uploading and managing profile pictures
- **Profile**: Enhanced header profile dropdown with picture support
- **ProfileSettings**: Full profile management page

#### Services

- `userAPI.updateProfilePicture()` - Staff profile picture updates
- `memberAPI.updateProfilePicture()` - Member profile picture updates

#### Routes

- `/profile` - Protected route for profile settings

## Usage Instructions

### For Staff Members

1. Click on your profile picture/avatar in the header
2. Select "Change Profile Picture" from the dropdown
3. Choose an image file (max 5MB)
4. Click "Upload" to save changes
5. Access full profile settings via "Profile Settings" button

### For Gym Members

1. Click on your profile picture/avatar in the header
2. Select "Change Profile Picture" from the dropdown
3. Choose an image file (max 5MB)
4. Click "Upload" to save changes
5. Access full profile settings via "Profile Settings" button

### Profile Settings Page

1. Navigate to `/profile` or click "Profile Settings" in dropdown
2. Use "Change Picture" button to open profile picture manager
3. Edit profile information using the "Edit Profile" button
4. Save changes when finished editing

## File Structure

```
frontend/src/
├── components/
│   ├── ProfileManager.tsx      # Profile picture upload modal
│   └── profile.tsx            # Enhanced header profile component
├── pages/
│   └── ProfileSettings.tsx    # Full profile management page
├── services/
│   └── api.ts                # API functions for profile updates
└── types/
    ├── users/login.ts         # Updated User interface
    └── members/memberLogin.ts # Updated Member interface

backend/src/
├── controllers/
│   ├── user.controller.ts     # Profile picture update for staff
│   └── members.controller.ts  # Profile picture update for members
└── routes/
    ├── user.route.ts          # Staff profile picture route
    └── members.route.ts       # Member profile picture route
```

## Current Limitations

### 1. File Storage

- **Current**: Uses placeholder images and mock URLs
- **Production**: Requires integration with cloud storage (AWS S3, Cloudinary, etc.)

### 2. Image Processing

- **Current**: No image resizing or optimization
- **Production**: Should implement server-side image processing

### 3. File Upload

- **Current**: Simulated upload process
- **Production**: Real file upload handling with progress tracking

## Future Enhancements

### 1. Cloud Storage Integration

- AWS S3 bucket setup
- Cloudinary integration
- Automatic image optimization

### 2. Advanced Image Features

- Image cropping and resizing
- Multiple image formats support
- Thumbnail generation

### 3. Security Improvements

- File type validation on server
- Virus scanning for uploaded files
- Rate limiting for uploads

### 4. User Experience

- Drag and drop file upload
- Image editing tools
- Bulk profile picture updates for admins

## Testing

### Manual Testing Steps

1. **Login**: Test with both staff and member accounts
2. **Profile Picture Upload**: Try uploading different image types and sizes
3. **Profile Settings**: Navigate to profile page and test editing
4. **Responsive Design**: Test on different screen sizes
5. **Error Handling**: Test with invalid files and network errors

### Test Accounts

- **Staff**: Use existing staff account or create new one
- **Member**: Use existing member account or create new one
- **Admin**: Use admin account for testing admin-specific features

## Troubleshooting

### Common Issues

1. **Profile picture not displaying**: Check if user has `profile_picture` field in database
2. **Upload failing**: Verify API endpoints are accessible and working
3. **Image not updating**: Clear browser cache and refresh page
4. **Permission errors**: Ensure user is authenticated and has proper permissions

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check database for profile picture field values
4. Test API endpoints directly with tools like Postman

## Dependencies

### Frontend

- React Router for navigation
- Redux for state management
- Lucide React for icons
- React Hot Toast for notifications

### Backend

- Express.js for API routes
- Prisma for database operations
- JWT for authentication
- Multer for file uploads (when implemented)

## Security Considerations

1. **File Validation**: Server-side file type and size validation
2. **Authentication**: All profile picture operations require valid JWT token
3. **Authorization**: Users can only update their own profile pictures
4. **File Size Limits**: Maximum file size restrictions to prevent abuse
5. **Image Sanitization**: Validate image files to prevent malicious uploads

## Performance Considerations

1. **Image Optimization**: Compress and resize images before storage
2. **Caching**: Implement browser and CDN caching for profile pictures
3. **Lazy Loading**: Load profile pictures only when needed
4. **Thumbnails**: Generate and use smaller images for UI elements
