const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
module.exports = class RollCommmand extends BaseCommand {
  constructor() {
    super("roll", "Fun", ["dice"], "Rolls a dice.", "[command | alias]", []);
  }

  async run(bot, message, args) {
    const rollDice = Math.floor(Math.random() * 6) + 1;

    message.reply("rolled " + rollDice);
  }
};
