const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const { MessageEmbed } = require("discord.js");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
module.exports = class GuildMemberAdd extends BaseEvent {
  constructor() {
    super("guildMemberAdd");
  }
  async run(bot, member) {
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
    const botdata = await Bot.findOne({
      where: {
        botId: bot.user.id,
        guildId: member.guild.id,
      },
    });

    let welcomeEmbed = new MessageEmbed()
      .setColor(theme.dataValues.embedTheme)
      .setAuthor(`Welcome ${member.user.tag}!`, member.user.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter(`Welcome to ${member.guild.name}!`);
    if (theme.dataValues.welcome !== null) {
      welcomeEmbed.setImage(theme.dataValues.welcome);
    }
    if (botdata.dataValues.welcomeMessage !== null) {
      welcomeEmbed.setDescription(botdata.dataValues.welcomeMessage);
    }
    const welcomeChannel = member.guild.channels.cache.find(
      (c) => c.name == channel.dataValues.welcomeChannel
    );
    if (!member) return;
    if (!welcomeChannel) return;
    welcomeChannel.send(welcomeEmbed);
  }
};
