const {
    DataTypes,
    Model
} = require('sequelize');

module.exports = class Bot extends Model {
    static init(sequelize) {
        return super.init({
            botId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            botStatus: {
                type: DataTypes.STRING,
                defaultValue: 'Aquirty',
                allowNull: false
            },
            botActivity: {
                type: DataTypes.STRING,
                defaultValue: 'WATCHING',
                allowNull: false
            }
        }, {
            tableName: 'Bot',
            timestamps: true,
            sequelize
        });
    }
}