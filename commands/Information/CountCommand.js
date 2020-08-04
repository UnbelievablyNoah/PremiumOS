const Discord = require("discord.js")
const fs = require('fs')
const Theme = require('../../Database/models/Theme')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
module.exports = class CountCommmand extends BaseCommand {
    constructor() {
        super('membercount', 'Information', ['count'], 'Information about how many members in the guild.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        let infoEmbed = new MessageEmbed()
            .addField('Total Members', message.guild.memberCount, true)
            .addField('Total Humans', message.guild.members.cache.filter(member => !member.user.bot).size, true)
            .addField('Total Bots', message.guild.members.cache.filter(member => member.user.bot).size, true)
            .setTimestamp()
            .setColor(theme.dataValues.embedTheme)

        message.channel.send(infoEmbed)



    }
}