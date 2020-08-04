const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')
const Theme = require('../../Database/models/Theme')
const urban = require('relevant-urban')
module.exports = class UrbanCommmand extends BaseCommand {
    constructor() {
        super('urban', 'Fun', ['dictionary'], "Tell about a specified word from Urban Dictionary.", '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        let words = args.join(" ")
        if (!words) return message.channel.send("No words found to search, urban <search>")
        let res = await urban(words).catch(e => {
            return message.channel.send("Couldn't find the word!")
        })

        let urbanEmbed = new Discord.MessageEmbed()
            .setAuthor(res.word, bot.user.displayAvatarURL())
            .setURL(res.urbanURL)
            .setDescription("**Definition**\n" + `${res.definition}\n` + `**Example:** ${res.example}`)
            .addField("Author", res.author, true)
            .addField("Rating", `**Upvotes:** ${res.thumbsUp} | **Downvotes:** ${res.thumbsDown}`, true)
            .setColor(theme.dataValues.embedTheme)

        if (res.tags.length > 0 && res.tags.join(', ').length < 1024) {
            sEmbed.addField('Tags', res.tags.args.join(', '), true)
        }
        message.channel.send(urbanEmbed)



    }
}