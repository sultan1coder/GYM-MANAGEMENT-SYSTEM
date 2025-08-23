# 🔐 Refresh Token System Implementation

## Overview

This document describes the complete refresh token system implemented for the Gym Management System backend, providing enhanced security and better user experience.

## 🏗️ Architecture

### Token Types

1. **Access Token**: Short-lived (15 minutes) for API requests
2. **Refresh Token**: Long-lived (7 days) for token renewal
3. **Token Version**: Database field for token invalidation

### Security Features

- HTTP-only cookies for refresh tokens
- Automatic token refresh on expiration
- Token versioning for logout invalidation
- Secure cookie settings in production

## 📡 API Endpoints

### 1. Login

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "isSuccess": true,
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Cookies Set:**

- `refreshToken`: HTTP-only, secure, 7 days expiry

### 2. Refresh Token

```
POST /api/auth/refresh
```

**Request:** No body required (uses cookie)
**Response:**

```json
{
  "isSuccess": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### 3. Logout

```
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <accessToken>`
**Response:**

```json
{
  "message": "Logged out successfully"
}
```

### 4. Who Am I

```
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <accessToken>`
**Response:**

```json
{
  "isSuccess": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

## 🔧 Implementation Details

### Backend Components

#### 1. Auth Utilities (`src/utils/auth.ts`)

```typescript
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateTokenPair = (
  userId: string,
  role: string,
  tokenVersion: number
): TokenPair => {
  const accessToken = generateToken({ id: userId, role });
  const refreshToken = generateRefreshToken({ id: userId, tokenVersion });
  return { accessToken, refreshToken };
};
```

#### 2. Auth Controller (`src/controllers/auth.controller.ts`)

- **Login**: Generates token pair, sets refresh token cookie
- **Refresh**: Validates refresh token, generates new token pair
- **Logout**: Increments token version, clears cookies

#### 3. Auth Middleware (`middlewares/auth.middleware.ts`)

- **Protect**: Validates access tokens
- **Admin Route**: Checks admin privileges

### Frontend Components

#### 1. Axios Interceptors (`src/lib/axios.ts`)

```typescript
// Automatic token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      // Attempt token refresh
      const response = await authAPI.refreshToken();
      // Retry original request with new token
    }
  }
);
```

#### 2. Auth API (`src/services/api.ts`)

```typescript
export const authAPI = {
  refreshToken: () => api.post<LoginResponse>(`${BASE_API_URL}/auth/refresh`),
  // ... other endpoints
};
```

## 🔒 Security Features

### 1. Token Expiration

- **Access Token**: 15 minutes (short-lived for security)
- **Refresh Token**: 7 days (long-lived for convenience)

### 2. Cookie Security

```typescript
res.cookie("refreshToken", refreshToken, {
  httpOnly: true, // Prevents XSS attacks
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict", // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### 3. Token Invalidation

- **Logout**: Increments `tokenVersion` in database
- **Refresh**: Validates token version before renewal
- **Security**: Invalidates all existing refresh tokens on logout

### 4. Automatic Refresh

- **Frontend**: Automatically refreshes expired tokens
- **Backend**: Validates refresh tokens before renewal
- **Seamless**: Users don't experience token expiration

## 🧪 Testing

### Test Script

Run the test script to verify the system:

```bash
cd backend
node test-refresh-token.js
```

### Manual Testing

1. **Login**: Get access and refresh tokens
2. **Use API**: Make requests with access token
3. **Wait/Expire**: Let access token expire (15 minutes)
4. **Auto-refresh**: Frontend automatically refreshes
5. **Logout**: Test token invalidation

## 🚀 Usage Examples

### Frontend Integration

```typescript
// Login
const loginResponse = await authAPI.loginUser(credentials);
// accessToken stored in localStorage
// refreshToken stored in HTTP-only cookie

// API calls automatically use access token
const userData = await authAPI.getCurrentUser();

// Token refresh happens automatically on 401 errors
// No manual intervention required
```

### Backend Integration

```typescript
// Protected routes automatically validate tokens
router.get("/protected", protect, (req, res) => {
  // req.user contains decoded token data
  res.json({ user: req.user });
});

// Admin routes check role
router.delete("/admin", protect, adminRoute, (req, res) => {
  // Only admins can access
});
```

## 🔧 Configuration

### Environment Variables

```env
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=production  # Enables secure cookies
```

### Database Schema

```prisma
model User {
  id              Int      @id @default(autoincrement())
  // ... other fields
  tokenVersion    Int      @default(0) // For token invalidation
}
```

## 📋 Best Practices

### 1. Token Management

- Keep access tokens short-lived (15 minutes)
- Use refresh tokens for longer sessions (7 days)
- Implement token versioning for security

### 2. Security

- HTTP-only cookies for refresh tokens
- Secure cookies in production
- SameSite strict to prevent CSRF
- Token versioning for logout invalidation

### 3. User Experience

- Automatic token refresh
- Seamless API calls
- Clear error handling
- Proper logout functionality

## 🐛 Troubleshooting

### Common Issues

1. **Token Expired**: Check if refresh token is valid
2. **Cookie Issues**: Ensure `withCredentials: true`
3. **CORS Problems**: Verify cookie settings
4. **Database Errors**: Check `tokenVersion` field exists

### Debug Steps

1. Check browser cookies
2. Verify token expiration
3. Test refresh endpoint manually
4. Check database token version

## 🎯 Benefits

### Security

- **Reduced Attack Window**: Short-lived access tokens
- **Secure Storage**: HTTP-only cookies for refresh tokens
- **Token Invalidation**: Proper logout security
- **Version Control**: Prevents token reuse

### User Experience

- **Seamless Operation**: No manual token management
- **Automatic Renewal**: Tokens refresh in background
- **Persistent Sessions**: Users stay logged in
- **Clean Logout**: Proper session termination

### Developer Experience

- **Simple Integration**: Minimal frontend changes
- **Automatic Handling**: No manual token refresh logic
- **Clear APIs**: Well-defined endpoints
- **Comprehensive Testing**: Built-in test scripts

## 🔮 Future Enhancements

1. **Multiple Device Support**: Track active sessions
2. **Token Rotation**: Regular refresh token updates
3. **Audit Logging**: Track token usage
4. **Rate Limiting**: Prevent abuse
5. **Device Fingerprinting**: Enhanced security

---

**Implementation Status**: ✅ Complete
**Security Level**: 🔒 High
**User Experience**: ⭐ Excellent
