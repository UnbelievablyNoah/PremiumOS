const Discord = require("discord.js")
const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class UploadCommmand extends BaseCommand {
    constructor() {
        super('upload', 'Extras', ['attach'], 'Attachs an Image.', '[command | alias] <URL>', [])
    }

    async run(bot, message, args) {

        if (!message.member.hasPermission("ADMINISTRATOR")) return;
        var Attachment = (message.attachments).array();
        if (args[0]) {
            if (args[0].startsWith("https")) {
                message.channel.send({
                    files: [args[0]]
                });
            }
        } else if (Attachment) {
            message.channel.send({
                files: [Attachment[0].url]
            });
        } else {
            message.channel.send("No URL nor Attachement is provided.")
        }



    }
}