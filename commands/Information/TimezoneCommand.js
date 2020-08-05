const Discord = require("discord.js");
const Theme = require("../../Database/models/Theme");
const BaseCommand = require("../../utils/structures/BaseCommand");
const {
    MessageEmbed
} = require("discord.js");
const Bot = require("../../Database/models/Bot");
const moment = require('moment-timezone');

module.exports = class TimezoneCommmand extends BaseCommand {
    constructor() {
        super(
            "timezone",
            "Information",
            ["w"],
            "Tells the timezone of a specific Country.",
            "[command | alias]",
            []
        );
    }

    async run(bot, message, args) {
        const date = new Date();
        const toChange = new moment(date);
        if (!args.join(" ")) return message.channel.send('Provide a Country.');

        const changed = await toChange.tz(args.join(" ")).format('h:m:sa z')
        console.log(changed);
        console.log(toChange);
        if (changed == toChange) {
            message.channel.send(`Timezone not found!`);
        } else {
            message.channel.send(`The time in ${args.join(" ")} is **${changed}**`);
        }

    }
};