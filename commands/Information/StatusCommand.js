const Theme = require('../../Database/models/Theme')
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
module.exports = class StatusCommmand extends BaseCommand {
    constructor() {
        super('status', 'Information', ['activity'], 'Information about the status of a specified user.', '[command | alias]', [])
    }

    async run(bot, message, args) {
        const theme = await Theme.findOne({
            where: {
                guildId: message.guild.id,
                botId: bot.user.id
            }
        })
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!user.presence.activities.length) {
            const sembed = new MessageEmbed()
                .setAuthor(user.user.tag, user.user.displayAvatarURL({
                    dynamic: true
                }))
                .setColor(theme.dataValues.embedTheme)
                .setThumbnail(user.user.displayAvatarURL())
                .setTitle('No Status')
                .setDescription("This user doesn't have any custom status")
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            message.channel.send(sembed)
            return undefined;
        }

        user.presence.activities.forEach((activity) => {
            if (activity.type === 'CUSTOM_STATUS') {
                const embed = new MessageEmbed()
                    .setAuthor(user.user.tag, user.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setTitle('Status')
                    .setDescription(`**Custom status** -\n${activity.emoji || "No Emoji"} | ${activity.state}`)
                    .setThumbnail(user.user.displayAvatarURL())
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setColor(theme.dataValues.embedTheme)
                    .setTimestamp()
                message.channel.send(embed)
            } else if (activity.type === 'PLAYING') {
                const name1 = activity.name
                const details1 = activity.details
                const state1 = activity.state
                const sembed = new MessageEmbed()
                    .setAuthor(`${user.user.tag}'s Activity`, user.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setColor(theme.dataValues.embedTheme)
                    .setThumbnail(user.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .addField("Type", "Playing", true)
                    .addField("App", `${name1}`, true)
                    .addField("Details", `${details1 || "No Details"}`, true)
                    .addField("Working on", `${state1 || "No Details"}`, true)
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                message.channel.send(sembed);
            } else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {

                const trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
                const trackURL = `https://open.spotify.com/track/${activity.syncID}`;

                const trackName = activity.details;
                let trackAuthor = activity.state;
                const trackAlbum = activity.assets.largeText;

                trackAuthor = trackAuthor.replace(/;/g, ",")

                const infoEmbed = new MessageEmbed()
                    .setAuthor('Spotify Track Information', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png')
                    .setColor("#18D860")
                    .setDescription(`[Listen to Track](${trackURL})`)
                    .setThumbnail(trackIMG)
                    .addField('Song Name', trackName, true)
                    .addField('Album', trackAlbum, true)
                    .addField('Author', trackAuthor, false)
                    .setFooter(user.user.tag, user.user.displayAvatarURL({
                        dynamic: true
                    }))
                message.channel.send(infoEmbed);
            }
        })
    }
}