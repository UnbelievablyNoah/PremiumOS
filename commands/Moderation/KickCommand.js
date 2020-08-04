const Discord = require("discord.js");
const fs = require("fs");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
const request = require("node-superfetch");
const data = [];
const BaseCommand = require("../../utils/structures/BaseCommand");
const {
  MessageEmbed
} = require("discord.js");
const {
  stripIndents
} = require("common-tags");

module.exports = class KickCommmand extends BaseCommand {
  constructor() {
    super(
      "kick",
      "Moderation",
      ["cmds"],
      "Kicks a specified member with a reason",
      "[command | alias] <@Member> <reason>",
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
    const member = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );
    const reason = args.slice(1).join(" ");
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.channel.send(
        "You don't have permissions to use this command."
      );
    }

    if (!member) {
      return message.channel.send(
        "You didn't specified the user who you want to kick."
      );
    }

    if (!reason) {
      return message.channel.send("You didn't specified the reason.");
    }

    if (member.id == message.author.id) {
      return message.channel.send("You can't kick yourself..");
    }

    if (!member.kickable) {
      return message.channel.send("I can't kick this member.");
    }

    if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
      return message.channel.send("I don't have permission, ``KICK_MEMBERS``.");
    }
    let awaitEmbed = new MessageEmbed()
      .setAuthor(
        `Are you sure, you want to kick ${member.user.tag}?`, member.user.avatarURL(),
        member.user.avatarURL()
      )
      .setTimestamp()
      .setColor(theme.dataValues.embedTheme);
    message.channel.send(awaitEmbed).then((msg) => {
      (async () => {
        msg.delete({
          timeout: 60000,
          reason: "It had to be done.",
        });
        await msg.react("✅");
        const filter = (reaction, user) => {
          return (
            ["✅"].includes(reaction.emoji.name) &&
            user.id === message.author.id
          );
        };

        msg
          .awaitReactions(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then((collected) => {
            const reaction = collected.first();

            if (reaction.emoji.name === "✅") {
              member
                .send(
                  `You've been kicked from ${message.guild.name} due to ${reason}!`
                )
                .then(() => {
                  const logEmbed = new MessageEmbed()
                    .setColor(theme.dataValues.embedTheme)
                    .setFooter(`Kicked Member`, member.user.displayAvatarURL)
                    .addField(
                      "Kicked Member",
                      `${member} with ID: ${member.id}`,
                      true
                    )
                    .addField(
                      "Kicked By",
                      `${message.member} with ID: ${message.member.id}`,
                      true
                    )
                    .addField("Kicked In", message.channel, true)
                    .addField("Reason", args.slice(1).join(" "), true)
                    .setTimestamp()
                    .setAuthor("Kicked Logs")
                    .setFooter(message.guild.name, message.guild.iconURL());
                  if (channel && channel.dataValues.modChannel !== null) {
                    const modChannel = message.guild.channels.cache.find(
                      (c) => c.name == channel.dataValues.modChannel
                    );
                    if (!modChannel)
                      return message.channel.send("No Logs Channel.");
                    modChannel.send(logEmbed);
                  }
                  member.kick(reason).catch((err) => {
                    if (err) return message.channel.send(`Error ${err}`);
                  });
                }).catch(() => {
                  const logEmbed = new MessageEmbed()
                    .setColor(theme.dataValues.embedTheme)
                    .setFooter(`Kicked Member`, member.user.displayAvatarURL)
                    .addField(
                      "Kicked Member",
                      `${member} with ID: ${member.id}`,
                      true
                    )
                    .addField(
                      "Kicked By",
                      `${message.member} with ID: ${message.member.id}`,
                      true
                    )
                    .addField("Kicked In", message.channel, true)
                    .addField("Reason", args.slice(1).join(" "), true)
                    .setTimestamp()
                    .setAuthor("Kicked Logs")
                    .setFooter(message.guild.name, message.guild.iconURL());
                  if (channel && channel.dataValues.modChannel !== null) {
                    const modChannel = message.guild.channels.cache.find(
                      (c) => c.name == channel.dataValues.modChannel
                    );
                    if (!modChannel)
                      return message.channel.send("No Logs Channel.");
                    modChannel.send(logEmbed);
                  }
                  member.kick(reason).catch((err) => {
                    if (err) return message.channel.send(`Error ${err}`);
                  });
                })
            }
          });
      })();
    });
  }
};