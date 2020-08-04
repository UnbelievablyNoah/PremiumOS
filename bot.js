require('dotenv').config();
const {
  Client,
  Collection
} = require("discord.js");
const {
  registerCommands,
  registerEvents
} = require("./utils/registry");
const fs = require("fs");
const bot = new Client({
  partials: ["MESSAGE", "REACTION"],
});

(async () => {
  bot.commands = new Collection();
  bot.cachedMessageReactions = new Map();
  bot.events = new Map();
  await registerCommands(bot, "../commands");
  await registerEvents(bot, "../events");
  await bot.login(process.env.Token);
})();