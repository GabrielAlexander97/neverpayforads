// Stub function to check if user is subscribed
function isUserSubscribed(userId) {
    // This is a stub - replace with actual subscription logic
    // For now, return true for demo purposes
    return true;
}

// Stub function to get current user
function getCurrentUser() {
    // This is a stub - replace with actual user authentication logic
    // For now, return a demo user
    return {
        id: 'demo-user-123',
        email: 'demo@example.com',
        name: 'Demo User'
    };
}

module.exports = {
    isUserSubscribed,
    getCurrentUser
};
