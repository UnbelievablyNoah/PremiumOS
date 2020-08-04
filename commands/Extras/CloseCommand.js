const Discord = require("discord.js");
const BaseCommand = require('../../utils/structures/BaseCommand');
const Channel = require('../../Database/models/Channel');
const Theme = require('../../Database/models/Theme');
const Bot = require('../../Database/models/Bot');
const {
    MessageEmbed
} = require('discord.js');
module.exports = class CloseCommmand extends BaseCommand {
    constructor() {
        super('close', 'Extras', ['closeticket'], 'Closes the Support Ticket.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        message.delete();

        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        if (!message.channel.name.startsWith(`support-`)) return message.channel.send(`You can't use the close command outside of a support ticket.`);

        const awaitEmbed = new MessageEmbed()
            .setAuthor('React below in order to close this support-ticket', message.author.displayAvatarURL())
            .setTimestamp()
            .setColor(theme.dataValues.embedTheme)
        message.channel.send(awaitEmbed).then(msg => {
            ;
            (async () => {
                msg.delete({
                    timeout: 60000,
                    reason: 'It had to be done.'
                });
                await msg.react('✅');
                const filter = (reaction, user) => {
                    return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                msg.awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    })
                    .then(collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '✅') {
                            message.channel.delete()
                        }
                    });
            })();
        });
    }
}