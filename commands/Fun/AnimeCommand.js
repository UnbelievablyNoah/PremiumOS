const Discord = require("discord.js")
const fs = require('fs')
const Theme = require('../../Database/models/Theme')
const request = require('node-superfetch');
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')

module.exports = class AnimeCommmand extends BaseCommand {
    constructor() {
        super('anime', 'Fun', ['animeinfo'], 'Tells about an anime', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        function shorten(text, maxLen = 2000) {
            return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
        }
        const query = args[0];
        const {
            text
        } = await request
            .get('https://kitsu.io/api/edge/anime')
            .query({
                'filter[text]': query
            });
        const body = JSON.parse(text);
        if (!body.data.length) return message.reply('Could not find any results.');
        const data = body.data[0].attributes;
        const embed = new Discord.MessageEmbed()
            .setColor(theme.dataValues.embedTheme)
            .setAuthor(data.canonicalTitle, message.author.displayAvatarURL())
            .setThumbnail(data.posterImage ? data.posterImage.original : null)
            .setDescription(shorten(data.synopsis))
            .addField('Type', `${data.showType} - ${data.status}`, true)
            .addField('Episodes', data.episodeCount || '???', true)
            .addField('Start Date', data.startDate ? new Date(data.startDate).toDateString() : '???', true)
            .addField('End Date', data.endDate ? new Date(data.endDate).toDateString() : '???', true)
            .setTimestamp();
        return message.channel.send(embed);


    }
}