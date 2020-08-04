const {
  MessageEmbed
} = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const ms = require("ms");
const Theme = require("../../Database/models/Theme");
const Warn = require("../../Database/models/Warning");
const Channel = require("../../Database/models/Channel");
module.exports = class WarnCommmand extends BaseCommand {
  constructor() {
    super(
      "warn",
      "Moderation",
      ["warnuser"],
      "Warns a user.",
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
    let warn = await Warn.findOne({
      where: {
        guildId: message.guild.id,
        userId: member.id,
      },
    });

    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.channel.send(
        "You don't have permissions to use this command."
      );
    }

    const reason = args.slice(1).join(" ");

    if (!member) {
      return message.channel.send(
        "You didn't specified the user who you want to warn."
      );
    }

    if (!reason) {
      return message.channel.send("You didn't specified the reason.");
    }

    if (member.id == message.author.id) {
      return message.channel.send("You can't warn yourself..");
    }

    if (!member.kickable) {
      return message.channel.send("I can't warn this member.");
    }
    if (warn) {
      if (warn.dataValues.warnNo === "1") {
        let awaitEmbed = new MessageEmbed()
          .setAuthor(
            `Are you sure, you want to kick ${member.user.tag}?`,
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
                      `You've been kicked from ${message.guild.name} due to ${reaction}!`
                    )
                    .then(() => {
                      const logEmbed = new MessageEmbed()
                        .setColor(theme.dataValues.embedTheme)
                        .setFooter(
                          `Kicked Member`,
                          member.user.displayAvatarURL
                        )
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
                        .setAuthor("Warn Logs")
                        .setFooter(message.guild.name, message.guild.iconURL());
                      if (channel && channel.dataValues.modChannel !== null) {
                        const modChannel = message.guild.channels.cache.find(
                          (c) => c.name == channel.dataValues.modChannel
                        );
                        if (!modChannel)
                          return message.channel.send("No Logs Channel.");
                        modChannel.send(logEmbed);
                      }
                      Warn.update({
                        warnNo: "2",
                      }, {
                        where: {
                          guildId: message.guild.id,
                          userId: member.id,
                        },
                      }).then(() => {
                        member.kick(reason).catch((err) => {
                          if (err) return message.channel.send(`Error ${err}`);
                        });
                      });
                    }).catch(() => {
                      const logEmbed = new MessageEmbed()
                        .setColor(theme.dataValues.embedTheme)
                        .setFooter(
                          `Kicked Member`,
                          member.user.displayAvatarURL
                        )
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
                        .setAuthor("Warn Logs")
                        .setFooter(message.guild.name, message.guild.iconURL());
                      if (channel && channel.dataValues.modChannel !== null) {
                        const modChannel = message.guild.channels.cache.find(
                          (c) => c.name == channel.dataValues.modChannel
                        );
                        if (!modChannel)
                          return message.channel.send("No Logs Channel.");
                        modChannel.send(logEmbed);
                      }
                      Warn.update({
                        warnNo: "2",
                      }, {
                        where: {
                          guildId: message.guild.id,
                          userId: member.id,
                        },
                      }).then(() => {
                        member.kick(reason).catch((err) => {
                          if (err) return message.channel.send(`Error ${err}`);
                        });
                      });
                    })
                }
              });
          })();
        });
      } else if (warn.dataValues.warnNo === "2") {
        let awaitEmbed = new MessageEmbed()
          .setAuthor(
            `Are you sure, you want to ban ${member.user.tag}?`,
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
                      `You've been Banned from ${message.guild.name} due to ${reaction}!`
                    )
                    .then(() => {
                      const logEmbed = new MessageEmbed()
                        .setColor(theme.dataValues.embedTheme)
                        .setFooter(
                          `Banned Member`,
                          member.user.displayAvatarURL
                        )
                        .addField(
                          "Banned Member",
                          `${member} with ID: ${member.id}`,
                          true
                        )
                        .addField(
                          "Banned By",
                          `${message.member} with ID: ${message.member.id}`,
                          true
                        )
                        .addField("Banned In", message.channel, true)
                        .addField("Reason", args.slice(1).join(" "), true)
                        .setTimestamp()
                        .setAuthor("Warned Logs")
                        .setFooter(message.guild.name, message.guild.iconURL());
                      if (channel && channel.dataValues.modChannel !== null) {
                        const modChannel = message.guild.channels.cache.find(
                          (c) => c.name == channel.dataValues.modChannel
                        );
                        if (!modChannel)
                          return message.channel.send("No Logs Channel.");
                        modChannel.send(logEmbed);
                      }
                      Warn.update({
                        warnNo: "2",
                      }, {
                        where: {
                          guildId: message.guild.id,
                          userId: member.id,
                        },
                      }).then(() => {
                        member.ban(reason).catch((err) => {
                          if (err) return message.channel.send(`Error ${err}`);
                        });
                      })
                    }).catch(() => {
                      const logEmbed = new MessageEmbed()
                        .setColor(theme.dataValues.embedTheme)
                        .setFooter(
                          `Banned Member`,
                          member.user.displayAvatarURL
                        )
                        .addField(
                          "Banned Member",
                          `${member} with ID: ${member.id}`,
                          true
                        )
                        .addField(
                          "Banned By",
                          `${message.member} with ID: ${message.member.id}`,
                          true
                        )
                        .addField("Banned In", message.channel, true)
                        .addField("Reason", args.slice(1).join(" "), true)
                        .setTimestamp()
                        .setAuthor("Warned Logs")
                        .setFooter(message.guild.name, message.guild.iconURL());
                      if (channel && channel.dataValues.modChannel !== null) {
                        const modChannel = message.guild.channels.cache.find(
                          (c) => c.name == channel.dataValues.modChannel
                        );
                        if (!modChannel)
                          return message.channel.send("No Logs Channel.");
                        modChannel.send(logEmbed);
                      }
                      Warn.update({
                        warnNo: "2",
                      }, {
                        where: {
                          guildId: message.guild.id,
                          userId: member.id,
                        },
                      }).then(() => {
                        member.ban(reason).catch((err) => {
                          if (err) return message.channel.send(`Error ${err}`);
                        });
                      });
                    })
                }
              });
          })();
        });
      }
    } else {
      Warn.create({
        guildId: message.guild.id,
        warnNo: "1",
        userId: member.id
      }).then(() => {
        let role = message.guild.roles.cache.find((r) => r.name === "Muted");
        let time = "24h";

        if (!time) return message.channel.send("Specify a Time.");
        if (!role) return message.channel.send("Muted Role isn't found.");

        if (member.roles.cache.has(role.id)) {
          message.channel.send("This member is already Muted.");
        } else {
          member.roles.add(role.id).then(() => {
            let muteEmbed = new MessageEmbed()
              .setAuthor(
                `${member.user.tag} has been warned & muted for ${ms(
                  ms(time)
                )}!`,
                member.user.avatarURL()
              )
              .setColor(theme.dataValues.embedTheme);
            let logEmbed = new MessageEmbed()
              .setAuthor("Warn Logs", member.user.displayAvatarURL())
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
            );
            setTimeout(function () {
              member.roles.remove(role.id);
              message.channel.send(`<@${member.user.id}> has been unmuted!`);
              member.send(`You've been unmuted in ${message.guild.name}!`);
            }, ms(time));
          });
        }
      });
    }
  }
};