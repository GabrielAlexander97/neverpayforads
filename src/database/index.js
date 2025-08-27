const { Sequelize } = require('sequelize');
const config = require('../config');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.MYSQL_URL, {
    dialect: 'mysql',
    logging: config.server.nodeEnv === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    }
});

// Import models
const User = require('../models/User')(sequelize);
const Membership = require('../models/Membership')(sequelize);
const LoginToken = require('../models/LoginToken')(sequelize);

// Define associations
User.associate({ User, Membership, LoginToken });
Membership.associate({ User, Membership, LoginToken });
LoginToken.associate({ User, Membership, LoginToken });

// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced successfully');
    } catch (error) {
        console.error('❌ Database sync failed:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    User,
    Membership,
    LoginToken,
    syncDatabase
};
