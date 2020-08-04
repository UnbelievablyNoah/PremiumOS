const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const Guild = require("../../Database/models/Guild");
module.exports = class RollCommmand extends BaseCommand {
  constructor() {
    super(
      "everyone",
      "Moderation",
      ["here"],
      "Ping Here Or Everyone.",
      "[command | alias]",
      []
    );
  }
  async run(bot, message, args) {
    const gData = await Guild.findOne({
      where: {
        botId: bot.user.id,
        guildId: message.guild.id,
      },
    });
    if (!message.member.permissions.has("MENTION_EVERYONE")) return;

    if (gData) {
      message.delete();
      const prefix = gData.dataValues.botPrefix;
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);

      if (cmdName.toLowerCase() == "everyone") {
        message.channel.send("@everyone");
      } else if (cmdName.toLowerCase() == "here") {
        message.channel.send("@here");
      }
    }
  }
};