const Discord = require("discord.js");
const BaseCommand = require('../../utils/structures/BaseCommand');
const Channel = require('../../Database/models/Channel');
const Theme = require('../../Database/models/Theme');
const Reaction = require('../../Database/models/Reaction');
const {
    MessageEmbed,
    MessageCollector
} = require('discord.js');
module.exports = class AddReactionCommmand extends BaseCommand {
    constructor() {
        super('addreaction', 'Extras', ['reactionadd'], 'Add Roles & Emojis for Reaction Role', '[command | alias] <idea>', [])
    }

    async run(bot, message, args) {

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("You don't have permissions to use this command.")
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        let reaction = await Reaction.findAndCountAll({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        let msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;

        if (reaction.count <= 10) {

            const fetched = await message.channel.messages.fetch(args[0])

            if (!fetched) return message.channel.send('No Message found.');
            let reactEmbed = new MessageEmbed()
                .setAuthor('Provide below Reaction with Emoji that you want to add for Reaction Role. (Emoji Name, Role Name)', bot.user.displayAvatarURL())
                .setColor(theme.dataValues.embedTheme);
            message.channel.send(reactEmbed)

            let collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message), {
                max: 10,
                time: 60000,
                errors: ['time']
            });

            collector.on('collect', msg => {

                if (msg.content.toLowerCase() == 'done') {
                    collector.stop('Done with the collection.');
                    return;
                }

                let [emojiName, roleName] = msg.content.split(/,\s+/);
                if (!emojiName && !roleName) return message.channel.send("Usage: Emoji Name, Role Name.");

                const emoji = message.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
                const role = message.guild.roles.cache.find(r => r.name === roleName)
                if (!emoji) return message.channel.send('No emoji found!');
                if (!role) return message.channel.send('No role found!');;
                (async () => {
                    let find = await Reaction.findAndCountAll({
                        where: {
                            guildId: message.guild.id,
                            botId: bot.user.id
                        }
                    })

                    if (find.count <= 10) {
                        fetched.react(emoji)
                            .then(emoji => message.channel.send('Reacted!'))
                            .catch(err => console.log(err));
                        Reaction.create({
                            botId: bot.user.id,
                            guildId: message.guild.id,
                            messageId: fetched.id,
                            emoji: emoji.id,
                            role: role.id
                        })
                    } else {
                        message.channel.send('You can not add more than 10.')
                    }



                })();

            });

            collector.on('end', async (collected, reason) => {
                message.channel.send('All Emojis & Roles has been added and saved.')
            });

        } else {
            message.channel.send('You can not add more than 10.')
        }

    }
}