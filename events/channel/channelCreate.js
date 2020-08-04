const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const {
  MessageEmbed
} = require("discord.js");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
const Auto = require("../../Database/models/Auto");
module.exports = class ChannelCreate extends BaseEvent {
  constructor() {
    super("channelCreate");
  }
  async run(bot, channel) {
    let auto = await Auto.findOne({
      where: {
        guildId: channel.guild.id,
        botId: bot.user.id
      }
    })

    if (!auto) return;
    if (auto.dataValues.ChannelLogs !== true) return;

    let theme = await Theme.findOne({
      where: {
        guildId: channel.guild.id,
        botId: bot.user.id,
      },
    });
    let channelawait = await Channel.findOne({
      where: {
        guildId: channel.guild.id,
        botId: bot.user.id,
      },
    });

    let logEmbed = new MessageEmbed()
      .setFooter(`Channel ID: ${channel.id}`, bot.user.displayAvatarURL())
      .setDescription(
        `**New Channel has been created!**\n` + `<#${channel.id}>`
      )
      .setTimestamp()
      .setColor(theme.dataValues.embedTheme);
    if (channelawait && channelawait.dataValues.logChannel !== null) {
      const modChannel = channel.guild.channels.cache.find(
        (c) => c.name == channelawait.dataValues.logChannel
      );
      if (!modChannel);
      modChannel.send(logEmbed);
    }
  }
};