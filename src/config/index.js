require('dotenv').config();

const config = {
    server: {
        port: process.env.PORT || 3001,
        nodeEnv: process.env.NODE_ENV || 'development'
    },

    session: {
        secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    },

    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? 'https://neverpayforads.com'
            : ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true
    },

    shopify: {
        shopUrl: process.env.SHOPIFY_SHOP_URL || '',
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
        apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10',
        domain: process.env.SHOPIFY_DOMAIN,
        webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET,
        membershipSku: process.env.MEMBERSHIP_SKU,
        membershipTag: process.env.MEMBERSHIP_TAG
    },

    revolt: {
        botToken: process.env.REVOLT_BOT_TOKEN,
        channelId: process.env.REVOLT_CHANNEL_ID,
        inviteUrl: process.env.REVOLT_INVITE_URL
    },

    email: {
        resendApiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'noreply@neverpayforads.com'
    },

    app: {
        publicDashboardUrl: process.env.PUBLIC_DASHBOARD_URL || 'https://neverpayforads.com/Gabe/dashboard',
        adminPassword: process.env.ADMIN_PASSWORD
    }
};

module.exports = config;
