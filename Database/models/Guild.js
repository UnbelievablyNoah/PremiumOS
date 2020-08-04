const {
    DataTypes,
    Model
} = require('sequelize');

module.exports = class Guild extends Model {
    static init(sequelize) {
        return super.init({
            botId: {
                type: DataTypes.STRING
            },
            guildId: {
                type: DataTypes.STRING
            },
            botPrefix: {
                type: DataTypes.STRING,
                defaultValue: '!',
                allowNull: false
            },
            welcomeMessage: {
                type: DataTypes.TEXT
            },
            ideaTicket: {
                type: DataTypes.STRING
            },
            ideaCross: {
                type: DataTypes.STRING
            }

        }, {
            tableName: 'Guild',
            timestamps: true,
            sequelize
        });
    }
}