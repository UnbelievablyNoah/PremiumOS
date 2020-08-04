const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const {
  MessageEmbed
} = require("discord.js");
const Channel = require("../../Database/models/Channel");
const Theme = require("../../Database/models/Theme");
const Auto = require("../../Database/models/Auto");
module.exports = class MessageUpdateEvent extends BaseEvent {
  constructor() {
    super("messageUpdate");
  }
  async run(bot, oldMessage, newMessage) {
    if (oldMessage.channel.type == 'dm') return;
    let auto = await Auto.findOne({
      where: {
        guildId: oldMessage.guild.id,
        botId: bot.user.id
      }
    })

    if (!auto) return;
    if (auto.dataValues.MemberLogs !== true) return;
    let theme = await Theme.findOne({
      where: {
        guildId: oldMessage.guild.id,
        botId: bot.user.id,
      },
    });
    let channel = await Channel.findOne({
      where: {
        guildId: oldMessage.guild.id,
        botId: bot.user.id,
      },
    });

    if (oldMessage.content !== newMessage.content) {
      let logEmbed = new MessageEmbed()
        .setDescription(`**Message was Edited by ${oldMessage.author.tag}**`)
        .addField("Old Message", oldMessage.content, true)
        .addField("New Message", newMessage.content, true)
        .addField("Channel", oldMessage.channel, true)
        .setFooter(
          `Message ID: ${oldMessage.id} - Author ID: ${oldMessage.author.id}`,
          oldMessage.author.displayAvatarURL()
        )
        .setColor(theme.dataValues.embedTheme)
        .setTimestamp();
      if (channel && channel.dataValues.logChannel !== null) {
        const modChannel = oldMessage.guild.channels.cache.find(
          (c) => c.name == channel.dataValues.logChannel
        );
        if (!modChannel) return;
        modChannel.send(logEmbed);
      }
    }
  }
};