const BaseCommand = require('../../utils/structures/BaseCommand')
const emoji = require('discord-emoji-convert');

module.exports = class EmojifyCommmand extends BaseCommand {
    constructor() {
        super('emojify', 'Fun', ['emoji'], 'Converts Text into Emojis.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        const convert = emoji.convert(args.join(" "));
        message.channel.send(convert);
    }
}