const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')
const Theme = require('../../Database/models/Theme')
const answer = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Yes",
    "Signs point to yes",
    "Ask again later",
    "I'd better not tell you now",
    "I cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My sources say no",
    "Very doubtful",
    "Maybe not",
    "Uhh something seems wrong...",
    "Go ahead",
    "Why not?"
]
module.exports = class PredictCommmand extends BaseCommand {
    constructor() {
        super('8ball', 'Fun', ['predict'], 'Predicts an Specified Event.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        let question = args.join(" ")

        if (!question) {
            return message.channel.send('Ask me something, go ahead!');
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(answer[Math.round(Math.random() * (answer.length - 1))] + '.', bot.user.displayAvatarURL())
            .setColor(theme.dataValues.embedTheme);

        return message.channel.send(embed);


    }
}