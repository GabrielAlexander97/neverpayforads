const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const LoginToken = sequelize.define('LoginToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        token_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'login_tokens',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    LoginToken.associate = (models) => {
        LoginToken.belongsTo(models.User, {
            foreignKey: 'email',
            targetKey: 'email',
            as: 'user'
        });
    };

    return LoginToken;
};
