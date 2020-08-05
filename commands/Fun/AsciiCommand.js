const BaseCommand = require('../../utils/structures/BaseCommand');
const figlet = require('figlet');
module.exports = class AsciiCommmand extends BaseCommand {
    constructor() {
        super('ascii', 'Fun', ['asciitext'], 'Converts text to ascii', '[command | alias]', [])
    }

    async run(bot, message, args) {
        if (!args.join(" ")) return message.channel.send('Please provide some text');

        const msg = args.join(" ");

        figlet.text(msg, function (err, data) {
            if (err) {
                console.log('Something went wrong');
                console.dir(err);
            }
            if (data.length > 2000) return message.channel.send('Please provide text shorter than 2000 characters')

            message.channel.send('```' + data + '```')
        })


    }
}