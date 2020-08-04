const Discord = require("discord.js")
const fs = require('fs')
const fetch = require('node-fetch')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
const Theme = require('../../Database/models/Theme')

module.exports = class AvatarCommmand extends BaseCommand {
    constructor() {
        super('avatar', 'Images', ['pfp'], 'Shows Avatar of the Specified User', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })

        const user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (user) {
            const avatarEmbed = new MessageEmbed()
                .setAuthor(user.user.tag, user.user.avatarURL())
                .setImage(user.user.avatarURL())
                .setTimestamp()
            return message.channel.send(avatarEmbed);
        } else {
            const avatarEmbed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setImage(message.author.displayAvatarURL())
                .setTimestamp()
            return message.channel.send(avatarEmbed);
        }

    }
}