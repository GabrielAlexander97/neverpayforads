const { User, Membership } = require('../database');
const emailService = require('../services/emailService');
const config = require('../config');

class AdminController {
    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 25;
            const offset = (page - 1) * limit;

            const { count, rows: users } = await User.findAndCountAll({
                limit,
                offset,
                order: [['created_at', 'DESC']],
                include: [{
                    model: Membership,
                    as: 'memberships',
                    required: false
                }]
            });

            res.json({
                success: true,
                data: {
                    users,
                    pagination: {
                        page,
                        limit,
                        total: count,
                        pages: Math.ceil(count / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get users'
            });
        }
    }

    async extendMembership(req, res) {
        try {
            const { email } = req.params;

            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const newExpiry = new Date();
            newExpiry.setDate(newExpiry.getDate() + 30);

            await user.update({
                status: 'active',
                expires_at: newExpiry
            });

            res.json({
                success: true,
                message: 'Membership extended by 30 days',
                data: {
                    email: user.email,
                    expires_at: newExpiry
                }
            });

        } catch (error) {
            console.error('Extend membership error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to extend membership'
            });
        }
    }

    async deactivateUser(req, res) {
        try {
            const { email } = req.params;

            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            await user.update({
                status: 'inactive'
            });

            res.json({
                success: true,
                message: 'User deactivated successfully'
            });

        } catch (error) {
            console.error('Deactivate user error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to deactivate user'
            });
        }
    }

    async resendMagicLink(req, res) {
        try {
            const { email } = req.params;

            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            await emailService.sendMagicLoginEmail(email);

            res.json({
                success: true,
                message: 'Magic link sent successfully'
            });

        } catch (error) {
            console.error('Resend magic link error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send magic link'
            });
        }
    }

    async getWebhookLogs(req, res) {
        try {
            // In a real implementation, you'd store webhook logs in the database
            // For now, return a placeholder
            res.json({
                success: true,
                data: {
                    logs: [],
                    message: 'Webhook logging not implemented yet'
                }
            });

        } catch (error) {
            console.error('Get webhook logs error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get webhook logs'
            });
        }
    }
}

module.exports = new AdminController();
