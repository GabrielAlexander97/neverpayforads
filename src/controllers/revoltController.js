const revoltService = require('../services/revoltService');
const { getCurrentUser, isUserSubscribed } = require('../utils/userUtils');

class RevoltController {
    async getMessages(req, res) {
        try {
            const messages = await revoltService.getMessages(10);

            res.json({
                success: true,
                data: messages,
                message: "Revolt messages retrieved successfully"
            });
        } catch (error) {
            console.error('Error in Revolt messages controller:', error);

            if (error.message.includes('Channel not found') || error.message.includes('404')) {
                res.status(404).json({
                    success: false,
                    error: "Channel not found",
                    message: error.message,
                    suggestion: "Please check your REVOLT_CHANNEL_ID and ensure the bot has access to the channel"
                });
            } else if (error.message.includes('Bot token is invalid') || error.message.includes('401')) {
                res.status(401).json({
                    success: false,
                    error: "Invalid bot token",
                    message: error.message,
                    suggestion: "Please check your REVOLT_BOT_TOKEN"
                });
            } else if (error.message.includes('permission') || error.message.includes('403')) {
                res.status(403).json({
                    success: false,
                    error: "Permission denied",
                    message: error.message,
                    suggestion: "Ensure the bot has permission to access the channel"
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: "Failed to fetch Revolt messages",
                    message: error.message
                });
            }
        }
    }

    async testConfiguration(req, res) {
        try {
            console.log('Testing Revolt configuration...');

            const results = {
                botToken: false,
                channelAccess: false,
                messages: false,
                details: {}
            };

            // Test bot token
            try {
                await revoltService.testBotToken();
                results.botToken = true;
                console.log('✅ Bot token is valid');
            } catch (error) {
                console.log('❌ Bot token test failed:', error.message);
                results.details.botTokenError = error.message;
            }

            // Test channel access
            try {
                await revoltService.testChannelAccess();
                results.channelAccess = true;
                console.log('✅ Channel access confirmed');
            } catch (error) {
                console.log('❌ Channel access test failed:', error.message);
                results.details.channelError = error.message;
            }

            // Test message fetching
            try {
                const messages = await revoltService.getMessages(5);
                results.messages = true;
                results.details.messageCount = messages.length;
                console.log('✅ Message fetching works');
            } catch (error) {
                console.log('❌ Message fetching failed:', error.message);
                results.details.messageError = error.message;
            }

            const allTestsPassed = results.botToken && results.channelAccess && results.messages;

            res.json({
                success: allTestsPassed,
                data: results,
                message: allTestsPassed
                    ? "All Revolt configuration tests passed"
                    : "Some Revolt configuration tests failed"
            });

        } catch (error) {
            console.error('Error in Revolt configuration test:', error);
            res.status(500).json({
                success: false,
                error: "Failed to test Revolt configuration",
                message: error.message
            });
        }
    }

    async joinCommunity(req, res) {
        try {
            const email = req.session.email;

            if (!email) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                    message: 'Please log in to join the community'
                });
            }

            // Check if user is active
            const user = await require('../database').User.findOne({
                where: { email }
            });

            if (!user || user.status !== 'active' || !user.expires_at || user.expires_at <= new Date()) {
                return res.status(403).json({
                    success: false,
                    error: 'Active membership required',
                    message: 'You need an active membership to join the community'
                });
            }

            const inviteUrl = revoltService.getInviteUrl();

            if (!inviteUrl) {
                return res.status(500).json({
                    success: false,
                    error: 'Invite URL not configured'
                });
            }

            res.redirect(302, inviteUrl);

        } catch (error) {
            console.error('Error in Revolt join controller:', error);
            res.status(500).json({ success: false, error: 'Failed to join community' });
        }
    }
}

module.exports = new RevoltController();
