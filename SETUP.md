# CyTutor Setup Documentation

## 🎯 Project Overview

CyTutor is a hands-on cybersecurity learning platform designed to provide interactive challenges and educational content similar to HackTheBox, TryHackMe, and PortSwigger Labs. This B.Tech Computer Science and Engineering (Cyber Security) project is developed by Team #06 at TIFAC-CORE in Cyber Security, Amrita School of Computing.

## 📋 Prerequisites

Before setting up CyTutor, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🏗️ Project Structure

```
CyTutor/
├── UI/                          # Frontend interface files
│   ├── index.html              # Landing page
│   ├── login.html              # User login page
│   ├── signup.html             # User registration page
│   ├── dashboard.html          # User dashboard
│   ├── challenges.html         # Challenge listing page
│   ├── domains.html            # Domain categorization
│   └── cytutor_redesign.html   # Redesigned interface
├── Challenges/                  # Security challenges directory
│   ├── WEB/                    # Web security challenges
│   │   └── secret/             # Example web challenge
│   ├── DOS/                    # Denial of Service challenges
│   └── Privilage_Escalation/   # Privilege escalation challenges
├── README.md                   # Project documentation
└── SETUP.md                    # This setup guide
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mstejas610/CyTutor.git
cd CyTutor
```

### 2. Database Setup (PostgreSQL)

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE cytutor;
CREATE USER cytutor_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cytutor TO cytutor_user;
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database and email credentials
nano .env
```

### 4. Start the Application

**Using startup scripts:**

On Linux/Mac:
```bash
bash start.sh
```

On Windows:
```bash
start.bat
```

**Or manually:**
```bash
cd backend
npm start
```

Access the application at `http://localhost:5000`

## 🔧 Development Workflow

### 1. Frontend Development

```bash
# Make changes to HTML/CSS/JS files in UI directory
# The backend serves static files from UI directory
# Restart the server to see changes

cd backend
npm run dev  # For auto-reload during development
```

### 2. Backend Development

```bash
# Navigate to backend directory
cd backend

# Start with auto-reload
npm run dev

# Run tests (if available)
npm test
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    otp VARCHAR(6),
    otp_expiry TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes
- **Email OTP Verification**: 6-digit OTP with 10-minute expiry
- **Security Headers**: Helmet.js for HTTP security headers
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: express-validator for request validation

## 📝 Features

### Current Features
- User registration with email verification
- OTP-based email verification
- Secure JWT authentication
- Protected dashboard and routes
- Cybersecurity learning challenges
- Multiple security domains (Web Security, Cryptography, Forensics, etc.)

### Future Enhancements
- [ ] User progress tracking
- [ ] Leaderboard system
- [ ] Challenge hints system
- [ ] Discussion forums
- [ ] Mobile responsive design
- [ ] Password reset functionality

## 🤝 Contributing

### Development Guidelines
1. Follow consistent code formatting
2. Test all changes locally before committing
3. Write clear commit messages
4. Update documentation for new features

### Submitting Changes
```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make your changes
git add .
git commit -m "feat: add new feature"

# Push changes
git push origin feature/new-feature

# Create a pull request on GitHub
```

## 📞 Support & Contact

- **Team Lead**: [Sai Tejas M](https://github.com/mstejas610)
- **Team Members**: 
  - [Asrita NL](https://github.com/luckyasrita-16)
  - [Chinni Nagasree Hansica](https://github.com/HansicaChinni)
  - [Tangella Sree Chandan](https://github.com/sreechandan5956)
- **Institution**: TIFAC-CORE in Cyber Security, Amrita School of Computing
- **Mentor**: Sitaram Chamarty, Professor of Practice

## 📄 License

This project is part of academic coursework for B.Tech Computer Science and Engineering (Cyber Security) at Amrita Vishwa Vidyapeetham.

---

**Note**: This is an active development project. Some features mentioned in this documentation may not be fully implemented yet. Please refer to the current issues and roadmap for the latest development status.