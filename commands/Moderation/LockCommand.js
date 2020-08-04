const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const ms = require("ms");
module.exports = class LockCommmand extends BaseCommand {
  constructor() {
    super(
      "lock",
      "Moderation",
      ["lockchannel"],
      "Locks a channel.",
      "[command | alias] <Role> <Time>",
      []
    );
  }

  async run(bot, message, args) {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) return;
    if (args[3]) {
      if (!args[0]) return message.channel.send("Provide the First Role Name.");
      if (!args[1]) return message.channel.send("Provide the Second Role Name");
      if (!args[2]) return message.channel.send("Provide the Third Role Name");
      let role1 = message.guild.roles.cache.find((r) => r.name == args[0]);
      let role2 = message.guild.roles.cache.find((r) => r.name == args[1]);
      let role3 = message.guild.roles.cache.find((r) => r.name == args[2]);
      if (!role1) return message.channel.send("First Role not found.");
      if (!role2) return message.channel.send("Second Role not found.");
      if (!role3) return message.channel.send("Third Role not found.");
      message.channel.updateOverwrite(role1.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: false,
      });
      message.channel.updateOverwrite(role2.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: false,
      });
      message.channel
        .updateOverwrite(role3.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: false,
        })
        .then(() => {
          message.channel.send(`This channel has been locked.`);
          setTimeout(function () {
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
              .then(() =>
                message.channel.send("This channel has been unlocked!")
              );
          }, ms(args[3]));
        });
    } else if (args[2]) {
      if (!args[0]) return message.channel.send("Provide the First Role Name.");
      if (!args[1]) return message.channel.send("Provide the Second Role Name");
      let role1 = message.guild.roles.cache.find((r) => r.name == args[0]);
      let role2 = message.guild.roles.cache.find((r) => r.name == args[1]);
      if (!role1) return message.channel.send("First Role not found.");
      if (!role2) return message.channel.send("Second Role not found.");
      message.channel.updateOverwrite(role1.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: false,
      });
      message.channel
        .updateOverwrite(role2.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: false,
        })
        .then(() => {
          message.channel.send(`This channel has been locked.`);
          setTimeout(function () {
            message.channel.updateOverwrite(role1.id, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
            });
            message.channel
              .updateOverwrite(role2.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
              })
              .then(() =>
                message.channel.send("This channel has been unlocked!")
              );
          }, ms(args[3]));
        });
    } else if (args[1]) {
      if (!args[0]) return message.channel.send("Provide a Role Name.");
      if (!args[1]) return message.channel.send("Provide a Time.");
      let role = message.guild.roles.cache.find((r) => r.name == args[0]);
      if (!role) return message.channel.send("No Role found.");
      message.channel
        .updateOverwrite(role.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: false,
        })
        .then(() => {
          message.channel.send(`This channel has been locked.`);
          setTimeout(function () {
            message.channel
              .updateOverwrite(role.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
              })
              .then(() =>
                message.channel.send("This channel has been unlocked!")
              );
          }, ms(args[1]));
        });
    } else {
      message.channel.send("Usage: lock [Role Name] [Time]");
    }
  }
};
