const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class SayCommmand extends BaseCommand {
  constructor() {
    super(
      "say",
      "Moderation",
      ["botsay"],
      "Says What You the Bot to say.",
      "[command | alias] <message>",
      []
    );
  }

  async run(bot, message, args) {
    message.delete();
    const reason = args.join(" ");
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      return message.channel.send(
        "You don't have permissions to use this command."
      );
    }

    if (!reason) {
      return message.channel.send("You didn't specified the message.");
    }

    message.channel.send(reason);
  }
};
