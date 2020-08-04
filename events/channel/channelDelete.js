const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const {
  MessageEmbed
} = require("discord.js");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
const Auto = require("../../Database/models/Auto");
module.exports = class channelDelete extends BaseEvent {
  constructor() {
    super("channelDelete");
  }
  async run(bot, channel) {
    if (channel.type == 'dm') return;
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
      .setFooter(
        `Channel ID: ${channel.id} - Channel Logs`,
        bot.user.displayAvatarURL()
      )
      .setDescription(`**Channel has been Deleted!**\n` + `#${channel.name}`)
      .setTimestamp()
      .setColor(theme.dataValues.embedTheme);
    if (channelawait && channelawait.dataValues.logChannel !== null) {
      const modChannel = channel.guild.channels.cache.find(
        (c) => c.name == channelawait.dataValues.logChannel
      );
      if (!modChannel) return message.channel.send("No Logs Channel.");
      modChannel.send(logEmbed);
    }
  }
};