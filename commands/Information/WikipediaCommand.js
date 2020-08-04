const Discord = require("discord.js")
const fs = require('fs')
const Theme = require('../../Database/models/Theme')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
const wiki = require('wikipedia-js');
module.exports = class CountCommmand extends BaseCommand {
    constructor() {
        super('wikipedia', 'Information', ['wiki'], 'Gives information about a specific query from Wikipedia.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        let infoEmbed = new MessageEmbed()

        message.channel.startTyping()
        message.channel.send(infoEmbed).then(() => message.channel.stopTyping());
        wiki.searchArticle({
            query: args.join(" "),
            format: 'json'
        }, function (err, data) {
            if (err) {
                console.log("An error occurred[query=%s, error=%s]", query, err);
                return;
            }
            console.log(data);

        });

    }
}