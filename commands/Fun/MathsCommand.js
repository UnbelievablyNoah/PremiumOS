const math = require('mathjs')
const BaseCommand = require('../../utils/structures/BaseCommand');
const {
    MessageEmbed
} = require('discord.js');
const Theme = require('../../Database/models/Theme')
module.exports = class RandomCommmand extends BaseCommand {
    constructor() {
        super('maths', 'Fun', ['math'], 'Helps to answer your math questions.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        const question = args.join(" ");
        try {
            const result = math.evaluate(question)
            if (isNaN(parseFloat(result))) {
                const embed = new MessageEmbed()
                    .setAuthor('Maths Calculator')
                    .addField('Input', "```" + question + "```")
                    .addField('Output', "```" + 'Invalid Calculation Expression' + "```")
                    .setColor(theme.dataValues.embedTheme)
                    .setFooter(`Asked By ${message.author.tag}`, message.author.displayAvatarURL())
                    .setTimestamp();
                return message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setAuthor('Maths Calculator')
                    .addField('Input', "```" + question + "```")
                    .addField('Output', "```" + result + "```")
                    .setColor(theme.dataValues.embedTheme)
                    .setFooter(`Asked By ${message.author.tag}`, message.author.displayAvatarURL())
                    .setTimestamp();
                return message.channel.send(embed);
            }
        } catch (error) {
            const embed = new MessageEmbed()
                .setAuthor('Maths Calculator')
                .addField('Input', "```" + question + "```")
                .addField('Output', "```" + 'Error while evaluating the math expression.' + "```")
                .setColor(theme.dataValues.embedTheme)
                .setFooter(`Asked By ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp();
            return message.channel.send(embed);
        }

    }
}