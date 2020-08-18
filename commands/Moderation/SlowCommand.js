const Discord = require("discord.js");
const Theme = require("../../Database/models/Theme");
const BaseCommand = require("../../utils/structures/BaseCommand");
const Channel = require("../../Database/models/Channel");
const {
    MessageEmbed
} = require("discord.js");

module.exports = class SlowmodeCommmand extends BaseCommand {
    constructor() {
        super(
            "slowmode",
            "Moderation",
            ["cooldown"],
            "Activates slow mode for specific or all channels",
            "[command | alias] <#Member> <time>",
            []
        );
    }

    async run(bot, message, args) {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) {
            return message.channel.send(
                "You don't have permissions to use this command."
            );
        }
        if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
            return message.channel.send("I don't have permission, ``MANAGE_CHANNELS``.");
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel) {
            if (!args[0] === 'all') return message.channel.send('Usage: slowdown [#channel/all] [time]');
            if (!args[1]) return message.channel.send('Usage: slowdown [#channel/all] [time]');
            const channels = message.guild.channels.cache.filter((c) => c.type === "text");
            console.log(channels);
            channels.forEach(ch => {
                ch.setRateLimitPerUser(args[1], 'Slowmode').then(() => {
                    ch.send(`Slow mode has been activated with a cooldown of ${args[1]} seconds.`)
                }).catch((err) => {
                    message.channel.send(`Unable to activate slow mode due to error: ${err}`);
                });
            });
            return;
        };
        const time = args[1];
        if (!time) return message.channel.send('Usage: slowdown [#channel/all] [time]');
        channel.setRateLimitPerUser(args[1], 'Slowmode').then(() => {
            channel.send(`Slow mode has been activated with a cooldown of ${args[1]} seconds.`)
        }).catch((err) => {
            message.channel.send(`Unable to activate slow mode due to error: ${err}`);
        });

    }
};