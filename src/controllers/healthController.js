const config = require('../config');

class HealthController {
    getHealth(req, res) {
        const revoltConfig = {
            botToken: !!config.revolt.botToken,
            channelId: !!config.revolt.channelId,
            inviteUrl: !!config.revolt.inviteUrl,
            fullyConfigured: !!(config.revolt.botToken && config.revolt.channelId && config.revolt.inviteUrl)
        };

        res.json({
            status: 'OK',
            message: 'Backend server is running',
            timestamp: new Date().toISOString(),
            services: {
                shopify: !!config.shopify.accessToken,
                revolt: revoltConfig
            },
            config: {
                revolt: {
                    botTokenConfigured: revoltConfig.botToken,
                    channelIdConfigured: revoltConfig.channelId,
                    inviteUrlConfigured: revoltConfig.inviteUrl,
                    fullyConfigured: revoltConfig.fullyConfigured
                }
            }
        });
    }
}

module.exports = new HealthController();
