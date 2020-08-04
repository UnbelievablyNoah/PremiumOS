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
        const botdata = await Bot.findOne({
            where: {
                botId: bot.user.id,
                guildId: message.guild.id,
            },
        });
        if (botdata) {
            const prefix = botdata.dataValues.botPrefix;
            const [cmdName, ...cmdArgs] = message.content
                .slice(prefix.length)
                .trim()
                .split(/\s+/);
            if (cmdName.toLowerCase() == 'timezone') {
                const date = new Date();
                console.log(date)
                const toChange = new moment(date);
                console.log(toChange)

                if (!args.join(" ")) return message.channel.send('Provide a Country.');

                const changed = await toChange.tz(args.join(" ")).format('h:m:sa z');
                message.channel.send(`The time in ${args.join(" ")} is **${changed}**`);

            } else if (cmdName.toLowerCase() == 'convert') {
                const date = new Date();
                const from = args[0];
                const to = args[0];

            }

        }

    }
};