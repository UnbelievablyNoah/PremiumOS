const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const {
  MessageEmbed
} = require("discord.js");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
module.exports = class InviteCreate extends BaseEvent {
  constructor() {
    super("inviteCreate");
  }
  async run(bot, invite) {
    let theme = await Theme.findOne({
      where: {
        guildId: invite.channel.guild.id,
        botId: bot.user.id,
      },
    });
    let channel = await Channel.findOne({
      where: {
        guildId: invite.channel.guild.id,
        botId: bot.user.id,
      },
    });

    let logEmbed = new MessageEmbed()
      .setFooter(
        `Inviter ID: ${invite.inviter.id}`,
        `https://cdn.discordapp.com/avatars/${invite.inviter.id}/${invite.inviter.avatar}.png`
      )
      .setDescription(
        `**New invite has been created by ${invite.inviter.username}#${invite.inviter.discriminator} in <#${invite.channel.id}>**\n` +
        `https://discord.gg/${invite.code}`
      )
      .setTimestamp()
      .setColor(theme.dataValues.embedTheme);
    if (channel && channel.dataValues.logChannel !== null) {
      const modChannel = invite.channel.guild.channels.cache.find(
        (c) => c.name == channel.dataValues.logChannel
      );
      if (!modChannel) return;
      modChannel.send(logEmbed);
    }
  }
};