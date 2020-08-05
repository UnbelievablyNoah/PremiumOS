const BaseCommand = require("../../utils/structures/BaseCommand");
const {
    MessageEmbed,
    MessageCollector
} = require("discord.js");
const list = [];
module.exports = class PollCommmand extends BaseCommand {
    constructor() {
        super(
            "poll",
            "Extras",
            ["vote"],
            "Make your own Voting Polls.",
            "[command | alias]",
            []
        );
    }

    async run(bot, message, args) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
        const channel = message.mentions.channels.first()
        const pollMessage = args.slice(1).join(" ");
        if (!channel) return message.channel.send('No channel found!');

        if (!pollMessage) return message.channel.send('Usage: poll #channel [Message]');
        const msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;
        const collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message), {
            max: 5,
            time: 60000,
            errors: ['time']
        });
        message.channel.send('Provide the list and emojis. [List, Emoji Name]');

        collector.on('collect', msg => {
            if (msg.content.toLowerCase() == 'done') {
                collector.stop('Done with the collection.');
                return;
            }
            const [listName, emojiName] = msg.content.split(/,\s+/);
            if (!emojiName && !roleName) return message.channel.send("Usage: [List], [Emoji Name]");
            const emoji = message.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
            if (!emoji) return message.channel.send("No Emoji found!");
            const newData = {
                emoji: emoji,
                name: listName,
                id: emoji.id
            }
            console.log(emoji);

            list.push(newData);
        });
        collector.on('end', async (collected, reason) => {
            const listed = list.map((e) => "``" + e.name + "``" + ` : ${e.emoji}`).join('\n');
            channel.send(`${pollMessage}\n${listed}`).then(msg => {
                list.forEach(l => {
                    msg.react(l.id);
                });
                message.channel.send('Poll created!');
            })
        });
    }
};