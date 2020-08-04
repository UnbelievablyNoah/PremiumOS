const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const {
  MessageEmbed
} = require("discord.js");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
const Auto = require("../../Database/models/Auto");
module.exports = class GuildMemberRemove extends BaseEvent {
  constructor() {
    super("guildMemberRemove");
  }
  async run(bot, member) {
    let auto = await Auto.findOne({
      where: {
        guildId: member.guild.id,
        botId: bot.user.id
      }
    })

    if (!auto) return;
    if (auto.dataValues.MemberLogs !== true) return;

    let theme = await Theme.findOne({
      where: {
        guildId: member.guild.id,
        botId: bot.user.id,
      },
    });
    let channel = await Channel.findOne({
      where: {
        guildId: member.guild.id,
        botId: bot.user.id,
      },
    });

    let logEmbed = new MessageEmbed()
      .setDescription(`**${member.user.tag} left the server!**`)
      .setFooter(`ID: ${member.id}`, member.user.displayAvatarURL())
      .setColor(theme.dataValues.embedTheme);

    const logChannel = member.guild.channels.cache.find(
      (c) => c.name == channel.dataValues.logChannel
    );
    if (!member) return;
    if (!logChannel) return;
    logChannel.send(logEmbed);
  }
};