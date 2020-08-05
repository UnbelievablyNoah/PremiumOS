const fs = require("fs");
const BaseEvent = require("../../utils/structures/BaseEvent");
const db = require("../../Database/db");
const Bot = require("../../Database/models/Bot");
const Theme = require("../../Database/models/Theme");
const Support = require("../../Database/models/Support");
const Channel = require("../../Database/models/Channel");
const Reaction = require("../../Database/models/Reaction");
const Warning = require("../../Database/models/Warning");
const Auto = require("../../Database/models/Auto");
const Guild = require('../../Database/models/Guild');
const AFK = require('../../Database/models/AFK');
module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(bot) {
    db.authenticate()
      .then(() => {
        console.log("Logged in to DB.");
        Bot.init(db);
        Bot.sync();
        Theme.init(db);
        Theme.sync();
        Support.init(db);
        Support.sync();
        Channel.init(db);
        Channel.sync();
        Reaction.init(db);
        Reaction.sync();
        Warning.init(db);
        Warning.sync();
        Auto.init(db);
        Auto.sync();
        Guild.init(db);
        Guild.sync();
        AFK.init(db);
        AFK.sync();
      })
      .then(() => {
        console.log(bot.user.tag + " has logged in.");
        (async () => {
          const botdata = await Bot.findOne({
            where: {
              botId: bot.user.id,
            },
          });
          if (botdata) {
            setInterval(async () => {
              let statusList = ["BotOS", botdata.dataValues.botStatus];
              var status =
                statusList[Math.floor(Math.random() * statusList.length)];
              bot.user.setActivity(status, {
                type: botdata.dataValues.botActivity,
              });
            }, 10000);
          } else {
            setInterval(async () => {
              let statusList = ["BotS", "with Aquirty"];
              var status =
                statusList[Math.floor(Math.random() * statusList.length)];
              bot.user.setActivity(status, {
                type: "PLAYING",
              });
            }, 10000);
          }
        })();
      });
  }
};