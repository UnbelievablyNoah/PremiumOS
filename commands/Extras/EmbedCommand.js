const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const Channel = require("../../Database/models/Channel");
const Theme = require("../../Database/models/Theme");
const Guild = require("../../Database/models/Guild");
const {
  MessageEmbed,
  MessageCollector
} = require("discord.js");
module.exports = class EmbedCommmand extends BaseCommand {
  constructor() {
    super(
      "embed",
      "Extras",
      ["message"],
      "Make your own Embed.",
      "[command | alias]",
      []
    );
  }

  async run(bot, message, args) {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
    const gData = await Guild.findOne({
      where: {
        botId: bot.user.id,
        guildId: message.guild.id,
      },
    });
    let theme = await Theme.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id
      }
    })

    if (gData) {
      message.delete();
      const prefix = gData.dataValues.botPrefix;
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);

      if (cmdName.toLowerCase() == "embed") {
        let collectorFilter = (m) => m.author.id == message.author.id;
        let filter = (m) => m.author.id === message.author.id;
        message.channel.send("Provide the channel below.");
        let awaitMsgOps = {
          max: 1,
          time: 300000,
          errors: ["time"]
        };
        let choice = (
          await message.channel.awaitMessages(filter, awaitMsgOps)
        ).first();
        if (choice.content.toLowerCase() == "cancel") {
          return message.channel.send("Cancelled.");
        } else {
          const name = choice.content;
          const channel = message.guild.channels.cache.find((c) => c.name == name);
          if (!channel) return message.channel.send("No channel found!");
          message.channel.send("Now starting making your Embed below.");
          let collector = new MessageCollector(message.channel, collectorFilter, {
            max: 10,
            time: 300000,
            errors: ["time"],
          });
          const embed = new MessageEmbed();
          collector.on("collect", (msg) => {
            if (msg.content.toLowerCase() === "done") {
              collector.stop();
              channel.send(embed);
            } else {
              let [component, title, description] = msg.content.split(/,\s+/);
              if (!component) return message.channel.send("Provide a component,");
              if (component.toLowerCase() == "field") {
                if (!title)
                  return message.channel.send("Provide a component title");
                if (!description)
                  return message.channel.send("Provide a description.");
                embed.addField(title, description, true);
                message.channel.send("Added!");
              }
              if (component.toLowerCase() == "description") {
                (async () => {
                  message.channel.send("Provide a description below.");
                  let choice = (
                    await message.channel.awaitMessages(filter, awaitMsgOps)
                  ).first();
                  const content = choice.content;
                  if (!content)
                    return message.channel.send("Provide a description");
                  embed.setDescription(content);
                  message.channel.send("Added!");
                })();
              }
              if (component.toLowerCase() == "title") {
                if (!title) return message.channel.send("Provide a description.");
                embed.setTitle(title);
                message.channel.send("Added!");
              }
              if (component.toLowerCase() == "author") {
                if (!title)
                  return message.channel.send("Provide a component title");
                if (description) {
                  embed.setAuthor(title, description);
                  message.channel.send("Added!");
                } else {
                  embed.setAuthor(title);
                  message.channel.send("Added!");
                }
              }
              if (component.toLowerCase() == "colour") {
                if (!title) return message.channel.send("Provide a Colour Code");
                embed.setColor(title);
                message.channel.send("Added!");
              }
              if (component.toLowerCase() == "footer") {
                if (!title) return message.channel.send("Provide a title.");
                if (description) {
                  embed.setFooter(title, description);
                  message.channel.send("Added!");
                } else {
                  embed.setFooter(title);
                  message.channel.send("Added!");
                }
              }
              if (component.toLowerCase() == "thumbnail") {
                if (!title) return message.channel.send("Provide an Image URL.");
                embed.setThumbnail(title);
                message.channel.send("Added!");
              }
              if (component.toLowerCase() == "image") {
                if (!title) return message.channel.send("Provide an Image URL.");
                embed.setImage(title);
                message.channel.send("Added!");
              }
              if (component.toLowerCase() == "timestamp") {
                embed.setTimestamp();
              }
            }
          });
          collector.on("end", async (collected, reason) => {
            message.channel.send("Embed Created!");
          });
        }
      } else if (cmdName.toLowerCase() == "message") {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        const msg = args.slice(1).join(" ");
        if (!channel) return message.channel.send('Usage: message #channel [Message here]');
        if (!msg) return message.channel.send('Usage: message #channel [Message here]');
        const embed = new MessageEmbed()
          .setAuthor("Message", message.guild.iconURL())
          .setDescription(msg)
          .setColor(theme.dataValues.embedTheme)
          .setFooter(`By ${message.author.tag}`);
        channel.send(embed);
      }
    }

  }
};