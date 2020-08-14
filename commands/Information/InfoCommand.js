const Discord = require("discord.js");
const Theme = require("../../Database/models/Theme");
const BaseCommand = require("../../utils/structures/BaseCommand");
const { MessageEmbed } = require("discord.js");
module.exports = class InfoCommmand extends BaseCommand {
  constructor() {
    super(
      "info",
      "Information",
      ["botinfo"],
      "Information about the bot.",
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

    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " day" : " days") + " ago";
    }

    let totalSeconds = bot.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let infoEmbed = new MessageEmbed()
      .setAuthor(bot.user.tag, bot.user.displayAvatarURL())
      .setDescription("[Powered By Aquirty](https://bots.aquirty.com)")
      .addField("Name", bot.user.username, true)
      .addField("Version", "BotOS V1", true)
      .addField("Server/s", bot.guilds.cache.size, true)
      .addField(
        "Uptime",
        "``" + `${days}d ${hours}h ${minutes}m ${seconds}s` + "``",
        true
      )
      .addField(
        "Created On",
        message.guild.createdAt.toUTCString().substr(0, 16) +
        `(${checkDays(bot.user.createdAt)})`,
        true
      )
      .setColor(theme.dataValues.embedTheme)
      .setFooter("Bot Information", message.author.displayAvatarURL())
      .setTimestamp()
      .setThumbnail(bot.user.displayAvatarURL())

    return message.channel.send(infoEmbed);
  }
};
