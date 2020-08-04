const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const cooldown = new Set();
const Theme = require("../../Database/models/Theme");
const axios = require("axios");
const Auto = require("../../Database/models/Auto");
const Channel = require("../../Database/models/Channel");
const Guild = require("../../Database/models/Guild");
const ms = require('ms')
const {
  MessageEmbed
} = require('discord.js')
module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(bot, message) {
    let auto = await Auto.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id
      }
    })
    let channel = await Channel.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id,
      },
    });
    const theme = await Theme.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id
      }
    });

    if (auto) {
      const words = JSON.parse(JSON.stringify(auto.dataValues.words));
      if (message.content.startsWith('https://discord.gg/')) {
        if (auto.dataValues.InviteStatus == true) {
          message.delete();
          message.channel.send("Invite links aren't allowed!").then(msg => msg.delete({
            timeout: 10000
          }));
        }
      } else if (message.mentions.users.size > 3) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
          if (auto.dataValues.MentionStatus == true) {
            let role = message.guild.roles.cache.find((r) => r.name === "Muted");
            const time = '24h';
            message.delete();
            let muteEmbed = new MessageEmbed()
              .setAuthor(
                `${message.author.tag} has been muted for ${ms(ms(time))}!`,
                message.author.displayAvatarURL()
              )
              .setColor(theme.dataValues.embedTheme);
            let logEmbed = new MessageEmbed()
              .setAuthor("Auto-Moderation - Muted Logs", message.author.displayAvatarURL())
              .addField("Muted Member", `${message.author} with ID: ${message.author}`, true)
              .addField("Muted In", message.channel, true)
              .addField("Time", ms(ms(time)), true)
              .setColor(theme.dataValues.embedTheme);
            message.member.roles.add(role.id)
            if (channel && channel.dataValues.modChannel !== null) {
              const modChannel = message.guild.channels.cache.find(
                (c) => c.name == channel.dataValues.modChannel
              );
              if (!modChannel) return message.channel.send("No Logs Channel.");
              modChannel.send(logEmbed);
            }
            message.channel.send(muteEmbed);
            message.member.send(
              `You've been muted in ${message.guild.name} for ${ms(ms(time))}!`
            ).catch(() => message.channel.send(`${message.member}, you've been muted for ${ms(ms(time))}!`))
            setTimeout(function () {
              message.member.roles.remove(role.id);
              message.channel.send(`<@${member.user.id}> has been unmuted!`);
              message.member.send(`You've been unmuted in ${message.guild.name}!`).catch(() => message.reply("You've been unmuted!"));
            }, ms(time));
          }
        }

      } else if (words.some(w => message.content.includes(w))) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
          if (auto.dataValues.WordStatus == true) {
            message.delete();
            message.channel.send('No swearing, keep this server friendly!').then(msg => msg.delete({
              timeout: 10000
            }));
          }
        }
      }
    }
    const gData = await Guild.findOne({
      where: {
        botId: bot.user.id,
        guildId: message.guild.id,
      },
    });

    if (cooldown.has(message.author.id)) {
      return;
    }

    cooldown.add(message.author.id);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, 5000);

    if (gData) {
      const prefix = gData.dataValues.botPrefix;
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
      const command = bot.commands.get(cmdName.toLowerCase());
      if (command) {
        command.run(bot, message, cmdArgs);
      }
    }
  }
};