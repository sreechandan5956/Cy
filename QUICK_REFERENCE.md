# CyTutor - Quick Reference Card

## 🚀 Start Application

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
bash start.sh
```

**Manual:**
```bash
cd backend
npm start
```

## 🌐 URLs

| Page | URL |
|------|-----|
| Home | http://localhost:5000 |
| Login | http://localhost:5000/Login.html |
| Signup | http://localhost:5000/signup.html |
| Dashboard | http://localhost:5000/dashboard.html |
| Health Check | http://localhost:5000/health.html |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/verify-otp | Verify email OTP |
| POST | /api/auth/resend-otp | Resend OTP |
| GET | /api/auth/me | Get current user (protected) |
| GET | /health | Server health check |

## 🔐 Authentication

**Token Storage:**
- Location: `localStorage`
- Key: `token`
- Format: JWT Bearer token

**User Data:**
- Location: `localStorage`
- Key: `user`
- Format: JSON object `{id, email, name}`

**Check Auth:**
```javascript
const isLoggedIn = !!localStorage.getItem('token');
```

**Logout:**
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = 'Login.html';
```

## 📝 Environment Variables

Required in `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cytutor_db
DB_USER=cytutor_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# OTP
OTP_EXPIRE_MINUTES=10
```

## 🗄️ Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  otp VARCHAR(6),
  otp_expiry TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Verify .env file exists and is configured
- Run `npm install` in backend directory

**Can't login:**
- Check if database is running
- Verify email is verified (check OTP)
- Check browser console for errors

**OTP not received:**
- Check email configuration in .env
- Verify EMAIL_PASSWORD is app password (not regular password)
- Check spam folder

**CORS errors:**
- Backend serves frontend, no CORS issues in development
- If using separate frontend server, update CORS in server.js

## 📦 Dependencies

**Backend:**
- express
- pg (PostgreSQL)
- bcrypt
- jsonwebtoken
- nodemailer
- dotenv
- cors
- helmet
- express-rate-limit
- express-validator

**Frontend:**
- No build dependencies (vanilla JS)
- Uses CDN for fonts and animations

## 🔧 Common Tasks

**Reset password:**
- Not implemented yet (future feature)

**Change email:**
- Not implemented yet (future feature)

**View logs:**
- Backend logs to console
- Check terminal where server is running

**Stop server:**
- Press `Ctrl+C` in terminal

## 📚 Documentation

- [INTEGRATION.md](INTEGRATION.md) - Detailed integration guide
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - What was changed
- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Setup instructions
