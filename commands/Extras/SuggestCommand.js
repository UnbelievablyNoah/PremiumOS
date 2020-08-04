const Discord = require("discord.js");
const BaseCommand = require('../../utils/structures/BaseCommand');
const Channel = require('../../Database/models/Channel');
const Theme = require('../../Database/models/Theme');
const Bot = require('../../Database/models/Bot');
const {
    MessageEmbed
} = require('discord.js');
module.exports = class SuggestCommmand extends BaseCommand {
    constructor() {
        super('suggest', 'Extras', ['idea'], 'Suggest An Idea.', '[command | alias] <idea>', [])
    }

    async run(bot, message, args) {
        message.delete();

        const channel = await Channel.findOne({
            where: {
                botId: bot.user.id,
                guildId: message.guild.id
            }
        })
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        let botdata = await Bot.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        if (channel) {
            const suggestion = args.join(" ")
            const suggestChannel = message.guild.channels.cache.find(c => c.name == channel.dataValues.ideaChannel);
            if (!suggestChannel) return message.channel.send('No Suggestion Channel Found.');
            if (!suggestion) return message.channel.send('Suggest something.')
            let ideaEmbed = new MessageEmbed()
                .setAuthor(`Suggestion By ${message.author.tag}`, message.author.displayAvatarURL())
                .setTitle(suggestion)
                .setColor(theme.dataValues.embedTheme)
                .setTimestamp()
            suggestChannel.send(ideaEmbed).then(msg => {

                if (botdata.dataValues.ideaTicket !== null && botdata.dataValues.ideaCross !== null) {
                    msg.react(botdata.dataValues.ideaTicket).then(() => msg.react(botdata.dataValues.ideaCross));
                } else {
                    msg.react("✅").then(() => msg.react('❎'));
                }

            })
        } else {
            message.channel.send('Not Configured.')
        }



    }
}