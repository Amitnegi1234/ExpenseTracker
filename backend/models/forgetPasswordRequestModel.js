const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'ForgotPasswordRequests'
});

module.exports = ForgotPasswordRequest;