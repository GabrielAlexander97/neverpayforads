const crypto = require('crypto');
const config = require('../config');
const { LoginToken } = require('../database');

class EmailService {
    constructor() {
        this.resendApiKey = config.email.resendApiKey;
        this.fromEmail = config.email.fromEmail;
    }

    async sendMagicLoginEmail(email) {
        try {
            // Generate token
            const token = crypto.randomBytes(32).toString('hex');
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

            // Set expiration (15 minutes)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);

            // Store token in database
            await LoginToken.create({
                email,
                token_hash: tokenHash,
                expires_at: expiresAt
            });

            // Create magic link - point to Railway backend
            const magicLink = `${config.app.backendUrl}/auth/magic/verify?token=${token}`;

            if (this.resendApiKey) {
                // Send email via Resend
                await this.sendViaResend(email, magicLink);
            } else {
                // Development mode - log the link
                console.log('🔗 Magic Login Link (Development):', magicLink);
            }

            return true;
        } catch (error) {
            console.error('Failed to send magic login email:', error);
            throw error;
        }
    }

    async sendViaResend(email, magicLink) {
        const { Resend } = require('resend');
        const resend = new Resend(this.resendApiKey);

        await resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: 'Your NeverPayForAds Dashboard Access',
            html: `
                <h2>Welcome to NeverPayForAds!</h2>
                <p>Click the link below to access your dashboard:</p>
                <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                    Access Dashboard
                </a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you didn't request this link, please ignore this email.</p>
            `
        });
    }

    async verifyToken(token) {
        try {
            console.log('🔐 EmailService: Starting token verification...');
            console.log('🔐 EmailService: Token received:', token.substring(0, 20) + '...');

            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            console.log('🔐 EmailService: Token hash:', tokenHash.substring(0, 20) + '...');

            console.log('🔍 EmailService: Searching for token in database...');
            const loginToken = await LoginToken.findOne({
                where: {
                    token_hash: tokenHash,
                    used: false,
                    expires_at: {
                        [require('sequelize').Op.gt]: new Date()
                    }
                }
            });

            if (!loginToken) {
                console.log('❌ EmailService: Token not found or already used/expired');
                console.log('🔍 EmailService: Current time:', new Date());
                return null;
            }

            console.log('✅ EmailService: Token found for email:', loginToken.email);
            console.log('✅ EmailService: Token expires at:', loginToken.expires_at);

            // Mark token as used
            console.log('🔄 EmailService: Marking token as used...');
            await loginToken.update({ used: true });
            console.log('✅ EmailService: Token marked as used');

            return loginToken.email;
        } catch (error) {
            console.error('❌ EmailService: Token verification failed:', error);
            console.error('❌ EmailService: Error stack:', error.stack);
            return null;
        }
    }
}

module.exports = new EmailService();
