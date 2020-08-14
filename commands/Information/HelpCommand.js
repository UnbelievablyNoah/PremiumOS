const Theme = require("../../Database/models/Theme");
const BaseCommand = require("../../utils/structures/BaseCommand");
const {
  MessageEmbed
} = require("discord.js");
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
        .setDescription('[Click here](https://bots.aquirty.com/commands)')
        .setColor(theme.dataValues.embedTheme)
        .setThumbnail(bot.user.displayAvatarURL())
        .setFooter("Help-Information", message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(infoEmbed);
    }
  }
};