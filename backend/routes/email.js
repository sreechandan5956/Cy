const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create email transporter
const createTransporter = () => {
    // For development, use ethereal email (fake SMTP)
    // For production, use real SMTP service (Gmail, SendGrid, etc.)
    
    if (process.env.NODE_ENV === 'production') {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else {
        // Development: Log to console instead of sending
        return {
            sendMail: async (mailOptions) => {
                console.log('\n📧 Email would be sent:');
                console.log('To:', mailOptions.to);
                console.log('Subject:', mailOptions.subject);
                console.log('Preview URL: [Development Mode - Email not sent]');
                return { messageId: 'dev-' + Date.now() };
            }
        };
    }
};

// Load and process email template
const loadEmailTemplate = (templateName, variables) => {
    const templatePath = path.join(__dirname, '../../email-templates', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace variables
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, variables[key]);
    });
    
    return template;
};

// Send welcome email
router.post('/welcome', async (req, res) => {
    try {
        const { email, name, username } = req.body;

        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email and name are required'
            });
        }

        const transporter = createTransporter();

        // Prepare template variables
        const variables = {
            name: name,
            username: username,
            email: email,
            joinDate: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            dashboardUrl: process.env.FRONTEND_URL || 'http://localhost:5000/dashboard.html',
            unsubscribeUrl: process.env.FRONTEND_URL || 'http://localhost:5000' + '/unsubscribe',
            privacyUrl: process.env.FRONTEND_URL || 'http://localhost:5000' + '/privacy',
            termsUrl: process.env.FRONTEND_URL || 'http://localhost:5000' + '/terms'
        };

        // Load and process template
        const htmlContent = loadEmailTemplate('welcome-email', variables);

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"CyTutor" <noreply@cytutor.com>',
            to: email,
            subject: 'Welcome to CyTutor - Start Your Cybersecurity Journey! 🚀',
            html: htmlContent,
            text: `Welcome to CyTutor, ${name}!\n\nYour account has been successfully created.\n\nUsername: ${username}\nEmail: ${email}\n\nGet started: ${variables.dashboardUrl}\n\nHappy learning!\nThe CyTutor Team`
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Welcome email sent:', info.messageId);

        res.json({
            success: true,
            message: 'Welcome email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Send email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send welcome email',
            error: error.message
        });
    }
});

// Send verification email
router.post('/verify', async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode) {
            return res.status(400).json({
                success: false,
                message: 'Email and verification code are required'
            });
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"CyTutor" <noreply@cytutor.com>',
            to: email,
            subject: 'Verify Your Email - CyTutor',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #e5e5e5; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px;">
                    <h1 style="color: #22c55e; text-align: center;">Verify Your Email</h1>
                    <p>Your verification code is:</p>
                    <div style="background: rgba(34, 197, 94, 0.1); padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h2 style="color: #22c55e; font-size: 32px; letter-spacing: 8px; margin: 0;">${verificationCode}</h2>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p style="color: #aaa; font-size: 14px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
                </div>
            `,
            text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Verification email sent:', info.messageId);

        res.json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        console.error('❌ Send verification email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification email'
        });
    }
});

module.exports = router;
