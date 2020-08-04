const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')
module.exports = class RandomCommmand extends BaseCommand {
    constructor() {
        super('random', 'Fun', ['number'], 'Gives a Random Number.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        message.channel.send(`Number is **${Math.ceil(Math.random() * 10)}**`)
    }
}