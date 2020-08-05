const Discord = require("discord.js")
const fs = require('fs')
const Theme = require('../../Database/models/Theme')
const request = require('node-superfetch');
const BaseCommand = require('../../utils/structures/BaseCommand')
const {
    MessageEmbed
} = require('discord.js')

module.exports = class AnimeCommmand extends BaseCommand {
    constructor() {
        super('emojify', 'Fun', ['emoji'], '', '[command | alias]', [])
    }

    async run(bot, message, args) {

    }
}