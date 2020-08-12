const {
  MessageEmbed
} = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const Bot = require("../../Database/models/Bot");
const fetch = require("node-fetch");

module.exports = class SetCommmand extends BaseCommand {
  constructor() {
    super(
      "set",
      "Setup",
      ["botset"],
      "Set bot Settings.",
      "[command | alias] <args>",
      []
    );
  }

  async run(bot, message, args) {
    let botdata = await Bot.findOne({
      where: {
        botId: bot.user.id
      },
    });

    fetch(
      `https://bots.aquirty.com/api/ownership-check/${message.author.id}/${bot.user.id}`
    )
      .then((res) => res.json())
      .then((data) => {

        if (data.valid !== "true") return message.channel.send("You're aren't allowed to use this command.");
        if (!botdata) return message.channel.send("Bot isn't verified.");

        if (!args[0]) {
          const hEmbed = new MessageEmbed()
            .setAuthor('Bot Setup', bot.user.displayAvatarURL())
            .setTitle('Follow The Instructions below in order to change the Bot Settings')
            .addField('Status', 'set status [Playing, Listening, Watching] [status]')
            .addField('Prefix', 'set prefix [Prefix]')
            .addField('Avatar', 'set avatar [url/attachment]')
            .setTimestamp();

          return message.channel.send(hEmbed);
        }

        if (args[0].toLowerCase() === "name") {
          let name = args.slice(1).join(" ");
          if (!name) return message.channel.send("Provide the new Bot Name.");

          bot.user
            .setUsername(name)
            .then(() =>
              message.channel.send(
                `Successfully, changed the Bot name to ${name}!`
              )
            )
            .catch((err) => {
              message.channel.send(`Error, ${error}`);
              console.log(err);
            });
        } else if (args[0].toLowerCase() === "avatar") {
          let image = args[1];
          var Attachment = message.attachments.array();
          if (args[1]) {
            if (args[1].startsWith("https")) {
              bot.user
                .setAvatar(image)
                .then(() =>
                  message.channel.send(
                    `Successfully, changed the Bot Avatar!`
                  )
                )
                .catch((err) => {
                  message.channel.send(`Error, ${error}`);
                  console.log(err);
                });
            } else {
              message.channel.send("Invalid Image.");
            }
          } else if (Attachment) {
            bot.user
              .setAvatar(Attachment[0].url)
              .then(() =>
                message.channel.send(`Successfully, changed the Bot Avatar!`)
              )
              .catch((err) => {
                message.channel.send(`Error, ${error}`);
                console.log(err);
              });
          } else {
            message.channel.send("Invalid Image.");
          }
        } else if (args[0].toLowerCase() === "status") {
          let activity = args[1];
          let status = args.slice(2).join(" ");

          if (!activity && !status)
            return message.channel.send(
              "Usage: set status [Playing, Watching, Listening] [Status]"
            );

          Bot.update({
            botStatus: status,
            botActivity: activity.toUpperCase(),
          }, {
            where: {
              botId: bot.user.id,
              guildId: message.guild.id,
            },
          }).then(() => {
            message.channel
              .send(
                "Succesfully, Changed the Activity to " +
                "``" +
                activity +
                "`` & status to " +
                "``" +
                status +
                "``!"
              )
              .then(() => process.exit(1));
          });
        } else if (args[0].toLowerCase() === "prefix") {
          let prefix = args[1];

          if (!prefix)
            return message.channel.send("Usage: set prefix [Prefix]");

          Guild.update({
            botPrefix: prefix,
          }, {
            where: {
              botId: bot.user.id,
              guildId: message.guild.id,
            },
          }).then(() =>
            message.channel.send(
              "Succesfully, Changed the Prefix to " + "``" + prefix + "``"
            )
          );
        }
      });
  }
};