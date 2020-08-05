const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const Theme = require("../../Database/models/Theme");
const Channel = require("../../Database/models/Channel");
const {
  MessageEmbed
} = require("discord.js");
module.exports = class PurgeCommmand extends BaseCommand {
  constructor() {
    super(
      "purge",
      "Moderation",
      ["clear"],
      "Bulk Deletes the Messages.",
      "[command | alias] <number>",
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
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.channel.send(
        "You don't have permission to user this command."
      );
    message.delete().then(() => {
      const number = args[0];

      if (number <= 100) {
        message.channel.messages
          .fetch({
            limit: number,
          })
          .then((messages) => {
            message.channel.bulkDelete(messages).then((messages) => {
              message.channel
                .send(`✅ Cleared ${messages.size} messages!`)
                .then(() => {
                  const logEmbed = new MessageEmbed()
                    .setAuthor(
                      message.author.tag,
                      message.author.displayAvatarURL()
                    )
                    .setDescription(
                      "**Bulk Deleted** in <#" +
                      message.channel.id +
                      `>, ${number} messages has been deleted.`
                    )
                    .setColor(theme.dataValues.embedTheme)
                    .setFooter(`Author ID: ${message.author.id}`)
                    .setTimestamp();

                  if (channel && channel.dataValues.logChannel !== null) {
                    const modChannel = message.guild.channels.cache.find(
                      (c) => c.name == channel.dataValues.logChannel
                    );
                    if (!modChannel)
                      return message.channel.send("No Logs Channel.");
                    modChannel.send(logEmbed);
                  }
                })
            }).catch((err) => {
              message.channel.send("Error while purging: **You can only bulk delete messages that are under 14 days old.**");
            });
          });
      } else {
        message.channel.send("Should be a number below 100.");
      }
    });
  }
};