# CyTutor Setup Guide

## Quick Start

### Windows
```bash
setup-dev.bat
start.bat
```

### Linux/Mac
```bash
chmod +x setup-dev.sh start.sh
./setup-dev.sh
./start.sh
```

## Detailed Setup

### 1. Prerequisites
- Node.js 16+ and npm
- (Optional) PostgreSQL for database
- (Optional) SMTP credentials for emails

### 2. Initial Setup

Run the setup script:
```bash
# Windows
setup-dev.bat

# Linux/Mac
./setup-dev.sh
```

This will:
- ✅ Check Node.js installation
- ✅ Create `.env` file from template
- ✅ Install npm dependencies
- ✅ Create required directories (`UI/uploads/avatars`, `logs`)
- ✅ Set up `.gitignore` for uploads

### 3. Configure Environment

Edit `backend/.env` with your settings:

```env
# Server
PORT=5000
NODE_ENV=development

# JWT (REQUIRED)
JWT_SECRET=your_secure_random_string_min_32_chars
JWT_EXPIRE=24h

# Database (Optional - for production)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cytutor_db
DB_USER=cytutor_user
DB_PASSWORD=your_password

# Email (Optional - for welcome emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="CyTutor <noreply@cytutor.com>"

# Frontend
FRONTEND_URL=http://localhost:5000
```

### 4. Start the Server

```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

Server will start on: http://localhost:5000

### 5. Development Mode (Auto-reload)

```bash
cd backend
npm run dev
```

## Features

### User Onboarding
- ✅ OTP-based authentication
- ✅ Multi-step profile completion
- ✅ Avatar upload
- ✅ Terms & privacy acceptance
- ✅ Welcome email
- ✅ Onboarding checklist

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login

#### User Profile
- `POST /api/user/complete-profile` - Complete profile with avatar
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

#### Email
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/verify` - Send verification email

## Directory Structure

```
CyTutor/
├── backend/
│   ├── config/          # Configuration files
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   │   ├── auth.js      # Authentication
│   │   ├── user.js      # User management
│   │   └── email.js     # Email service
│   ├── .env             # Environment variables
│   ├── server.js        # Main server file
│   └── package.json     # Dependencies
├── UI/
│   ├── uploads/
│   │   └── avatars/     # User avatars
│   ├── complete-profile.html
│   ├── profile.html
│   └── ...
├── email-templates/
│   └── welcome-email.html
├── setup-dev.bat/sh     # Setup scripts
└── start.bat/sh         # Start scripts
```

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to Google Account → Security
   - App Passwords → Generate
3. Use App Password in `.env`:
   ```env
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_char_app_password
   ```

### Development Mode
Emails are logged to console instead of being sent.

### Production Mode
Set `NODE_ENV=production` to send real emails.

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Dependencies Issues
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Upload Directory Permissions
```bash
# Linux/Mac
chmod -R 755 UI/uploads
```

### Email Not Sending
- Check SMTP credentials
- Verify Gmail App Password
- Check firewall settings
- Review console logs

## Testing

### Test Profile Completion
```bash
curl -X POST http://localhost:5000/api/user/complete-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "fullName=John Doe" \
  -F "username=johndoe" \
  -F "email=john@example.com" \
  -F "experienceLevel=intermediate" \
  -F "termsAccepted=true"
```

### Test Welcome Email
```bash
curl -X POST http://localhost:5000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe","username":"johndoe"}'
```

## Production Deployment

1. Set environment variables:
   ```env
   NODE_ENV=production
   PORT=5000
   ```

2. Use process manager:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name cytutor
   pm2 save
   pm2 startup
   ```

3. Set up reverse proxy (nginx/Apache)

4. Enable HTTPS with SSL certificate

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review backend console output
- Check browser console for frontend errors

## License

MIT License - See LICENSE file for details
