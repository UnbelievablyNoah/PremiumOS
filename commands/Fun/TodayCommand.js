const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')
module.exports = class TodayCommmand extends BaseCommand {
    constructor() {
        super('today', 'Fun', ['day', 'date'], "Tell today's date and date", '[command | alias]', [])
    }

    async run(bot, message, args) {
        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
        message.channel.send(`Today is ${message.createdAt.toUTCString().substr(0, 16)}`)

    }
}