const fetch = require('node-fetch')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')

module.exports = class ColorCommmand extends BaseCommand {
    constructor() {
        super('color', 'Fun', ['randomcolor', 'colour'], 'Gives a random color.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        const hex = Math.random().toString(16).slice(2, 8).toUpperCase().slice(-6)

        const digit = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        const UNIT = 16;

        const RED = parseInt(digit[1], UNIT);
        const GREEN = parseInt(digit[2], UNIT);
        const BLUE = parseInt(digit[3], UNIT);

        const color = !args[0] ? hex : args[0]
        let image = color.replace("#", "");
        const embed = new MessageEmbed()
            .setColor(hex)
            .setDescription(`Random HEX Code: #${hex} | RGB(${RED}, ${GREEN}, ${BLUE})`)
            .setTitle('#' + hex)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
            .setThumbnail(`http://www.singlecolorimage.com/get/${image}/200x200`)

        message.channel.send(embed)


    }
}