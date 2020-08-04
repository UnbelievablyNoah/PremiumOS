const Discord = require("discord.js")
const fs = require('fs')
const Theme = require('../../Database/models/Theme')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
module.exports = class WhoisCommmand extends BaseCommand {
    constructor() {
        super('whois', 'Information', ['userinfo'], 'Information about the User.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
        const member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (member) {
            let infoEmbed = new MessageEmbed()
                .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
                .setThumbnail(member.user.displayAvatarURL())
                .addField(`Display Name`, member.displayName, true)
                .addField("Name", member.user.username, true)
                .addField("ID", member.id, true)
                .addField('Created On', member.user.createdAt.toUTCString().substr(0, 16), true)
                .addField("Joined At", member.joinedAt.toUTCString().substr(0, 16), true)
                .addField('Kickable', member.kickable, true)
                .addField('Voice Channel', member.voice.channel ? member.voice.channel.name : 'None', true)
                .addField('Presence', member.presence.status, true)
                .setDescription(`${member.roles.cache.map(role => role.toString()).join(' ')}`)
                .setColor(theme.dataValues.embedTheme)
                .setFooter('User Information', message.author.displayAvatarURL())
                .setTimestamp()

            message.channel.send(infoEmbed)
        } else {
            let infoEmbed = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .addField(`Display Name`, message.member.displayName, true)
                .addField("Name", message.author.username, true)
                .addField("ID", message.author.id, true)
                .addField('Created On', message.author.createdAt.toUTCString().substr(0, 16), true)
                .addField("Joined At", message.member.joinedAt.toUTCString().substr(0, 16), true)
                .addField('Kickable', message.member.kickable, true)
                .addField('Voice Channel', message.member.voice.channel ? message.member.voice.channel.name : 'None', true)
                .addField('Presence', message.member.presence.status, true)
                .setDescription(`${message.member.roles.cache.map(role => role.toString()).join(' ')}`)
                .setColor(theme.dataValues.embedTheme)
                .setFooter('User Information')
                .setTimestamp()
            message.channel.send(infoEmbed)
        }




    }
}