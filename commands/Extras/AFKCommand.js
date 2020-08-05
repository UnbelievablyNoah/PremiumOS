const {
    MessageEmbed
} = require("discord.js");
const Theme = require('../../Database/models/Theme')
const AFK = require('../../Database/models/AFK');
const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class AFKCommmand extends BaseCommand {
    constructor() {
        super('afk', 'Extras', ['away', 'awayfromkeyboard'], '', '[command | alias]', [])
    }

    async run(bot, message, args) {

        const afk = await AFK.findOne({
            where: {
                userId: message.author.id
            }
        });

        if (!afk) {
            AFK.create({
                userId: message.author.id,
                status: true
            }).then(() => {
                message.reply(`You're now **AFK**!`);
            });
            return;
        }

        if (afk.dataValues.status == true) {
            AFK.update({
                status: false
            }, {
                where: {
                    userId: message.author.id
                }
            }).then(() => {
                message.reply(`You're now not **AFK**!`);
            });
            return;
        } else {
            AFK.update({
                status: true
            }, {
                where: {
                    userId: message.author.id
                }
            }).then(() => {
                message.reply(`You're now **AFK**!`);
            });
            return;
        }



    }
}