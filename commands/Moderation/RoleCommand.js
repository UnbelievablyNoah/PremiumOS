const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class RoleCommmand extends BaseCommand {
    constructor() {
        super('role', 'Moderation', ['rank', 'promote'], 'Roles a specified user to a specified role.', '[command | alias] <@Member> <Role>', [])
    }

    async run(bot, message, args) {

        if (!message.member.hasPermission("ADMINISTRATOR")) return;
        const member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        const role = message.guild.roles.cache.find(r => r.name === args.slice(1).join(" "));

        if (!member) return message.channel.send('No member found to role.')
        if (!role) return message.channel.send('No role found to role.')

        if (member.roles.cache.has(role.id)) {
            return message.channel.send('This Member already has the specified role.');
        } else {
            member.roles.add(role.id).then(() => message.channel.send(`Added **${role.name}** to ${member}!`))
        }

    }
}