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
            const { token } = req.query;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    error: 'Token is required'
                });
            }

            // Verify token
            const email = await emailService.verifyToken(token);

            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid or expired token'
                });
            }

            // Set session
            req.session.email = email;

            // Redirect to dashboard
            res.redirect(config.app.publicDashboardUrl);

        } catch (error) {
            console.error('Magic link verification error:', error);
            res.status(500).json({
                success: false,
                error: 'Token verification failed'
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
