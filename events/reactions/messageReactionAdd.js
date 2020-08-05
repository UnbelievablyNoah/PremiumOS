const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Reaction = require("../../Database/models/Reaction");
const Support = require("../../Database/models/Support");
const Theme = require("../../Database/models/Theme");
const {
  MessageEmbed
} = require("discord.js");
module.exports = class messageReactionAddEvent extends BaseEvent {
  constructor() {
    super("messageReactionAdd");
  }
  async run(bot, reaction, user) {
    const react = await Reaction.findOne({
      where: {
        botId: bot.user.id,
        guildId: reaction.message.guild.id,
        messageId: reaction.message.id,
        emoji: reaction.emoji.id,
      },
    });
    let ticket = await Support.findOne({
      where: {
        guildId: reaction.message.guild.id,
        botId: bot.user.id,
      },
    });
    let theme = await Theme.findOne({
      where: {
        guildId: reaction.message.guild.id,
        botId: bot.user.id,
      },
    });

    if (react) {
      if (user.bot) return;
      if (reaction.message.partial) {
        let role = reaction.message.guild.roles.cache.get(
          react.dataValues.role
        );
        if (!role) return console.log("No role!");
        let member = reaction.message.guild.members.cache.get(user.id);
        if (role && member) {
          member.roles
            .add(role)
            .then(() =>
              member.send(`You've received the **${role.name}** role.`)
            );
        }
      } else {
        let role = reaction.message.guild.roles.cache.get(
          react.dataValues.role
        );
        if (!role) return;
        let member = reaction.message.guild.members.cache.get(user.id);
        if (role && member) {
          member.roles
            .add(role)
            .then(() =>
              member.send(
                `You've received the **${role.name}** role in ${reaction.message.guild.name}.`
              )
            );
        }
      }
    }
    if (reaction.message.id === ticket.dataValues.messageId) {
      if (reaction.emoji.name == "🎫") {
        if (user.bot) return;
        let member = reaction.message.guild.members.cache.get(user.id);
        let category = reaction.message.guild.channels.cache.find(
          (c) => c.name == ticket.dataValues.category && c.type == "category"
        );
        if (!category) return;
        if (
          reaction.message.guild.channels.cache.find(
            (channel) =>
            channel.name === `support-${member.user.username.toLowerCase()}`
          )
        ) {
          return member.send("You already have a support-ticket opened!");
        }
        (async () => {
          await reaction.message.guild.channels
            .create(`support-${member.user.username.toLowerCase()}`, "text")
            .then((channel) => {
              channel.setParent(category.id);
              let dmEmbed = new MessageEmbed()
                .setAuthor(
                  `Hi ${member.user.username}, your Support ticket has been created!`,
                  member.user.displayAvatarURL()
                )
                .setDescription(`<#${channel.id}>`)
                .setTimestamp()
                .setColor(theme.dataValues.embedTheme);
              let supportEmbed = new MessageEmbed()
                .setAuthor(
                  `Hi, ${member.user.username}!`,
                  member.user.displayAvatarURL()
                )
                .setTitle(ticket.dataValues.message)
                .setTimestamp()
                .setColor(theme.dataValues.embedTheme);
              channel.updateOverwrite(reaction.message.guild.roles.everyone, {
                VIEW_CHANNEL: false,
              });
              channel.updateOverwrite(member, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
              });

              if (ticket.dataValues.roles !== null) {
                const roles = JSON.parse(JSON.stringify(ticket.dataValues.roles));
                if (!roles.length > 0) return;
                roles.forEach(r => {
                  console.log(r);
                  if (reaction.message.guild.roles.cache.find(ro => ro.id === r)) {
                    channel.updateOverwrite(r, {
                      VIEW_CHANNEL: true,
                      SEND_MESSAGES: true,
                    });
                  };
                });
              };
              channel.send(supportEmbed);
              reaction.users.remove(user.id);
              member.send(dmEmbed);
            });
        })();
      }
    }
  }
};