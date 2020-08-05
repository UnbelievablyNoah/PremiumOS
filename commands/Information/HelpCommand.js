const Discord = require("discord.js");
const fs = require("fs");
const Theme = require("../../Database/models/Theme");
const request = require("node-superfetch");
const data = [];
const BaseCommand = require("../../utils/structures/BaseCommand");
const {
  MessageEmbed
} = require("discord.js");
const info = new Map();
const fun = new Map();
const support = new Map();
const images = new Map();
const mod = new Map();

module.exports = class HelpCommmand extends BaseCommand {
  constructor() {
    super(
      "help",
      "Information",
      ["cmds"],
      "Information about all the commands",
      "[command | alias]",
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

    if (args[0]) {
      let command = bot.commands.get(args[0]);
      if (command !== undefined) {
        let helpEmbed = new MessageEmbed()
          .setAuthor(command.name, bot.user.displayAvatarURL())
          .addField("Description", command.description, true)
          .addField("Category", command.category, true)
          .addField("Aliases", "``" + command.aliases + "``", true)
          .addField("Usage", command.usage, true)
          .setFooter(
            "Usage (Optional: [command | alias] - Required: <>)",
            message.author.displayAvatarURL()
          )
          .setColor(theme.dataValues.embedTheme)
          .setThumbnail(bot.user.displayAvatarURL());
        return message.channel.send(helpEmbed);
      }
    } else {
      const infoEmbed = new MessageEmbed()
        .setAuthor("Help", bot.user.displayAvatarURL())
        .setTitle("Information")
        .setColor(theme.dataValues.embedTheme)
        .setThumbnail(bot.user.displayAvatarURL())
        .setFooter("Help-Information", message.author.displayAvatarURL())
        .setTimestamp();
      let infod = ["help", "info", "whois", "count", "roleinfo", "serverinfo"];
      infod.forEach((d) => {
        const data = bot.commands.get(d);
        info.set([data.name], [data.name, data.description]);
      });
      const infoc = info.forEach((i) => {
        infoEmbed.addField(i[0], i[1], true);
      });
      const funEmbed = new MessageEmbed()
        .setAuthor("Help", bot.user.displayAvatarURL())
        .setTitle("Fun")
        .setColor(theme.dataValues.embedTheme)
        .setThumbnail(bot.user.displayAvatarURL())
        .setFooter("Help-Information", message.author.displayAvatarURL())
        .setTimestamp();
      let fund = [
        "anime",
        "8ball",
        "joke",
        "random",
        "roll",
        "rock",
        "today",
        "urban",
      ];
      fund.forEach((d) => {
        const data = bot.commands.get(d);
        fun.set([data.name], [data.name, data.description]);
      });
      const func = fun.forEach((i) => {
        funEmbed.addField(i[0], i[1], true);
      });
      const imageEmbed = new MessageEmbed()
        .setAuthor("Help", bot.user.displayAvatarURL())
        .setTitle("Images")
        .setColor(theme.dataValues.embedTheme)
        .setThumbnail(bot.user.displayAvatarURL())
        .setFooter("Help-Information", message.author.displayAvatarURL())
        .setTimestamp();
      let imagesd = ["alpaca", "avatar", "cat", "dog", "gif", "meme", "seal"];
      imagesd.forEach((d) => {
        const data = bot.commands.get(d);
        images.set([data.name], [data.name, data.description]);
      });
      images.forEach((i) => {
        imageEmbed.addField(i[0], i[1], true);
      });
      const supportEmbed = new MessageEmbed()
        .setAuthor("Help", bot.user.displayAvatarURL())
        .setTitle("Support")
        .setColor(theme.dataValues.embedTheme)
        .setThumbnail(bot.user.displayAvatarURL())
        .setFooter("Help-Information", message.author.displayAvatarURL())
        .setTimestamp();
      let supportd = ["support", "close", "suggest"];
      supportd.forEach((d) => {
        const data = bot.commands.get(d);
        support.set([data.name], [data.name, data.description]);
      });
      support.forEach((i) => {
        supportEmbed.addField(i[0], i[1], true);
      });
      const modEmbed = new MessageEmbed()
        .setAuthor("Help", bot.user.displayAvatarURL())
        .setTitle("Moderation")
        .setColor(theme.dataValues.embedTheme)
        .setThumbnail(bot.user.displayAvatarURL())
        .setFooter("Help-Information", message.author.displayAvatarURL())
        .setTimestamp();
      let modd = [
        "kick",
        "ban",
        "mute",
        "unmute",
        "lock",
        "unlock",
        "add",
        "remove",
        "role",
        "demote",
        "dm",
        "purge",
        "warn",
        "say",
      ];
      modd.forEach((d) => {
        const data = bot.commands.get(d);
        mod.set([data.name], [data.name, data.description]);
      });
      mod.forEach((i) => {
        modEmbed.addField(i[0], i[1], true);
      });
      info.clear();
      message.channel.send(infoEmbed).then((msg) => {
        msg.react("▶");
        const filter = (reaction, user) => {
          return (
            ["▶", "◀"].includes(reaction.emoji.name) &&
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

            if (reaction.emoji.name === "▶") {
              fun.clear();
              msg.edit(funEmbed).then((msg1) => {
                msg.reactions
                  .removeAll()
                  .catch((error) =>
                    console.error("Failed to clear reactions: ", error)
                  );
                msg1.react("◀");
                msg1.react("▶");
                msg1
                  .awaitReactions(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === "◀") {
                      msg1.edit(infoEmbed);
                    }
                    if (reaction.emoji.name === "▶") {
                      images.clear();
                      msg1.edit(imageEmbed).then((msg2) => {
                        msg2.reactions
                          .removeAll()
                          .catch((error) =>
                            console.error("Failed to clear reactions: ", error)
                          );
                        msg2.react("◀");
                        msg2.react("▶");
                        msg2
                          .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                          })
                          .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "◀") {
                              msg2.edit(funEmbed);
                              msg2.reactions
                                .removeAll()
                                .catch((error) =>
                                  console.error(
                                    "Failed to clear reactions: ",
                                    error
                                  )
                                );
                            }
                            if (reaction.emoji.name === "▶") {
                              support.clear();
                              msg2.edit(supportEmbed).then((msg3) => {
                                msg3.reactions
                                  .removeAll()
                                  .catch((error) =>
                                    console.error(
                                      "Failed to clear reactions: ",
                                      error
                                    )
                                  );
                                msg3.react("◀");
                                msg3.react("▶");
                                msg3
                                  .awaitReactions(filter, {
                                    max: 1,
                                    time: 60000,
                                    errors: ["time"],
                                  })
                                  .then((collected) => {
                                    const reaction = collected.first();

                                    if (reaction.emoji.name === "◀") {
                                      msg3.edit(imageEmbed);
                                    }
                                    if (reaction.emoji.name === "▶") {
                                      msg3.edit(modEmbed);
                                    }
                                  });
                              });
                            }
                          });
                      });
                    }
                  });
              });
            }
          });
      });
    }
  }
};