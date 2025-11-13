# Frontend-Backend Integration Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your database and email credentials.

### 2. Database Setup

Run the PostgreSQL setup script:
```bash
bash setup_postgres.sh
```

Or manually create the database and users table:
```sql
CREATE DATABASE cytutor_db;
CREATE USER cytutor_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cytutor_db TO cytutor_user;

\c cytutor_db

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

### 3. Start the Server

```bash
cd backend
npm start
```

The server will:
- Run on `http://localhost:5000`
- Serve the frontend from the `UI` directory
- Provide API endpoints at `/api/auth/*`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## API Endpoints

All endpoints are prefixed with `/api/auth`:

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /verify-otp` - Verify email with OTP
- `POST /resend-otp` - Resend OTP
- `GET /me` - Get current user (requires auth token)

## Frontend Pages

- `/` or `/index.html` - Home page
- `/Login.html` - Login page
- `/signup.html` - Sign up page
- `/verify-otp.html` - OTP verification page
- `/dashboard.html` - User dashboard (protected)

## Authentication Flow

1. User signs up → OTP sent to email
2. User verifies OTP → JWT token issued
3. Token stored in localStorage
4. Protected pages check for token
5. API calls include token in Authorization header

## Configuration

### Development
Frontend automatically connects to `http://localhost:5000`

### Production
Update `UI/js/auth.js` with your production domain:
```javascript
const API_URL = 'https://your-production-domain.com/api/auth';
```

## Testing

1. Sign up with a valid email
2. Check email for OTP code
3. Verify OTP
4. Login with credentials
5. Access dashboard

## Notes

- CORS is enabled for all origins in development
- Rate limiting: 100 requests per 15 minutes
- JWT tokens expire in 24 hours (configurable)
- OTP expires in 10 minutes (configurable)
