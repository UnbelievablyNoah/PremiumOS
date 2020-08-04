const {
  MessageEmbed
} = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const ms = require("ms");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
module.exports = class MuteCommmand extends BaseCommand {
  constructor() {
    super(
      "mute",
      "Moderation",
      ["stfu"],
      "Mutes a user for certain amount of time.",
      "[command | alias] <@Member> <time>",
      []
    );
  }

  async run(bot, message, args) {
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

    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.channel.send(
        "You don't have permissions to use this command."
      );
    const member = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    if (!member) return message.channel.send("Specify a Member to mute.");
    if (member.id == message.author.id) {
      return message.channel.send("You can't mute yourself..");
    }
    if (!member.kickable) {
      return message.channel.send("I can't mute this member.");
    }

    let role = message.guild.roles.cache.find((r) => r.name === "Muted");
    let time = args[1];

    if (!time) return message.channel.send("Specify a Time.");
    if (!role) return message.channel.send("Muted Role isn't found.");

    if (member.roles.cache.has(role.id)) {
      message.channel.send("This member is already Muted.");
    } else {
      member.roles.add(role.id).then(() => {
        let muteEmbed = new MessageEmbed()
          .setAuthor(
            `${member.user.tag} has been muted for ${ms(ms(time))}!`,
            member.user.avatarURL()
          )
          .setColor(theme.dataValues.embedTheme);
        let logEmbed = new MessageEmbed()
          .setAuthor("Mute Logs", member.user.displayAvatarURL())
          .addField("Muted Member", `${member} with ID: ${member.id}`, true)
          .addField(
            "Muted By",
            `${message.member} with ID: ${message.member.id}`,
            true
          )
          .addField("Muted In", message.channel, true)
          .addField("Time", ms(ms(time)), true)
          .setColor(theme.dataValues.embedTheme);
        if (channel && channel.dataValues.modChannel !== null) {
          const modChannel = message.guild.channels.cache.find(
            (c) => c.name == channel.dataValues.modChannel
          );
          if (!modChannel) return message.channel.send("No Logs Channel.");
          modChannel.send(logEmbed);
        }
        message.channel.send(muteEmbed);
        member.send(
          `You've been muted in ${message.guild.name} for ${ms(ms(time))}!`
        ).catch(() => message.channel.send(`${member}, you've been muted for ${ms(ms(time))}`))
        setTimeout(function () {
          member.roles.remove(role.id);
          message.channel.send(`<@${member.user.id}> has been unmuted!`);
          member.send(`You've been unmuted in ${message.guild.name}!`).catch(() => message.channel.send(`${member}, you've been unmuted!`));
        }, ms(time));
      });
    }
  }
};