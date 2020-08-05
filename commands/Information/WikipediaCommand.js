const Theme = require('../../Database/models/Theme')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js');
const striptags = require('striptags');
const request = require('request');
module.exports = class CountCommmand extends BaseCommand {
    constructor() {
        super('wikipedia', 'Information', ['wiki'], 'Gives information about a specific query from Wikipedia.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${args.join(" ")}&utf8=&format=json`
        request({
            url: url,
            json: true
        }, function getteamdata(error, response, body) {
            if (!error && response.statusCode === 200 && body.query.search[0]) {
                let finalurl = `http://en.wikipedia.org/?curid=${body.query.search[0].pageid}`
                let snippet = striptags(body.query.search[0].snippet)
                let embed = new MessageEmbed()
                    .setTitle(`Searched for: ${body.query.search[0].title}`)
                    .setAuthor('Wikipedia', 'http://i.imgur.com/JI3HL2j.png')
                    .setDescription(`${snippet}.. [Read more](${finalurl})`)
                    .setColor(theme.dataValues.embedTheme)
                    .addField('Word Count', `${body.query.search[0].wordcount}`, true)
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
                ''
                message.channel.send({
                    embed
                });
            } else {
                message.reply(`The query \`${args.join(" ")}\` returned no results.`);
            }
        })


    }
}