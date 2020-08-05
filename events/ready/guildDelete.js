const BaseEvent = require("../../utils/structures/BaseEvent");
const Bot = require("../../Database/models/Bot");
const Theme = require("../../Database/models/Theme");
const Guild = require("../../Database/models/Guild");
const Auto = require("../../Database/models/Auto");
module.exports = class GuildDeleteEvent extends BaseEvent {
    constructor() {
        super("guildDelete");
    }
    async run(bot, guild) {
        const data = await Bot.findOne({
            where: {
                botId: bot.user.id
            }
        });
        const auto = await Auto.findOne({
            where: {
                botId: bot.user.id,
                guildId: guild.id
            }
        });
        const gData = await Guild.findOne({
            where: {
                botId: bot.user.id,
                guildId: guild.id
            }
        });
        const theme = await Guild.findOne({
            where: {
                botId: bot.user.id,
                guildId: guild.id
            }
        });
        if (data) {
            Bot.destroy({
                where: {
                    botId: bot.user.id
                }
            })
            if (gData) {
                Guild.destroy({
                    where: {
                        botId: bot.user.id,
                        guildId: guild.id,
                    }
                })
            }
            if (theme) {
                Theme.destroy({
                    where: {
                        botId: bot.user.id,
                        guildId: guild.id,
                    }
                })
            }
            if (auto) {
                Auto.destroy({
                    where: {
                        botId: bot.user.id,
                        guildId: guild.id,
                    }
                })
                return;
            }

        }
    }
};