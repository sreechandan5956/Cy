# Deployment Checklist

## Pre-Deployment

### Backend Configuration
- [ ] Create `.env` file from `.env.example`
- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Configure database credentials
- [ ] Set up email service (Gmail app password)
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS origin in `server.js`

### Database Setup
- [ ] PostgreSQL installed and running
- [ ] Database created (`cytutor_db`)
- [ ] User created with proper permissions
- [ ] Users table created
- [ ] Test database connection

### Dependencies
- [ ] Run `npm install` in backend directory
- [ ] Verify all packages installed correctly
- [ ] Check for security vulnerabilities: `npm audit`

### Frontend Configuration
- [ ] Update production domain in `UI/js/auth.js`
- [ ] Test all navigation links
- [ ] Verify all assets load correctly

## Testing

### Local Testing
- [ ] Start server: `npm start`
- [ ] Access home page: http://localhost:5000
- [ ] Test health check: http://localhost:5000/health.html
- [ ] Test signup flow
- [ ] Verify OTP email received
- [ ] Test OTP verification
- [ ] Test login
- [ ] Test dashboard access (authenticated)
- [ ] Test dashboard redirect (unauthenticated)
- [ ] Test logout

### API Testing
- [ ] POST /api/auth/register
- [ ] POST /api/auth/verify-otp
- [ ] POST /api/auth/resend-otp
- [ ] POST /api/auth/login
- [ ] GET /api/auth/me (with token)
- [ ] GET /health

### Security Testing
- [ ] Rate limiting works (100 req/15min)
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection

## Production Deployment

### Server Setup
- [ ] Node.js installed (v14+)
- [ ] PostgreSQL installed and configured
- [ ] SSL certificate installed
- [ ] Firewall configured (allow port 443/80)
- [ ] Process manager installed (PM2 recommended)

### Environment Variables
```bash
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=cytutor_db
DB_USER=cytutor_user
DB_PASSWORD=strong-password
JWT_SECRET=very-strong-secret-min-32-chars
JWT_EXPIRE=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
OTP_EXPIRE_MINUTES=10
```

### Code Updates
- [ ] Update CORS origin in `backend/server.js`
- [ ] Update API URL in `UI/js/auth.js`
- [ ] Enable helmet CSP if needed
- [ ] Set secure cookie flags

### Deployment Steps
1. [ ] Clone repository to server
2. [ ] Install dependencies: `npm install`
3. [ ] Set up environment variables
4. [ ] Run database migrations
5. [ ] Test application locally on server
6. [ ] Set up PM2 or similar process manager
7. [ ] Configure reverse proxy (Nginx/Apache)
8. [ ] Set up SSL/TLS
9. [ ] Configure domain DNS
10. [ ] Start application
11. [ ] Monitor logs

### PM2 Setup (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start application
cd backend
pm2 start server.js --name cytutor

# Save PM2 configuration
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Post-Deployment

### Verification
- [ ] Access production URL
- [ ] Test all functionality
- [ ] Check SSL certificate
- [ ] Verify email delivery
- [ ] Test from different devices
- [ ] Test from different networks
- [ ] Check browser console for errors
- [ ] Verify database connections

### Monitoring
- [ ] Set up application monitoring
- [ ] Configure error logging
- [ ] Set up uptime monitoring
- [ ] Configure backup system
- [ ] Set up alerts for errors
- [ ] Monitor server resources

### Documentation
- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures

## Maintenance

### Regular Tasks
- [ ] Monitor application logs
- [ ] Check database performance
- [ ] Review security updates
- [ ] Update dependencies
- [ ] Backup database regularly
- [ ] Monitor disk space
- [ ] Review rate limiting logs
- [ ] Check email delivery rates

### Security Updates
- [ ] Run `npm audit` regularly
- [ ] Update dependencies monthly
- [ ] Review access logs
- [ ] Rotate JWT secrets periodically
- [ ] Update SSL certificates before expiry

## Rollback Plan

### If Deployment Fails
1. [ ] Stop new application
2. [ ] Restore previous version
3. [ ] Verify database integrity
4. [ ] Check logs for errors
5. [ ] Fix issues
6. [ ] Test locally
7. [ ] Redeploy

### Database Rollback
1. [ ] Stop application
2. [ ] Restore database from backup
3. [ ] Verify data integrity
4. [ ] Restart application
5. [ ] Test functionality

## Support

### Common Issues
- **Can't connect to database**: Check credentials and firewall
- **OTP not received**: Verify email configuration
- **CORS errors**: Update CORS origin in server.js
- **Token expired**: User needs to login again
- **Rate limit hit**: Wait 15 minutes or adjust limits

### Logs Location
- Application logs: PM2 logs or console output
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`

### Emergency Contacts
- Database Admin: [contact]
- Server Admin: [contact]
- Email Service: [contact]
