const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Membership = sequelize.define('Membership', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        shopify_order_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active_from: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        active_to: {
            type: DataTypes.DATE,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'memberships',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Membership.associate = (models) => {
        Membership.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Membership;
};
