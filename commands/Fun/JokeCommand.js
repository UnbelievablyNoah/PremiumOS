const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')
const got = require('got')
module.exports = class JokeCommmand extends BaseCommand {
    constructor() {
        super('joke', 'Fun', ['jokes'], 'Tells a Random Joke.', '[command | alias]', [])
    }

    async run(bot, message, args) {

        got('https://www.reddit.com/r/jokes/random/.json').then(response => {
            let content = JSON.parse(response.body);
            var title = content[0].data.children[0].data.title;
            var joke = content[0].data.children[0].data.selftext;
            message.channel.send(`**${title}**\n${joke}`);
        }).catch(console.error);








    }
}