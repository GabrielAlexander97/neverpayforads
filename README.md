# NeverPayForAds Backend Server

Node.js backend server with structured architecture for Shopify API integration and Revolt chat functionality.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic and external API calls
│   ├── utils/           # Utility functions
│   └── app.js          # Express app setup
├── server.js           # Server entry point
├── package.json
├── deploy-railway.sh   # Railway deployment script
├── RAILWAY_DEPLOYMENT.md # Detailed Railway deployment guide
└── README.md
```

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the backend folder:
   ```env
   PORT=3001
   NODE_ENV=development
   
   # Shopify API Credentials
   SHOPIFY_SHOP_URL=https://your-shop.myshopify.com
   SHOPIFY_ACCESS_TOKEN=your_access_token_here
   SHOPIFY_API_VERSION=2024-10
   
   # Revolt API Credentials
   REVOLT_BOT_TOKEN=your_revolt_bot_token_here
   REVOLT_CHANNEL_ID=your_revolt_channel_id_here
   REVOLT_INVITE_URL=https://app.revolt.chat/invite/your_invite_code
   ```

3. **Start the server:**
   ```bash
   # Development (with auto-restart)
   npm run dev
   
   # Production
   npm start
   ```

### Railway Deployment

#### Option 1: Automated Script (Recommended)
```bash
cd backend
./deploy-railway.sh
```

#### Option 2: Manual Deployment
See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed step-by-step instructions.

## 📡 API Endpoints

### Shopify
- `GET /api/shopify/data` - Fetch real Shopify data (products, customers, orders)

### Revolt
- `GET /api/revolt/messages` - Fetch recent messages from Revolt channel
- `GET /api/revolt/join` - Join Revolt community (requires subscription)
- `GET /api/revolt/test` - Test Revolt configuration

### System
- `GET /api/health` - Health check with service status

## 🔧 Configuration

### Environment Variables
All configuration is centralized in `src/config/index.js`:

- **Server**: Port, environment
- **Shopify**: Shop URL, access token, API version
- **Revolt**: Bot token, channel ID, invite URL

### Error Handling
Global error handling middleware in `src/middleware/errorHandler.js`:
- Consistent error response format
- Proper HTTP status codes
- Error logging

## 🏗️ Code Structure

### Controllers (`src/controllers/`)
- **shopifyController.js**: Handles Shopify API requests
- **revoltController.js**: Handles Revolt API requests
- **healthController.js**: System health checks

### Services (`src/services/`)
- **shopifyService.js**: Shopify API integration logic
- **revoltService.js**: Revolt API integration logic

### Routes (`src/routes/`)
- **shopifyRoutes.js**: Shopify endpoint definitions
- **revoltRoutes.js**: Revolt endpoint definitions
- **healthRoutes.js**: Health check endpoints

### Utils (`src/utils/`)
- **userUtils.js**: User authentication and subscription checks

## 🔐 Revolt Setup

### Getting Revolt Bot Token
1. Create a bot in your Revolt server
2. Get the bot token from the bot settings
3. Add it to your `.env` file as `REVOLT_BOT_TOKEN`

### Getting Channel ID
1. Open your Revolt channel in the web app
2. Copy the channel ID from the URL
3. Add it to your `.env` file as `REVOLT_CHANNEL_ID`

### Getting Invite URL
1. Create an invite link in your Revolt server
2. Copy the invite URL
3. Add it to your `.env` file as `REVOLT_INVITE_URL`

## 🚀 Deployment Options

### Railway (Recommended)
- **Free tier**: $5 credit/month, 500 hours runtime
- **Easy setup**: Automatic Node.js detection
- **Environment variables**: Secure storage
- **Auto-deploy**: GitHub integration

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for complete instructions.

### Render
- Connect your GitHub repo
- Set environment variables
- Deploy automatically

### Heroku
```bash
heroku create your-app-name
heroku config:set SHOPIFY_SHOP_URL=your_url
heroku config:set SHOPIFY_ACCESS_TOKEN=your_token
heroku config:set REVOLT_BOT_TOKEN=your_bot_token
heroku config:set REVOLT_CHANNEL_ID=your_channel_id
heroku config:set REVOLT_INVITE_URL=your_invite_url
git push heroku main
```

## 🔗 Frontend Integration

Update your frontend to call the backend APIs:

```javascript
// Fetch Shopify data
const shopifyResponse = await fetch('https://your-backend-url.com/api/shopify/data');
const shopifyData = await shopifyResponse.json();

// Fetch Revolt messages
const messagesResponse = await fetch('https://your-backend-url.com/api/revolt/messages');
const messages = await messagesResponse.json();

// Join Revolt community
window.location.href = 'https://your-backend-url.com/api/revolt/join';
```

## 🧪 Testing

Test the endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Shopify data
curl http://localhost:3001/api/shopify/data

# Revolt messages (requires valid bot token)
curl http://localhost:3001/api/revolt/messages

# Revolt configuration test
curl http://localhost:3001/api/revolt/test

# Revolt join (redirects to invite URL)
curl -L http://localhost:3001/api/revolt/join
```

## 🔄 Development

### Adding New Features
1. Create service in `src/services/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Update `src/app.js` with new routes

### Error Handling
All errors are caught and formatted consistently through the error handling middleware.

### Logging
Console logging is used for debugging. Consider adding a proper logging library for production.

## 🛠️ Troubleshooting

### Revolt Issues
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed Revolt integration troubleshooting.

### Common Issues
- **Port conflicts**: Use `process.env.PORT` in production
- **Environment variables**: Check variable names and values
- **CORS issues**: Configure CORS for your frontend domain
- **Dependencies**: Ensure all dependencies are in `package.json`

## 📞 Support

### Railway Support
- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [discord.gg/railway](https://discord.gg/railway)

### Getting Help
1. Check the troubleshooting guides
2. Look at deployment logs
3. Test endpoints manually
4. Contact platform support if needed
