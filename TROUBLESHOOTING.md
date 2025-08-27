# Revolt Integration Troubleshooting Guide

## 🔍 Quick Diagnosis

### 1. Check Health Endpoint
```bash
curl http://localhost:3001/api/health
```

Look for the `revolt` section in the response to see if all required environment variables are set.

### 2. Test Revolt Configuration
```bash
curl http://localhost:3001/api/revolt/test
```

This will test:
- Bot token validity
- Channel access
- Message fetching capability

## 🚨 Common Issues

### Issue: 404 Channel Not Found
**Error**: `Channel not found (404). Please check your REVOLT_CHANNEL_ID`

**Solutions**:
1. **Verify Channel ID**: 
   - Open your Revolt channel in the web app
   - Copy the channel ID from the URL
   - Make sure it matches your `REVOLT_CHANNEL_ID`

2. **Check Bot Permissions**:
   - Ensure the bot is added to the server
   - Verify the bot has permission to view the channel
   - Check if the bot has the "View Channels" permission

3. **Channel Type**:
   - Make sure you're using a text channel ID, not a voice channel
   - Direct message channels have different permissions

### Issue: 401 Unauthorized
**Error**: `Bot token is invalid (401). Please check your REVOLT_BOT_TOKEN`

**Solutions**:
1. **Regenerate Bot Token**:
   - Go to your Revolt server settings
   - Navigate to the bot configuration
   - Generate a new bot token
   - Update your `.env` file

2. **Check Token Format**:
   - Bot tokens should start with a specific pattern
   - Make sure there are no extra spaces or characters
   - Verify the token is copied completely

### Issue: 403 Forbidden
**Error**: `Bot does not have permission to access this channel (403)`

**Solutions**:
1. **Server Permissions**:
   - Add the bot to the server with proper permissions
   - Ensure the bot has "View Channels" permission
   - Check server-level bot permissions

2. **Channel Permissions**:
   - Verify the bot can see the specific channel
   - Check channel-specific permissions
   - Make sure the bot role has access to the channel

## 🛠️ Setup Verification

### Step 1: Create Revolt Bot
1. Go to your Revolt server
2. Navigate to Server Settings → Bots
3. Click "Create Bot"
4. Give it a name (e.g., "NeverPayForAds Bot")
5. Copy the bot token

### Step 2: Configure Bot Permissions
1. In bot settings, ensure these permissions are enabled:
   - View Channels
   - Read Message History
   - Send Messages (optional, for future features)

### Step 3: Get Channel ID
1. Open the channel you want to monitor
2. Copy the channel ID from the URL
3. The URL format is: `https://app.revolt.chat/server/SERVER_ID/channel/CHANNEL_ID`

### Step 4: Create Invite Link
1. Go to Server Settings → Invites
2. Create a new invite link
3. Copy the invite URL

### Step 5: Update Environment Variables
```env
REVOLT_BOT_TOKEN=your_bot_token_here
REVOLT_CHANNEL_ID=your_channel_id_here
REVOLT_INVITE_URL=https://app.revolt.chat/invite/your_invite_code
```

## 🧪 Testing Commands

### Test Bot Token
```bash
curl -H "x-bot-token: YOUR_BOT_TOKEN" \
     https://api.revolt.chat/users/@me
```

### Test Channel Access
```bash
curl -H "x-bot-token: YOUR_BOT_TOKEN" \
     https://api.revolt.chat/channels/YOUR_CHANNEL_ID
```

### Test Message Fetching
```bash
curl -H "x-bot-token: YOUR_BOT_TOKEN" \
     https://api.revolt.chat/channels/YOUR_CHANNEL_ID/messages?limit=5
```

## 📋 Debug Checklist

- [ ] Bot token is valid and not expired
- [ ] Bot is added to the server
- [ ] Bot has proper permissions
- [ ] Channel ID is correct
- [ ] Channel is accessible to the bot
- [ ] Environment variables are set correctly
- [ ] Backend server is running
- [ ] No firewall/network issues

## 🔧 Advanced Debugging

### Enable Detailed Logging
The backend already includes detailed logging. Check the console output for:
- Channel ID being used
- Bot token (first 10 characters)
- API response details
- Error messages with suggestions

### Test Individual Components
Use the test endpoint to isolate issues:
```bash
curl http://localhost:3001/api/revolt/test
```

This will test each component separately and provide detailed feedback.

## 📞 Getting Help

If you're still having issues:

1. **Check the logs**: Look at the detailed error messages in the console
2. **Verify credentials**: Double-check all environment variables
3. **Test manually**: Use the curl commands above to test directly
4. **Check Revolt status**: Ensure Revolt services are running normally

## 🔄 Fallback Behavior

The system is designed to gracefully handle Revolt API failures:
- If Revolt is unavailable, mock messages will be displayed
- The frontend will show appropriate error states
- The app remains functional even without Revolt integration
