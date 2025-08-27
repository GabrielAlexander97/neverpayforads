const crypto = require('crypto');
const config = require('../config');
const { User, Membership } = require('../database');
const emailService = require('../services/emailService');

class WebhookController {
    async handleOrderPaid(req, res) {
        try {
            // Verify HMAC
            const hmac = req.headers['x-shopify-hmac-sha256'];
            const shop = req.headers['x-shopify-shop-domain'];
            const topic = req.headers['x-shopify-topic'];

            if (!hmac || !shop || topic !== 'orders/paid') {
                return res.status(400).json({ error: 'Invalid webhook' });
            }

            if (shop !== config.shopify.domain) {
                return res.status(400).json({ error: 'Invalid shop domain' });
            }

            // Verify HMAC
            const expectedHmac = crypto
                .createHmac('sha256', config.shopify.webhookSecret)
                .update(req.body, 'utf8')
                .digest('base64');

            if (hmac !== expectedHmac) {
                return res.status(401).json({ error: 'Invalid HMAC' });
            }

            // Parse JSON after HMAC verification
            const orderData = JSON.parse(req.body.toString());

            // Check if this is a membership purchase
            const isMembership = orderData.line_items.some(item =>
                item.sku === config.shopify.membershipSku ||
                (item.product_id && this.hasMembershipTag(item.product_id))
            );

            if (!isMembership) {
                return res.status(200).json({ message: 'Not a membership order' });
            }

            // Process membership
            const customerEmail = orderData.email;
            const customerId = orderData.customer?.id?.toString();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

            // Upsert user
            const [user, created] = await User.findOrCreate({
                where: { email: customerEmail },
                defaults: {
                    shopify_customer_id: customerId,
                    status: 'active',
                    expires_at: expiresAt
                }
            });

            if (!created) {
                // Update existing user
                await user.update({
                    status: 'active',
                    expires_at: expiresAt,
                    shopify_customer_id: customerId
                });
            }

            // Create membership record
            await Membership.create({
                user_id: user.id,
                shopify_order_id: orderData.id.toString(),
                sku: config.shopify.membershipSku,
                active_from: new Date(),
                active_to: expiresAt
            });

            // Send magic login email
            await emailService.sendMagicLoginEmail(customerEmail);

            // Log webhook
            console.log(`Membership activated for ${customerEmail}, order ${orderData.id}`);

            res.status(200).json({
                success: true,
                message: 'Membership processed successfully'
            });

        } catch (error) {
            console.error('Webhook processing error:', error);
            res.status(500).json({ error: 'Webhook processing failed' });
        }
    }

    async hasMembershipTag(productId) {
        // This would need to be implemented to check Shopify product tags
        // For now, return false as we're using SKU-based detection
        return false;
    }
}

module.exports = new WebhookController();
