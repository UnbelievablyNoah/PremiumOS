const BaseCommand = require("../../utils/structures/BaseCommand");
const Support = require("../../Database/models/Support");
const {
  MessageEmbed
} = require("discord.js");
const Theme = require("../../Database/models/Theme");
module.exports = class SupportCommand extends BaseCommand {
  constructor() {
    super(
      "support",
      "Extras",
      ["ticket"],
      "Creates a support ticket.",
      "[command | alias]"
    );
  }

  async run(bot, message, args) {
    let ticket = await Support.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id,
      },
    });

    if (ticket) {
      let theme = await Theme.findOne({
        where: {
          guildId: message.guild.id,
          botId: bot.user.id,
        },
      });
      if (ticket.dataValues.supportType === "reaction") {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
        let ticketEmbed = new MessageEmbed()
          .setAuthor("Support-Ticket", message.guild.iconURL())
          .setTitle("React below in order to create a support-ticket")
          .setColor(theme.dataValues.embedTheme)
          .setTimestamp();
        message.channel.send(ticketEmbed).then((msg) => {
          msg.react("🎫");
          ticket.update({
            messageId: msg.id,
          }, {
            where: {
              guildId: message.guild.id,
              botId: bot.user.id,
            },
          });
        });
      } else if (ticket.dataValues.supportType === "command") {
        let category = message.guild.channels.cache.find(
          (c) => c.name == ticket.dataValues.category && c.type == "category"
        );
        if (!category) return message.channel.send("No Category found.");
        if (
          message.guild.channels.cache.find(
            (channel) =>
            channel.name ===
            `support-${message.member.user.username.toLowerCase()}`
          )
        ) {
          return message.channel.send(
            "You already have a support-ticket opened!"
          );
        }
        message.guild.channels
          .create(
            `support-${message.member.user.username.toLowerCase()}`,
            "text"
          )
          .then((channel) => {
            channel.setParent(category.id);
            let dmEmbed = new MessageEmbed()
              .setAuthor(
                `Hi ${message.author.username}, your Support ticket has been created!`,
                message.author.displayAvatarURL()
              )
              .setDescription(`<#${channel.id}>`)
              .setTimestamp()
              .setColor(theme.dataValues.embedTheme);
            let supportEmbed = new MessageEmbed()
              .setAuthor(
                `Hi, ${message.author.username}!`,
                message.author.displayAvatarURL()
              )
              .setTitle(ticket.dataValues.message)
              .setTimestamp()
              .setColor(theme.dataValues.embedTheme);
            channel.updateOverwrite(message.guild.roles.everyone, {
              VIEW_CHANNEL: false,
            });
            channel.updateOverwrite(message.author, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
            });

            if (ticket.dataValues.roles !== null) {
              const roles = JSON.parse(JSON.stringify(ticket.dataValues.roles));
              roles.forEach(r => {
                console.log(r);
                if (message.guild.roles.cache.find(ro => ro.id === r)) {
                  channel.updateOverwrite(r, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                  });
                };
              });
            };
            channel.send(supportEmbed);
            message.author.send(dmEmbed);
          });
      } else {
        message.channel.send("Not Configured.");
      }
    }
  }
};