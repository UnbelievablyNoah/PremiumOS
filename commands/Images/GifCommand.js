const Discord = require("discord.js")
const fs = require('fs')
const fetch = require('node-fetch')
const GphApiClient = require('giphy-js-sdk-core');
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')
const Theme = require('../../Database/models/Theme')

module.exports = class GifCommmand extends BaseCommand {
    constructor() {
        super('gif', 'Images', ['giphy', 'gifs'], 'Shows Random/Trend Gifs', '[command | alias]', [])
    }

    async run(bot, message, args) {

        const giphy = GphApiClient("MwJXuRHCqNVuJqkBOMG8I3vaNnCPerYx")

        if (args[0] === 'trending') {
            giphy.trending("gifs")
                .then((response) => {
                    message.channel.send(response.data[Math.floor(Math.random() * 31)].url)
                })

        } else {
            giphy.random('gifs')
                .then((res) => {
                    message.channel.send(res.data.url);
                });
        };
    }
}