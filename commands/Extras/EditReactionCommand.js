const Discord = require("discord.js");
const BaseCommand = require('../../utils/structures/BaseCommand');
const Channel = require('../../Database/models/Channel');
const Theme = require('../../Database/models/Theme');
const Reaction = require('../../Database/models/Reaction');
const {
    MessageEmbed,
    MessageCollector
} = require('discord.js');
module.exports = class EditReactionCommmand extends BaseCommand {
    constructor() {
        super('editreaction', 'Extras', ['reactionedit'], 'Edit/Add Roles & Emojis for Reaction Role', '[command | alias] <idea>', [])
    }

    async run(bot, message, args) {

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("You don't have permissions to use this command.")
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        if (!args[0]) return message.channel.send('Usage: -editreaction add/edit [message id]');
        if (!args[1]) return message.channel.send('Provide a Message ID.');

        let reaction = await Reaction.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id,
                messageId: args[1]
            }
        })

        if (args[0].toLowerCase() === 'add') {
            let reactEmbed = new MessageEmbed()
                .setAuthor('Provide below Reaction with Emoji that you want to add for Reaction Role. (Emoji Name, Role Name)', bot.user.displayAvatarURL())
                .setColor(theme.dataValues.embedTheme);
            message.channel.send(reactEmbed)
            let collector = new MessageCollector(message.channel, collectorFilter, {
                max: 10,
                time: 60000,
                errors: ['time']
            });

            collector.on('collect', msg => {
                if (msg.content.toLowerCase() === 'done') {
                    collector.stop();
                    resolve();
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

                    if (find.count <= 20) {
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
        } else if (args[0].toLowerCase() == 'remove') {
            if (args[2]) {
                Reaction.destroy({
                    where: {
                        guildId: message.guild.id,
                        reactionCount: args[2],
                        botId: bot.user.id
                    }
                }).then(() => {
                    let deletedEmbed = new MessageEmbed()
                        .setAuthor(`Successfully, deleted the reaction #${args[1]}!`, message.guild.iconURL())
                        .setTimestamp()
                        .setColor(theme.dataValues.embedTheme);
                    message.channel.send(deletedEmbed)
                });

            } else {
                const awaitEmbed = new MessageEmbed()
                    .setAuthor('Finding...', message.guild.iconURL())
                    .setColor(theme.dataValues.embedTheme);
                message.channel.send(awaitEmbed).then(msg => {
                    ;
                    (async () => {
                        const count = await Reaction.findAndCountAll({
                            where: {
                                botId: bot.user.id,
                                guildId: message.guild.id,
                                messageId: args[0]
                            }
                        });
                        const embed = new MessageEmbed()
                            .setAuthor('All Reaction Roles for ' + message.guild.name, message.guild.iconURL())
                            .setColor(theme.dataValues.embedTheme)
                            .setTitle('To remove any of the following below, editreaction remove [Reaction Number]');

                        if (!count) {
                            const noFound = new MessageEmbed()
                                .setAuthor('No Reaction Roles found for this message.')
                                .setColor(theme.dataValues.embedTheme);
                            return msg.edit(noFound);
                        }
                        Reaction.findAll({

                            limit: 10,
                            where: {
                                botId: bot.user.id,
                                guildId: message.guild.id,
                                messageId: args[1]
                            }

                        }).then(function (r) {
                            r.forEach(rs => {

                                let role = message.guild.roles.cache.get(rs.dataValues.role);
                                let emoji = message.guild.emojis.cache.get(rs.dataValues.emoji);
                                if (!role) return;
                                if (!emoji) return;

                                embed.addField('Reaction No', rs.dataValues.reactionCount, true);
                                embed.addField('Emoji', "``" + emoji.name + "`` =>", true)
                                embed.addField('Role', "``" + role.name + "``", true)
                                sleep(300)
                                msg.edit(embed)
                            });

                        })
                    })();

                });
            }

        }

    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}