const { User } = require('../database');

class MeController {
    async getMe(req, res) {
        try {
            console.log('🔍 /api/me called');
            console.log('📋 Session:', req.session);
            console.log('📋 Session ID:', req.sessionID);
            console.log('📋 Cookies:', req.headers.cookie);

            const email = req.session.email;
            console.log('📧 Email from session:', email);

            if (!email) {
                console.log('❌ No email in session');
                return res.json({
                    active: false,
                    authenticated: false
                });
            }

            // Find user
            console.log('🔍 Looking up user in database...');
            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                console.log('❌ User not found in database');
                return res.json({
                    active: false,
                    authenticated: true,
                    email
                });
            }

            console.log('✅ User found:', { email: user.email, status: user.status, expires_at: user.expires_at });

            // Check if user is active and not expired
            const now = new Date();
            const isActive = user.status === 'active' &&
                user.expires_at &&
                user.expires_at > now;

            console.log('🔍 User status check:', {
                status: user.status,
                expires_at: user.expires_at,
                now: now,
                isActive: isActive
            });

            // Update status if expired
            if (user.status === 'active' && user.expires_at && user.expires_at <= now) {
                console.log('🔄 Updating expired user status');
                await user.update({ status: 'expired' });
            }

            const response = {
                active: isActive,
                authenticated: true,
                email: user.email,
                expires_at: user.expires_at,
                status: user.status
            };

            console.log('✅ /api/me response:', response);
            res.json(response);

        } catch (error) {
            console.error('❌ Get me error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user status'
            });
        }
    }
}

module.exports = new MeController();
