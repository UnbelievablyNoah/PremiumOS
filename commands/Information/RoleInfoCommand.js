const Discord = require("discord.js")
const Theme = require('../../Database/models/Theme')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
module.exports = class RoleInfoCommmand extends BaseCommand {
    constructor() {
        super('roleinfo', 'Information', ['rankinfo'], 'Information about the specified role.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        let name = args.join(" ")
        if (!name) return message.channel.send("Specify a Role Name/ID.");
        let role = message.guild.roles.cache.find(r => r.name === name || r.id == name);
        if (!role) return message.channel.send('No role found!');

        let infoEmbed = new MessageEmbed()
            .setAuthor(role.name)
            .addField('ID', role.id, true)
            .addField('Color', role.color, true)
            .addField('Hoist', role.hoist, true)
            .addField('Mentionable', role.mentionable, true)
            .addField('Mention', `<@&${role.id}>`, true)
            .addField('Role Position', role.rawPosition, true)
            .setFooter('Role Information', message.author.displayAvatarURL())
            .setColor(role.color)
            .setTimestamp();
        return message.channel.send(infoEmbed);



    }
}