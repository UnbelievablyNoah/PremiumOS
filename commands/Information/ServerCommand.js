const Discord = require("discord.js")
const fs = require('fs')
const Theme = require('../../Database/models/Theme')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
module.exports = class ServerCommmand extends BaseCommand {
    constructor() {
        super('serverinfo', 'Information', ['guildinfo'], 'Information about the Guild/Server.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        let totalSeconds = (bot.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };

        let infoEmbed = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`${message.guild.roles.cache.map(role => role.toString()).join(', ')}`)
            .addField('Owner', message.guild.owner.user.tag, true)
            .addField('Region', message.guild.region, true)
            .addField('Total Members', message.guild.memberCount, true)
            .addField('Total Humans', message.guild.members.cache.filter(member => !member.user.bot).size, true)
            .addField('Total Bots', message.guild.members.cache.filter(member => member.user.bot).size, true)
            .addField('Category/ies', message.guild.channels.cache.filter(c => c.type === 'category').size, true)
            .addField('Text Channel/s', message.guild.channels.cache.size, true)
            .addField('Voice Channel/s', message.guild.channels.cache.filter(c => c.type === 'voice').size, true)
            .setFooter(`ID: ${message.guild.id} - Created On: ${message.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(bot.user.createdAt)})`, message.author.displayAvatarURL())
            .setThumbnail(message.guild.iconURL)
            .setTimestamp()
            .setColor(theme.dataValues.embedTheme)

        message.channel.send(infoEmbed)



    }
}