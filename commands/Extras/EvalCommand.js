const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const Channel = require("../../Database/models/Channel");
const Theme = require("../../Database/models/Theme");
const Reaction = require("../../Database/models/Reaction");
const {
  MessageEmbed,
  MessageCollector
} = require("discord.js");
module.exports = class EvalCommmand extends BaseCommand {
  constructor() {
    super(
      "eval",
      "Extras",
      ["e"],
      "Evaluates a code.",
      "[command | alias]",
      []
    );
  }

  async run(bot, message, args) {
    message.delete();
    const clean = (text) => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };
    if (message.author.id !== "488925593786777611") return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      /*       message.channel.send(clean(evaled), { code: "xl" }); */
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};