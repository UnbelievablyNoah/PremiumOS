const {
    MessageEmbed
} = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')
const ms = require('ms')
const Theme = require('../../Database/models/Theme')
module.exports = class UnMuteCommmand extends BaseCommand {
    constructor() {
        super('unmute', 'Moderation', ['unshutup'], 'Unmutes a user.', '[command | alias] <@Member>', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send("You don't have permissions to use this command.");
        const member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

        if (!member) return message.channel.send('Specify a Member to mute.');

        let role = message.guild.roles.cache.find(r => r.name === 'Muted');
        if (!role) return message.channel.send("Muted Role isn't found.");

        if (member.roles.cache.has(role.id)) {
            member.roles.remove(role.id);
            message.channel.send(`<@${member.user.id}> has been unmuted!`)
            member.send(`You've been unmuted in ${message.guild.name}!`)

        } else {
            message.channel.send("This member isn't Muted.")
        }




    }
}