const {
    DataTypes,
    Model
} = require("sequelize");

module.exports = class AFK extends Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            status: {
                type: DataTypes.BOOLEAN
            }
        }, {
            tableName: "AFK",
            timestamps: true,
            sequelize,
        });
    }
};