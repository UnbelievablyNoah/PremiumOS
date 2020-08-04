const {
    DataTypes,
    Model
} = require('sequelize');

module.exports = class Channel extends Model {
    static init(sequelize) {
        return super.init({
            botId: {
                type: DataTypes.STRING
            },
            guildId: {
                type: DataTypes.STRING
            },
            logChannel: {
                type: DataTypes.STRING
            },
            modChannel: {
                type: DataTypes.STRING
            },
            welcomeChannel: {
                type: DataTypes.STRING
            },
            ideaChannel: {
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Channel',
            timestamps: true,
            sequelize
        });
    }
}