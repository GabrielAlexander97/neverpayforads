const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require('./config');
const { syncDatabase, sequelize } = require('./database');

// Import routes
const shopifyRoutes = require('./routes/shopifyRoutes');
const revoltRoutes = require('./routes/revoltRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const adminRoutes = require('./routes/adminRoutes');
const meRoutes = require('./routes/meRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Initialize database
syncDatabase().catch(console.error);

// Create session store
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions'
});

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));

// Session middleware with database store
app.use(session({
    secret: config.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: config.session.cookie
}));

// Routes
app.use('/api/shopify', shopifyRoutes);
app.use('/api/revolt', revoltRoutes);
app.use('/api/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/admin', adminRoutes);
app.use('/api/me', meRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});

module.exports = app;
