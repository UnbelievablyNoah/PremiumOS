const Discord = require("discord.js");
const Theme = require("../../Database/models/Theme");
const BaseCommand = require("../../utils/structures/BaseCommand");
const {
    MessageEmbed
} = require("discord.js");
const weather = require('weather-js')

module.exports = class WeatherCommmand extends BaseCommand {
    constructor() {
        super(
            "weather",
            "Information",
            ["w"],
            "Tells the weather of a specific location.",
            "[command | alias]",
            []
        );
    }

    async run(bot, message, args) {
        let theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id,
            },
        });

        const Location = args.join(" ");
        if (!Location) return message.channel.send('Provide a location.');
        weather.find({
            search: Location,
            degreeType: 'C'
        }, function (err, result) {
            if (err) message.channel.send(err);

            if (result === undefined || result.length == 0) return message.channel.send('Location is invalid.');
            const current = result[0].current;
            const location = result[0].location;

            const infoEmbed = new MessageEmbed()
                .setAuthor(`Weather Forecast: ${current.observationpoint}`)
                .setDescription(`**${current.skytext}**`)
                .setThumbnail(current.imageUrl)
                .addField('Timezone', `UTC${location.timezone}`, true)
                .addField('Degree Type', 'Celsius', true)
                .addField('Temperature', current.temperature, true)
                .addField('Wind', current.winddisplay, true)
                .addField('Feels Like', current.feelslike, true)
                .addField('Humidity', current.humidity, true)
                .setColor(theme.dataValues.embedTheme)
                .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp();
            return message.channel.send(infoEmbed);
        });


    }
};