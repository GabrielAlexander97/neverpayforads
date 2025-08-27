const shopifyService = require('../services/shopifyService');

class ShopifyController {
    async getShopData(req, res) {
        try {
            const data = await shopifyService.getShopData();
            
            res.json({
                success: true,
                data,
                message: "Shopify data retrieved successfully from real API"
            });
        } catch (error) {
            console.error('Error in Shopify controller:', error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch Shopify data",
                message: error.message
            });
        }
    }
}

module.exports = new ShopifyController();
