const {
    DataTypes,
    Model
} = require('sequelize');

module.exports = class Reaction extends Model {
    static init(sequelize) {
        return super.init({
            botId: {
                type: DataTypes.STRING
            },
            guildId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            messageId: {
                type: DataTypes.STRING
            },
            role: {
                type: DataTypes.STRING
            },
            emoji: {
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Reaction',
            timestamps: true,
            sequelize
        });
    }
}