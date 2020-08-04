const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const answer = ["rock", "paper", "scissors"];
const Bot = require("../../Database/models/Bot");
module.exports = class RollCommmand extends BaseCommand {
  constructor() {
    super(
      "rock",
      "Fun",
      ["paper", "scissors"],
      "Rock Paper Scissors!",
      "[command | alias]",
      []
    );
  }
  async run(bot, message, args) {
    const botdata = await Bot.findOne({
      where: {
        botId: bot.user.id,
        guildId: message.guild.id,
      },
    });
    if (botdata) {
      const prefix = botdata.dataValues.botPrefix;
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);

      let content = answer[Math.round(Math.random() * (answer.length - 1))];

      if (cmdName === "rock" && content === "rock") {
        message.channel.send(`👊 Oh! It's a draw!`);
      } else if (cmdName === "rock" && content === "scissors") {
        message.channel.send(`✂ Oh! I beat you!`);
      } else if (cmdName === "rock" && content === "paper") {
        message.channel.send(`✋ Oh! I beat you!`);
      } else if (cmdName === "scissors" && content === "scissors") {
        message.channel.send(`✂ Oh! It's a draw!`);
      } else if (cmdName === "scissors" && content === "rock") {
        message.channel.send(`👊 Oh! I beat you!`);
      } else if (cmdName === "scissors" && content === "paper") {
        message.channel.send(`✋ Oh! You beat me!`);
      } else if (cmdName === "paper" && content === "scissors") {
        message.channel.send(`✂ Oh! I beat you!`);
      } else if (cmdName === "paper" && content === "rock") {
        message.channel.send(`👊 Oh! I beat you!`);
      } else if (cmdName === "paper" && content === "paper") {
        message.channel.send(`✋ Oh! It's a draw!`);
      }
    }
  }
};
