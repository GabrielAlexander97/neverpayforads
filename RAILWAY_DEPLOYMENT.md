# Railway Backend Deployment Guide

## 🚀 Quick Deploy to Railway

### Prerequisites
- GitHub account with your code repository
- Railway account (free tier available)
- Your backend code ready to deploy

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Ensure your backend is in a Git repository:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

2. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Railway

#### Option A: Deploy via Railway Dashboard (Recommended)

1. **Go to Railway Dashboard:**
   - Visit [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder (if your repo contains both frontend and backend)

3. **Configure Environment Variables:**
   - Go to your project dashboard
   - Click on "Variables" tab
   - Add the following environment variables:

   ```env
   PORT=3001
   NODE_ENV=production
   
   # Shopify API Credentials
   SHOPIFY_SHOP_URL=https://your-shop.myshopify.com
   SHOPIFY_ACCESS_TOKEN=your_access_token_here
   SHOPIFY_API_VERSION=2024-10
   
   # Revolt API Credentials
   REVOLT_BOT_TOKEN=your_revolt_bot_token_here
   REVOLT_CHANNEL_ID=your_revolt_channel_id_here
   REVOLT_INVITE_URL=https://app.revolt.chat/invite/your_invite_code
   ```

4. **Deploy:**
   - Railway will automatically detect it's a Node.js app
   - It will run `npm install` and `npm start`
   - Your app will be deployed and get a URL like: `https://your-app-name.railway.app`

#### Option B: Deploy via Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Railway project:**
   ```bash
   cd backend
   railway init
   ```

4. **Set environment variables:**
   ```bash
   railway variables --set "PORT=3001" \
                    --set "NODE_ENV=production" \
                    --set "SHOPIFY_SHOP_URL=https://your-shop.myshopify.com" \
                    --set "SHOPIFY_ACCESS_TOKEN=your_access_token_here" \
                    --set "SHOPIFY_API_VERSION=2024-10" \
                    --set "REVOLT_BOT_TOKEN=your_revolt_bot_token_here" \
                    --set "REVOLT_CHANNEL_ID=your_revolt_channel_id_here" \
                    --set "REVOLT_INVITE_URL=https://app.revolt.chat/invite/your_invite_code"
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

### Step 3: Verify Deployment

1. **Check your Railway dashboard** for the deployment status
2. **Test your endpoints:**
   ```bash
   # Health check
   curl https://your-app-name.railway.app/api/health
   
   # Shopify data
   curl https://your-app-name.railway.app/api/shopify/data
   
   # Revolt test
   curl https://your-app-name.railway.app/api/revolt/test
   ```

3. **Check logs** in Railway dashboard for any errors

### Step 4: Update Frontend Configuration

1. **Update your frontend environment:**
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-app-name.railway.app
   ```

2. **Rebuild and redeploy frontend:**
   ```bash
   npm run deploy:export
   ```

## 🔧 Railway Configuration

### Automatic Detection
Railway automatically detects:
- **Node.js** application
- **package.json** with start script
- **Port** from environment variable

### Build Process
Railway will:
1. Install dependencies: `npm install`
2. Build the application (if needed)
3. Start the server: `npm start`

### Environment Variables
Railway provides:
- **Secure storage** of environment variables
- **Easy management** via dashboard
- **Automatic injection** into your app

## 📊 Monitoring & Logs

### View Logs
- Go to your Railway project dashboard
- Click on your service
- View real-time logs

### Monitor Performance
- Railway provides basic metrics
- Monitor response times
- Check for errors

### Automatic Restarts
- Railway automatically restarts your app if it crashes
- Health checks ensure availability

## 🔄 Continuous Deployment

### Automatic Deploys
- Railway automatically deploys when you push to GitHub
- No manual intervention needed
- Rollback to previous versions easily

### Custom Domains
- Add custom domain in Railway dashboard
- SSL certificates automatically provided
- Update DNS settings as instructed

## 💰 Pricing & Limits

### Free Tier
- **$5 credit** per month
- **500 hours** of runtime
- **512MB RAM** per service
- **1GB storage**

### Paid Plans
- **$20/month** for more resources
- **Unlimited** deployments
- **Higher** resource limits

## 🛠️ Troubleshooting

### Common Issues

#### Issue: App Not Starting
- **Check logs** in Railway dashboard
- **Verify start script** in package.json
- **Check environment variables**

#### Issue: Environment Variables Not Working
- **Verify variable names** match your code
- **Check for typos** in values
- **Restart deployment** after adding variables

#### Issue: Port Conflicts
- **Railway sets PORT** automatically
- **Use process.env.PORT** in your code
- **Don't hardcode port numbers**

#### Issue: Dependencies Missing
- **Check package.json** includes all dependencies
- **Verify node_modules** is not in .gitignore
- **Check build logs** for npm install errors

### Debug Commands
```bash
# Check Railway status
railway status

# View logs
railway logs

# Connect to your app
railway connect

# Restart deployment
railway up
```

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit sensitive data
   - Use Railway's secure variable storage
   - Rotate tokens regularly

2. **CORS Configuration:**
   - Configure CORS for your frontend domain
   - Don't use `*` in production

3. **Rate Limiting:**
   - Consider adding rate limiting
   - Monitor API usage

## 📞 Support

### Railway Support
- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Email**: support@railway.app

### Getting Help
1. Check Railway documentation
2. Look at deployment logs
3. Test endpoints manually
4. Contact Railway support if needed

## 🎉 Success!

Once deployed, your backend will be available at:
```
https://your-app-name.railway.app
```

Your API endpoints will be:
- Health: `https://your-app-name.railway.app/api/health`
- Shopify: `https://your-app-name.railway.app/api/shopify/data`
- Revolt: `https://your-app-name.railway.app/api/revolt/messages`
- Revolt Test: `https://your-app-name.railway.app/api/revolt/test`
