const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const {
  MessageEmbed
} = require("discord.js");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
const Auto = require("../../Database/models/Auto");
module.exports = class MessageDelete extends BaseEvent {
  constructor() {
    super("messageDelete");
  }
  async run(bot, message) {
    if (message.channel.type == 'dm') return;
    if (message.author.bot) return;
    let auto = await Auto.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id
      }
    })

    if (!auto) return;
    if (auto.dataValues.MessageLogs !== true) return;
    let theme = await Theme.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id,
      },
    });
    let channel = await Channel.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id,
      },
    });
    let logEmbed = new MessageEmbed()
      .setDescription(
        `**Message by ${message.author.tag} deleted in <#${message.channel.id}>**\n` +
        `${message.content}`
      )
      .setFooter(
        `Message ID: ${message.id} - Author ID: ${message.author.id}`,
        message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(theme.dataValues.embedTheme);
    if (channel && channel.dataValues.logChannel !== null) {
      const modChannel = message.guild.channels.cache.find(
        (c) => c.name == channel.dataValues.logChannel
      );
      if (!modChannel) return;
      modChannel.send(logEmbed);
    }
  }
};