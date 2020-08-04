const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const {
  MessageEmbed
} = require("discord.js");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
const Auto = require("../../Database/models/Auto");
module.exports = class RoleDelete extends BaseEvent {
  constructor() {
    super("roleDelete");
  }
  async run(bot, role) {
    let auto = await Auto.findOne({
      where: {
        guildId: role.guild.id,
        botId: bot.user.id
      }
    })

    if (!auto) return;
    if (auto.dataValues.RoleLogs !== true) return;
    let theme = await Theme.findOne({
      where: {
        guildId: role.guild.id,
        botId: bot.user.id,
      },
    });
    let channel = await Channel.findOne({
      where: {
        guildId: role.guild.id,
        botId: bot.user.id,
      },
    });

    let logEmbed = new MessageEmbed()
      .setFooter(`Role ID: ${channel.id}`, bot.user.displayAvatarURL())
      .setDescription(`**Role has been deleted!**\n` + `@${role.name}`)
      .setTimestamp()
      .setColor(theme.dataValues.embedTheme);
    if (channel && channel.dataValues.logChannel !== null) {
      const modChannel = role.guild.channels.cache.find(
        (c) => c.name == channel.dataValues.logChannel
      );
      if (!modChannel) return;
      modChannel.send(logEmbed);
    }
  }
};