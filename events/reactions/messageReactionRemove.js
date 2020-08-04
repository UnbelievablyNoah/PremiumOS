const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const Reaction = require("../../Database/models/Reaction");
module.exports = class messageReactionRemoveEvent extends BaseEvent {
  constructor() {
    super("messageReactionRemove");
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

    if (react) {
      if (user.bot) return;
      if (reaction.message.partial) {
        let role = reaction.message.guild.roles.cache.get(
          react.dataValues.role
        );
        if (!role) return;
        let member = reaction.message.guild.members.cache.get(user.id);
        if (role && member) {
          member.roles
            .remove(role)
            .then(() =>
              member.send(
                `**${role.name}** role has been removed from your roles.`
              )
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
            .remove(role)
            .then(() =>
              member.send(
                `**${role.name}** role has been removed from your roles.`
              )
            );
        }
      }
    }
  }
};