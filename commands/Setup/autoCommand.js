const {
    MessageEmbed
} = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const Bot = require("../../Database/models/Auto");
const fetch = require("node-fetch");
const Auto = require("../../Database/models/Auto");
module.exports = class SetCommmand extends BaseCommand {
    constructor() {
        super(
            "auto",
            "Setup",
            ["botset"],
            "Set Auto-Mod Settings.",
            "[command | alias] <args>",
            []
        );
    }

    async run(bot, message, args) {
        let auto = await Auto.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        fetch(
                `https://bots.aquirty.com/api/ownership-check/${message.author.id}/${bot.user.id}`
            )
            .then((res) => res.json())
            .then((data) => {

                if (data.valid !== "true") return message.channel.send("You're aren't allowed to use this command.");
                if (data.message) return message.channel.send("You're aren't allowed to use this command.");
                if (!args[0]) {
                    const hEmbed = new MessageEmbed()
                        .setAuthor('Auto-Moderation Setup', bot.user.displayAvatarURL())
                        .addField('Auto-Mod', '**Words** - ``auto Words [true/false]``\n**Mentions** - ``auto Mention [true/false]``\n**Invite Links** - ``auto Invite [true/false]``')
                        .addField('Logs', '**Member Logs** - ``auto Member [true/false]``\n**Message Logs** - ``auto Message [true/false]``\n**Channel Logs** - ``auto Message [true/false]``\n**Role Logs** - ``auto Role [true/false]``')
                        .setTimestamp();
                    return message.channel.send(hEmbed);
                }
                if (args[0].toLowerCase() == 'words') {
                    if (args[1].toLowerCase() == 'true') {
                        if (auto) {
                            Auto.update({
                                WordStatus: true
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Words Status: ``TRUE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                WordStatus: true
                            }).then(() => {
                                message.channel.send("Successfully, set the Words Status: ``TRUE``");
                            })
                        }

                    } else if (args[1].toLowerCase() == 'false') {
                        if (auto) {
                            Auto.update({
                                WordStatus: false
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Words Status: ``FALSE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                WordStatus: false
                            }).then(() => {
                                message.channel.send("Successfully, set the Words Status: ``FALSE``");
                            })
                        }

                    }
                } else if (args[0].toLowerCase() == 'mentions') {
                    if (args[1].toLowerCase() == 'true') {
                        if (auto) {
                            Auto.update({
                                MentionStatus: true
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Mention Status: ``TRUE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                MentionStatus: true
                            }).then(() => {
                                message.channel.send("Successfully, set the Mention Status: ``TRUE``");
                            })
                        }

                    } else if (args[1].toLowerCase() == 'false') {
                        if (auto) {
                            Auto.update({
                                MentionStatus: false
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Mention Status: ``FALSE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                MentionStatus: false
                            }).then(() => {
                                message.channel.send("Successfully, set the Mention Status: ``FALSE``");
                            })
                        }

                    }
                } else if (args[0].toLowerCase() == 'invite') {
                    if (args[1].toLowerCase() == 'true') {
                        if (auto) {
                            Auto.update({
                                InviteStatus: true
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Invite Status: ``TRUE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                InviteStatus: true
                            }).then(() => {
                                message.channel.send("Successfully, set the Invite Status: ``TRUE``");
                            })
                        }

                    } else if (args[1].toLowerCase() == 'false') {
                        if (auto) {
                            Auto.update({
                                InviteStatus: false
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Invite Status: ``FALSE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                InviteStatus: false
                            }).then(() => {
                                message.channel.send("Successfully, set the Invite Status: ``FALSE``");
                            })
                        }

                    }
                } else if (args[0].toLowerCase() == 'member') {
                    if (args[1].toLowerCase() == 'true') {
                        if (auto) {
                            Auto.update({
                                MemberLogs: true
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Member Logs Status: ``TRUE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                MemberLogs: true
                            }).then(() => {
                                message.channel.send("Successfully, set the Member Logs Status: ``TRUE``");
                            })
                        }

                    } else if (args[1].toLowerCase() == 'false') {
                        if (auto) {
                            Auto.update({
                                MemberLogs: false
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Member Logs Status: ``FALSE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                MemberLogs: false
                            }).then(() => {
                                message.channel.send("Successfully, set the Member Logs Status: ``FALSE``");
                            })
                        }

                    }
                } else if (args[0].toLowerCase() == 'message') {
                    if (args[1].toLowerCase() == 'true') {
                        if (auto) {
                            Auto.update({
                                MessageLogs: true
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Message Logs Status: ``TRUE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                MessageLogs: true
                            }).then(() => {
                                message.channel.send("Successfully, set the Message Logs Status: ``TRUE``");
                            })
                        }

                    } else if (args[1].toLowerCase() == 'false') {
                        if (auto) {
                            Auto.update({
                                MessageLogs: false
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Message Logs Status: ``FALSE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                MessageLogs: false
                            }).then(() => {
                                message.channel.send("Successfully, set the Message Logs Status: ``FALSE``");
                            })
                        }

                    }
                } else if (args[0].toLowerCase() == 'channel') {
                    if (args[1].toLowerCase() == 'true') {
                        if (auto) {
                            Auto.update({
                                ChannelLogs: true
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Channel Logs Status: ``TRUE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                ChannelLogs: true
                            }).then(() => {
                                message.channel.send("Successfully, set the Channel Logs Status: ``TRUE``");
                            })
                        }

                    } else if (args[1].toLowerCase() == 'false') {
                        if (auto) {
                            Auto.update({
                                ChannelLogs: false
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Channel Logs Status: ``FALSE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                ChannelLogs: false
                            }).then(() => {
                                message.channel.send("Successfully, set the Channel Logs Status: ``FALSE``");
                            })
                        }

                    }
                } else if (args[0].toLowerCase() == 'role') {
                    if (args[1].toLowerCase() == 'true') {
                        if (auto) {
                            Auto.update({
                                RoleLogs: true
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Role Logs Status: ``TRUE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                RoleLogs: true
                            }).then(() => {
                                message.channel.send("Successfully, set the Role Logs Status: ``TRUE``");
                            })
                        }

                    } else if (args[1].toLowerCase() == 'false') {
                        if (auto) {
                            Auto.update({
                                RoleLogs: false
                            }, {
                                where: {
                                    guildId: message.guild.id,
                                    botId: bot.user.id
                                }
                            }).then(() => {
                                message.channel.send("Successfully, set the Role Logs Status: ``FALSE``");
                            })
                        } else {
                            Auto.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                RoleLogs: false
                            }).then(() => {
                                message.channel.send("Successfully, set the Role Logs Status: ``FALSE``");
                            })
                        }

                    }
                }

            });
    }
};