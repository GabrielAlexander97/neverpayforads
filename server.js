const app = require('./src/app');
const config = require('./src/config');

const PORT = config.server.port;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Shopify API endpoint: http://localhost:${PORT}/api/shopify/data`);
    console.log(`💬 Revolt messages: http://localhost:${PORT}/api/revolt/messages`);
    console.log(`🧪 Revolt test: http://localhost:${PORT}/api/revolt/test`);
    console.log(`🔗 Revolt join: http://localhost:${PORT}/api/revolt/join`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${config.server.nodeEnv}`);
});
