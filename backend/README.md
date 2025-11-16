# CyTutor Backend - Setup Guide

## New Features Added

### 1. User Profile Management
- Complete profile endpoint with avatar upload
- Get user profile with stats
- Update profile endpoint

### 2. Email Service
- Welcome email on signup
- Email verification
- Nodemailer integration

## Installation

```bash
cd backend
npm install
```

## New Dependencies

The following packages have been added:
- `multer` - File upload handling for avatars

## Environment Variables

Update your `.env` file with these new variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_FROM="CyTutor <noreply@cytutor.com>"

# Frontend URL
FRONTEND_URL=http://localhost:5000
```

## API Endpoints

### User Routes (`/api/user`)

#### Complete Profile
```
POST /api/user/complete-profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- fullName (required)
- username (required)
- email (required)
- experienceLevel (required)
- location (optional)
- interests (optional, JSON array)
- bio (optional)
- goals (optional)
- termsAccepted (required, boolean)
- avatar (optional, file)
```

#### Get Profile
```
GET /api/user/profile
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Email Routes (`/api/email`)

#### Send Welcome Email
```
POST /api/email/welcome
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "name": "John Doe",
  "username": "johndoe"
}
```

#### Send Verification Email
```
POST /api/email/verify
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "verificationCode": "123456"
}
```

## File Upload

Avatar images are stored in: `UI/uploads/avatars/`

Supported formats: JPEG, JPG, PNG, GIF, WEBP
Max file size: 5MB

## Email Configuration

### Development Mode
In development, emails are logged to console instead of being sent.

### Production Mode
Set `NODE_ENV=production` and configure SMTP settings in `.env`

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

## Running the Server

```bash
npm start        # Production
npm run dev      # Development with nodemon
```

## Testing Endpoints

### Complete Profile
```bash
curl -X POST http://localhost:5000/api/user/complete-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "fullName=John Doe" \
  -F "username=johndoe" \
  -F "email=john@example.com" \
  -F "experienceLevel=intermediate" \
  -F "termsAccepted=true" \
  -F "avatar=@/path/to/image.jpg"
```

### Send Welcome Email
```bash
curl -X POST http://localhost:5000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe"
  }'
```

## Troubleshooting

### Multer Errors
- Ensure upload directory exists: `UI/uploads/avatars/`
- Check file size limits (5MB max)
- Verify file type is an image

### Email Errors
- Check SMTP credentials
- Verify Gmail App Password
- Check firewall/network settings
- Review console logs for detailed errors

## Next Steps

1. Install dependencies: `npm install`
2. Update `.env` with email configuration
3. Create uploads directory: `mkdir -p ../UI/uploads/avatars`
4. Restart server: `npm run dev`
5. Test endpoints with Postman or curl
