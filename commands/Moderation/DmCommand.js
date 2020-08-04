const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class DmCommmand extends BaseCommand {
    constructor() {
        super('dm', 'Moderation', ['msg'], 'DMs a specified member with a message', '[command | alias] <@user> <message>', [])
    }

    async run(bot, message, args) {

        message.delete()

        const member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        const reason = args.slice(1).join(" ");
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send("You don't have permissions to use this command.");
        }

        if (!member) {
            return message.channel.send("You didn't specified the user who you want message.");
        }

        if (!reason) {
            return message.channel.send("You didn't specified the message.");
        }

        member.send(reason).then(() => message.channel.send('Successfully, sent a DM!').then(m => m.delete()));


    }
}