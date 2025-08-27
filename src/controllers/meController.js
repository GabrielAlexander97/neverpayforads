const { User } = require('../database');

class MeController {
    async getMe(req, res) {
        try {
            const email = req.session.email;

            if (!email) {
                return res.json({
                    active: false,
                    authenticated: false
                });
            }

            // Find user
            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return res.json({
                    active: false,
                    authenticated: true,
                    email
                });
            }

            // Check if user is active and not expired
            const now = new Date();
            const isActive = user.status === 'active' &&
                user.expires_at &&
                user.expires_at > now;

            // Update status if expired
            if (user.status === 'active' && user.expires_at && user.expires_at <= now) {
                await user.update({ status: 'expired' });
            }

            res.json({
                active: isActive,
                authenticated: true,
                email: user.email,
                expires_at: user.expires_at,
                status: user.status
            });

        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user status'
            });
        }
    }
}

module.exports = new MeController();
