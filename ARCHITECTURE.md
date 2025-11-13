# CyTutor Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Home    │  │  Login   │  │  Signup  │  │Dashboard │   │
│  │ (Public) │  │ (Public) │  │ (Public) │  │(Protected)│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                          │                                   │
│                    localStorage                              │
│                  (token, user data)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Express Server (Port 5000)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware Stack                         │  │
│  │  • Helmet (Security Headers)                          │  │
│  │  • CORS (Cross-Origin)                                │  │
│  │  • Rate Limiting (100 req/15min)                      │  │
│  │  • Body Parser (JSON)                                 │  │
│  │  • Static Files (UI directory)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│         ┌─────────────────┴─────────────────┐               │
│         │                                   │               │
│    ┌────▼─────┐                      ┌──────▼──────┐       │
│    │   API    │                      │   Static    │       │
│    │  Routes  │                      │    Files    │       │
│    │ /api/*   │                      │   (UI/*)    │       │
│    └────┬─────┘                      └─────────────┘       │
│         │                                                    │
│    ┌────▼─────────────────────────┐                        │
│    │    Auth Routes               │                        │
│    │  • POST /register            │                        │
│    │  • POST /login               │                        │
│    │  • POST /verify-otp          │                        │
│    │  • POST /resend-otp          │                        │
│    │  • GET  /me (protected)      │                        │
│    └────┬─────────────────────────┘                        │
│         │                                                    │
└─────────┼────────────────────────────────────────────────────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼───┐  ┌────▼────┐
│  DB   │  │  Email  │
│ (PG)  │  │ (SMTP)  │
└───────┘  └─────────┘
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  User    │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. POST /api/auth/register                  │
     │  {name, email, password}                     │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Hash    │
     │                                          │Password │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │Generate │
     │                                          │  OTP    │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │  Save   │
     │                                          │  to DB  │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │  Send   │
     │                                          │  Email  │
     │                                          └────┬────┘
     │                                               │
     │  2. {message: "Check email for OTP"}         │
     │<──────────────────────────────────────────────┤
     │                                               │
     │  3. Check Email                               │
     │  (Receive OTP: 123456)                        │
     │                                               │
     │  4. POST /api/auth/verify-otp                 │
     │  {email, otp: "123456"}                       │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Verify  │
     │                                          │  OTP    │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │Generate │
     │                                          │  JWT    │
     │                                          └────┬────┘
     │                                               │
     │  5. {token: "eyJ...", message: "Verified"}   │
     │<──────────────────────────────────────────────┤
     │                                               │
     │  6. Store token in localStorage               │
     │                                               │
     │  7. POST /api/auth/login                      │
     │  {email, password}                            │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Verify  │
     │                                          │Password │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │Generate │
     │                                          │  JWT    │
     │                                          └────┬────┘
     │                                               │
     │  8. {token: "eyJ...", user: {...}}           │
     │<──────────────────────────────────────────────┤
     │                                               │
     │  9. Store token & user in localStorage        │
     │                                               │
     │  10. GET /api/auth/me                         │
     │  Authorization: Bearer eyJ...                 │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                          ┌────▼────┐
     │                                          │ Verify  │
     │                                          │  JWT    │
     │                                          └────┬────┘
     │                                               │
     │                                          ┌────▼────┐
     │                                          │  Fetch  │
     │                                          │  User   │
     │                                          └────┬────┘
     │                                               │
     │  11. {user: {id, email, name, ...}}          │
     │<──────────────────────────────────────────────┤
     │                                               │
```

## File Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── db.js              # PostgreSQL connection
│   │   └── email.js           # Nodemailer setup
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── routes/
│   │   └── auth.js            # Auth endpoints
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example env file
│   ├── package.json           # Dependencies
│   └── server.js              # Main server file ⭐
│
├── UI/
│   ├── js/
│   │   ├── auth.js            # Auth functions ⭐
│   │   └── config.js          # API configuration
│   ├── styles/
│   │   └── cyber-noir.css     # Shared styles
│   ├── index.html             # Home page ⭐
│   ├── Login.html             # Login page ⭐
│   ├── signup.html            # Signup page ⭐
│   ├── verify-otp.html        # OTP verification
│   ├── dashboard.html         # Protected dashboard ⭐
│   └── health.html            # Health check
│
├── start.sh                   # Linux/Mac startup
├── start.bat                  # Windows startup
├── INTEGRATION.md             # Integration guide
├── INTEGRATION_SUMMARY.md     # Changes summary
├── QUICK_REFERENCE.md         # Quick reference
├── ARCHITECTURE.md            # This file
└── README.md                  # Project readme

⭐ = Modified for integration
```

## Data Flow

### Registration
```
User Input → Validation → Hash Password → Generate OTP → 
Save to DB → Send Email → Return Success
```

### Login
```
User Input → Validation → Verify Password → Check Verified → 
Generate JWT → Return Token + User Data
```

### Protected Route Access
```
Request → Extract Token → Verify JWT → Extract User ID → 
Fetch User Data → Return Response
```

## Security Layers

1. **Helmet** - Security headers
2. **CORS** - Cross-origin protection
3. **Rate Limiting** - DDoS protection
4. **bcrypt** - Password hashing (12 rounds)
5. **JWT** - Stateless authentication
6. **Input Validation** - express-validator
7. **OTP Expiry** - Time-limited codes
8. **HTTPS** - Encrypted transport (production)

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Logic
- **localStorage** - Client-side storage
- **Fetch API** - HTTP requests

### DevOps
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: dotenv
