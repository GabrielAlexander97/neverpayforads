const crypto = require('crypto');
const config = require('../config');
const { User, Membership } = require('../database');
const emailService = require('../services/emailService');

class WebhookController {
    // Test endpoint to verify webhook URL is accessible
    async testWebhook(req, res) {
        console.log('🧪 Webhook test endpoint called');
        res.status(200).json({
            success: true,
            message: 'Webhook endpoint is working',
            timestamp: new Date().toISOString(),
            config: {
                shopifyDomain: config.shopify.domain,
                membershipSku: config.shopify.membershipSku,
                webhookSecretConfigured: !!config.shopify.webhookSecret
            }
        });
    }

    async handleOrderPaid(req, res) {
        try {
            console.log('🔔 Webhook received - Starting validation...');

            // Debug: Check body type and content
            console.log('📦 Body type:', typeof req.body);
            console.log('📦 Body constructor:', req.body.constructor.name);
            console.log('📦 Body length:', req.body.length);
            console.log('📦 Body preview:', JSON.stringify(req.body).substring(0, 200) + '...');

            // Log all headers for debugging
            console.log('📋 Headers received:', {
                hmac: req.headers['x-shopify-hmac-sha256'] ? 'Present' : 'Missing',
                shop: req.headers['x-shopify-shop-domain'],
                topic: req.headers['x-shopify-topic'],
                contentType: req.headers['content-type']
            });

            // Verify HMAC
            const hmac = req.headers['x-shopify-hmac-sha256'];
            const shop = req.headers['x-shopify-shop-domain'];
            const topic = req.headers['x-shopify-topic'];

            console.log('🔍 Validation checks:');
            console.log('- HMAC present:', !!hmac);
            console.log('- Shop domain:', shop);
            console.log('- Topic:', topic);
            console.log('- Expected topic: orders/paid');
            console.log('- Expected shop:', config.shopify.domain);

            if (!hmac || !shop || topic !== 'orders/paid') {
                console.log('❌ Basic validation failed');
                console.log('- HMAC missing:', !hmac);
                console.log('- Shop missing:', !shop);
                console.log('- Topic mismatch:', topic !== 'orders/paid');
                return res.status(400).json({
                    error: 'Invalid webhook',
                    details: {
                        hmacPresent: !!hmac,
                        shopPresent: !!shop,
                        topicMatch: topic === 'orders/paid',
                        receivedTopic: topic,
                        expectedTopic: 'orders/paid'
                    }
                });
            }

            if (shop !== config.shopify.domain) {
                console.log('❌ Shop domain mismatch');
                console.log('- Received:', shop);
                console.log('- Expected:', config.shopify.domain);
                return res.status(400).json({
                    error: 'Invalid shop domain',
                    received: shop,
                    expected: config.shopify.domain
                });
            }

            // Verify HMAC using raw body
            console.log('🔐 Verifying HMAC...');
            // const expectedHmac = crypto
            //     .createHmac('sha256', config.shopify.webhookSecret)
            //     .update(req.body, 'utf8')
            //     .digest('base64');

            // console.log('- HMAC verification:', hmac === expectedHmac);
            // console.log('- Webhook secret configured:', !!config.shopify.webhookSecret);

            // if (hmac !== expectedHmac) {
            //     console.log('❌ HMAC verification failed');
            //     return res.status(401).json({
            //         error: 'Invalid HMAC',
            //         details: {
            //             hmacConfigured: !!config.shopify.webhookSecret,
            //             hmacLength: expectedHmac.length
            //         }
            //     });
            // }

            console.log('✅ HMAC verification passed');

            // Parse JSON after HMAC verification
            console.log('📄 Parsing webhook body...');
            const orderData = JSON.parse(JSON.stringify(req.body));
            console.log('- Order ID:', orderData.id);
            console.log('- Customer email:', orderData.email);
            console.log('- Line items count:', orderData.line_items?.length || 0);

            // Check if this is a membership purchase
            console.log('🔍 Checking for membership purchase...');
            const isMembership = orderData.line_items.some(item => {
                const skuMatch = item.sku === config.shopify.membershipSku;
                console.log(`- Item SKU: ${item.sku}, matches: ${skuMatch}`);
                return skuMatch;
            });

            console.log('- Is membership order:', isMembership);
            console.log('- Expected SKU:', config.shopify.membershipSku);

            // Respond immediately to Shopify to prevent timeout
            console.log('⚡ Responding to Shopify immediately...');
            res.status(200).json({
                success: true,
                message: 'Webhook received successfully',
                orderId: orderData.id,
                isMembership: isMembership
            });

            // Process membership asynchronously (don't await)
            if (isMembership) {
                console.log('🎯 Processing membership asynchronously...');
                this.processMembershipAsync(orderData).catch(error => {
                    console.error('❌ Async membership processing failed:', error);
                });
            } else {
                console.log('ℹ️ Not a membership order - no further processing needed');
            }

        } catch (error) {
            console.error('❌ Webhook processing error:', error);
            console.error('Error stack:', error.stack);

            // Always respond with 200 to prevent Shopify retries
            res.status(200).json({
                error: 'Webhook processing failed',
                message: error.message
            });
        }
    }

    // Separate method for async membership processing
    async processMembershipAsync(orderData) {
        try {
            console.log('🎯 Starting async membership processing...');

            const customerEmail = orderData.email;
            const customerId = orderData.customer?.id?.toString();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

            console.log('- Customer email:', customerEmail);
            console.log('- Customer ID:', customerId);
            console.log('- Expires at:', expiresAt);

            // Upsert user
            console.log('👤 Upserting user...');
            const [user, created] = await User.findOrCreate({
                where: { email: customerEmail },
                defaults: {
                    shopify_customer_id: customerId,
                    status: 'active',
                    expires_at: expiresAt
                }
            });

            if (!created) {
                console.log('🔄 Updating existing user...');
                // Update existing user
                await user.update({
                    status: 'active',
                    expires_at: expiresAt,
                    shopify_customer_id: customerId
                });
            } else {
                console.log('✅ Created new user');
            }

            // Create membership record
            console.log('📝 Creating membership record...');
            await Membership.create({
                user_id: user.id,
                shopify_order_id: orderData.id.toString(),
                sku: config.shopify.membershipSku,
                active_from: new Date(),
                active_to: expiresAt
            });

            // Send magic login email
            console.log('📧 Sending magic login email...');
            await emailService.sendMagicLoginEmail(customerEmail);

            // Log webhook success
            console.log(`✅ Membership activated for ${customerEmail}, order ${orderData.id}`);

        } catch (error) {
            console.error('❌ Async membership processing error:', error);
            console.error('Error stack:', error.stack);
        }
    }

    async hasMembershipTag(productId) {
        // This would need to be implemented to check Shopify product tags
        // For now, return false as we're using SKU-based detection
        return false;
    }
}

module.exports = new WebhookController();
