const {
    DataTypes,
    Model
} = require('sequelize');

module.exports = class Theme extends Model {
    static init(sequelize) {
        return super.init({
            botId: {
                type: DataTypes.STRING
            },
            guildId: {
                type: DataTypes.STRING
            },
            embedTheme: {
                type: DataTypes.STRING
            },
            welcome: {
                type: DataTypes.STRING
            },
            skyron: {
                type: DataTypes.STRING
            }

        }, {
            tableName: 'Theme',
            timestamps: true,
            sequelize
        });
    }
}