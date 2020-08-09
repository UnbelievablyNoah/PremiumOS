const Discord = require("discord.js");
const Theme = require("../../Database/models/Theme");
const BaseCommand = require("../../utils/structures/BaseCommand");
const { MessageEmbed } = require("discord.js");
module.exports = class InfoCommmand extends BaseCommand {
  constructor() {
    super(
      "ping",
      "Information",
      ["pong"],
      "Tells you the ping ",
      "[command | alias]",
      []
    );
  }

  async run(bot, message, args) {
  return message.channel.send(`**🏓 Pong!** Took me ${bot.ws.ping}ms!`);
  }
};
