const axios = require('axios');
const config = require('../config');

class RevoltService {
    constructor() {
        this.botToken = config.revolt.botToken;
        this.channelId = config.revolt.channelId;
        this.inviteUrl = config.revolt.inviteUrl;
    }

    validateConfig() {
        if (!this.botToken || !this.channelId) {
            throw new Error('REVOLT_BOT_TOKEN and REVOLT_CHANNEL_ID must be set in environment variables');
        }
    }

    async getMessages(limit = 10) {
        try {
            this.validateConfig();

            console.log('Fetching Revolt messages...');
            console.log('Channel ID:', this.channelId);
            console.log('Bot Token (first 10 chars):', this.botToken ? this.botToken.substring(0, 10) + '...' : 'NOT SET');

            const response = await axios.get(
                `https://api.revolt.chat/channels/${this.channelId}/messages?limit=${limit}`,
                {
                    headers: {
                        'x-bot-token': this.botToken,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Sanitize and format the response
            const messages = response.data.map(message => ({
                id: message._id,
                content: message.content || '',
                authorId: message.author,
                createdAt: message.created_at
            }));

            console.log(`Successfully fetched ${messages.length} messages from Revolt`);
            return messages;
        } catch (error) {
            console.error('Error fetching Revolt messages:', error);

            if (error.response) {
                // Revolt API returned an error
                const status = error.response.status;
                const data = error.response.data;

                console.error('Revolt API Error Details:', {
                    status,
                    data,
                    url: error.config?.url,
                    channelId: this.channelId
                });

                if (status === 404) {
                    throw new Error(`Channel not found (404). Please check your REVOLT_CHANNEL_ID: ${this.channelId}. Make sure the bot has access to this channel.`);
                } else if (status === 401) {
                    throw new Error('Bot token is invalid (401). Please check your REVOLT_BOT_TOKEN.');
                } else if (status === 403) {
                    throw new Error('Bot does not have permission to access this channel (403).');
                } else {
                    throw new Error(`Revolt API error: ${status} - ${data?.message || data?.type || error.message}`);
                }
            } else if (error.code === 'ENOTFOUND') {
                throw new Error('Could not connect to Revolt API. Please check your internet connection.');
            } else {
                // Network or other error
                throw new Error(`Failed to fetch Revolt messages: ${error.message}`);
            }
        }
    }

    getInviteUrl() {
        if (!this.inviteUrl) {
            throw new Error('REVOLT_INVITE_URL must be set in environment variables');
        }
        return this.inviteUrl;
    }

    // Helper method to test bot token validity
    async testBotToken() {
        try {
            this.validateConfig();

            console.log('Testing Revolt bot token...');

            // Try to fetch bot info to test token validity
            const response = await axios.get(
                'https://api.revolt.chat/users/@me',
                {
                    headers: {
                        'x-bot-token': this.botToken,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Bot token is valid. Bot info:', {
                id: response.data._id,
                username: response.data.username
            });

            return true;
        } catch (error) {
            console.error('Bot token test failed:', error);

            if (error.response?.status === 401) {
                throw new Error('Bot token is invalid. Please check your REVOLT_BOT_TOKEN.');
            } else {
                throw new Error(`Failed to test bot token: ${error.message}`);
            }
        }
    }

    // Helper method to test channel access
    async testChannelAccess() {
        try {
            this.validateConfig();

            console.log('Testing channel access...');

            // Try to fetch channel info to test access
            const response = await axios.get(
                `https://api.revolt.chat/channels/${this.channelId}`,
                {
                    headers: {
                        'x-bot-token': this.botToken,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Channel access confirmed. Channel info:', {
                id: response.data._id,
                name: response.data.name || 'Direct Message',
                type: response.data.channel_type
            });

            return true;
        } catch (error) {
            console.error('Channel access test failed:', error);

            if (error.response?.status === 404) {
                throw new Error(`Channel not found: ${this.channelId}. Please check your REVOLT_CHANNEL_ID.`);
            } else if (error.response?.status === 403) {
                throw new Error('Bot does not have permission to access this channel.');
            } else {
                throw new Error(`Failed to test channel access: ${error.message}`);
            }
        }
    }
}

module.exports = new RevoltService();
