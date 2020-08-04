const {
  DataTypes,
  Model
} = require("sequelize");

module.exports = class Auto extends Model {
  static init(sequelize) {
    return super.init({
      botId: {
        type: DataTypes.STRING
      },
      guildId: {
        type: DataTypes.STRING
      },
      words: {
        type: DataTypes.JSON,
      },
      InviteStatus: {
        type: DataTypes.BOOLEAN
      },
      WordStatus: {
        type: DataTypes.BOOLEAN
      },
      MentionStatus: {
        type: DataTypes.BOOLEAN
      },
      MemberLogs: {
        type: DataTypes.BOOLEAN
      },
      MessageLogs: {
        type: DataTypes.BOOLEAN
      },
      ChannelLogs: {
        type: DataTypes.BOOLEAN
      },
      RoleLogs: {
        type: DataTypes.BOOLEAN
      }
    }, {
      tableName: "Auto",
      timestamps: true,
      sequelize,
    });
  }
};