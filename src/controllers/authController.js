const emailService = require('../services/emailService');
const config = require('../config');

class AuthController {
    async sendMagicLink(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: 'Email is required'
                });
            }

            // Send magic login email
            await emailService.sendMagicLoginEmail(email);

            res.json({
                success: true,
                message: 'Magic link sent successfully'
            });

        } catch (error) {
            console.error('Magic link send error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send magic link'
            });
        }
    }

    async verifyMagicLink(req, res) {
        try {
            console.log('🔐 Magic link verification started...');
            console.log('📋 Query params:', req.query);

            const { token } = req.query;

            if (!token) {
                console.log('❌ No token provided');
                return res.status(400).json({
                    success: false,
                    error: 'Token is required'
                });
            }

            console.log('🔍 Token received:', token.substring(0, 20) + '...');

            // Verify token
            console.log('🔐 Verifying token...');
            const email = await emailService.verifyToken(token);

            if (!email) {
                console.log('❌ Token verification failed - invalid or expired');
                return res.status(400).json({
                    success: false,
                    error: 'Invalid or expired token'
                });
            }

            console.log('✅ Token verified successfully for email:', email);

            // Set session
            console.log('👤 Setting session...');
            req.session.email = email;
            console.log('✅ Session set:', req.session);

            // Force save the session
            req.session.save((err) => {
                if (err) {
                    console.error('❌ Failed to save session:', err);
                } else {
                    console.log('✅ Session saved successfully');
                }
            });

            // Redirect to dashboard
            console.log('🔄 Redirecting to:', config.app.publicDashboardUrl);
            res.redirect(config.app.publicDashboardUrl);

        } catch (error) {
            console.error('❌ Magic link verification error:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                error: 'Token verification failed',
                details: error.message
            });
        }
    }

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Logout failed'
                });
            }

            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    }
}

module.exports = new AuthController();
