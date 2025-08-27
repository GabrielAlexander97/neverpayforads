const fetch = require('node-fetch');
const config = require('../config');

class ShopifyService {
    constructor() {
        this.shopUrl = config.shopify.shopUrl;
        this.accessToken = config.shopify.accessToken;
        this.apiVersion = config.shopify.apiVersion;
    }

    async makeApiCall(endpoint) {
        const url = `${this.shopUrl}/admin/api/${this.apiVersion}/${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'X-Shopify-Access-Token': this.accessToken,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Shopify API call failed:', error);
            throw error;
        }
    }

    async getProducts() {
        const response = await this.makeApiCall('products.json');
        return response.products || [];
    }

    async getCustomers(limit = 1) {
        const response = await this.makeApiCall(`customers.json?limit=${limit}`);
        return response.customers || [];
    }

    async getOrders(limit = 1) {
        const response = await this.makeApiCall(`orders.json?status=any&limit=${limit}`);
        return response.orders || [];
    }

    async getShopData() {
        try {
            console.log('Fetching real Shopify data...');

            const [products, customers, orders] = await Promise.all([
                this.getProducts(),
                this.getCustomers(1),
                this.getOrders(1)
            ]);

            const customer = customers[0] || null;
            const hasOrders = orders.length > 0;

            const subscriptionStatus = {
                customer_id: customer?.id || 0,
                email: customer?.email || 'unknown@example.com',
                has_active_subscription: hasOrders,
                subscription_plan: hasOrders ? 'Active Customer' : 'No Subscription',
                next_billing_date: hasOrders ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
                status: hasOrders ? 'active' : 'inactive'
            };

            return {
                products: products.map(product => ({
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    status: product.status,
                    created_at: product.created_at,
                    updated_at: product.updated_at
                })),
                subscription_status: subscriptionStatus,
                customer: customer ? {
                    id: customer.id,
                    email: customer.email,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    created_at: customer.created_at,
                    updated_at: customer.updated_at
                } : null,
                shop_info: {
                    shop_url: this.shopUrl,
                    api_version: this.apiVersion,
                    total_products: products.length
                }
            };
        } catch (error) {
            console.error('Error fetching Shopify data:', error);
            throw error;
        }
    }
}

module.exports = new ShopifyService();
