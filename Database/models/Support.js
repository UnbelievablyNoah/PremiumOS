const {
    DataTypes,
    Model
} = require('sequelize');

module.exports = class Support extends Model {
    static init(sequelize) {
        return super.init({
            botId: {
                type: DataTypes.STRING
            },
            guildId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            category: {
                type: DataTypes.STRING
            },
            messageId: {
                type: DataTypes.STRING
            },
            message: {
                type: DataTypes.TEXT
            },
            roles: {
                type: DataTypes.JSON
            },
            supportType: {
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Support',
            timestamps: true,
            sequelize
        });
    }
}