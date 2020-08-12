const {
    DataTypes,
    Model
} = require('sequelize');

module.exports = class Warning extends Model {
    static init(sequelize) {
        return super.init({
            status: {
                type: DataTypes.BOOLEAN
            },
            guildId: {
                type: DataTypes.STRING
            },
            userId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            warnNo: {
                type: DataTypes.STRING
            },
            warnReason: {
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Warning',
            timestamps: true,
            sequelize
        });
    }
}