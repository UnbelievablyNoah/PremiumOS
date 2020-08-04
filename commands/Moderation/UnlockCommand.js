const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const ms = require("ms");
module.exports = class UnlockCommmand extends BaseCommand {
  constructor() {
    super(
      "unlock",
      "Moderation",
      ["unlockchannel"],
      "Unlocks a channel.",
      "[command | alias] <Role> <Time>",
      []
    );
  }

  async run(bot, message, args) {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) return;

    if (args[2]) {
      if (!args[0]) return message.channel.send("Provide the First Role Name.");
      if (!args[1]) return message.channel.send("Provide the Second Role Name");
      let role1 = message.guild.roles.cache.find((r) => r.name == args[0]);
      let role2 = message.guild.roles.cache.find((r) => r.name == args[1]);
      let role3 = message.guild.roles.cache.find((r) => r.name == args[2]);
      if (!role1) return message.channel.send("First Role not found.");
      if (!role2) return message.channel.send("Second Role not found.");
      if (!role3) return message.channel.send("Third Role not found.");
      message.channel.updateOverwrite(role1.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
      });
      message.channel.updateOverwrite(role2.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
      });
      message.channel
        .updateOverwrite(role3.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
        })
        .then(() => {
          message.channel.send(`This channel has been unlocked!`);
        });
    } else if (args[1]) {
      if (!args[0]) return message.channel.send("Provide the First Role Name.");
      if (!args[1]) return message.channel.send("Provide the Second Role Name");
      let role1 = message.guild.roles.cache.find((r) => r.name == args[0]);
      let role2 = message.guild.roles.cache.find((r) => r.name == args[1]);
      if (!role1) return message.channel.send("First Role not found.");
      if (!role2) return message.channel.send("Second Role not found.");
      message.channel.updateOverwrite(role1.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
      });
      message.channel
        .updateOverwrite(role2.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
        })
        .then(() => {
          message.channel.send(`This channel has been unlocked!`);
        });
    } else if (args[0]) {
      if (!args[0]) return message.channel.send("Provide a Role Name.");
      let role = message.guild.roles.cache.find((r) => r.name == args[0]);
      if (!role) return message.channel.send("No Role found.");
      message.channel
        .updateOverwrite(role.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
        })
        .then(() => {
          message.channel.send(`This channel has been unlocked!`);
        });
    } else {
      message.channel.send("Usage: unlock [Role Name]");
    }
  }
};
