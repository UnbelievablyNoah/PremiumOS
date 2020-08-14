const Guild = require("../../Database/models/Guild");
const BaseCommand = require("../../utils/structures/BaseCommand");
const {
  MessageEmbed,
  MessageCollector
} = require("discord.js");
const Support = require("../../Database/models/Support");
const Channel = require("../../Database/models/Channel");
const Theme = require("../../Database/models/Theme");
module.exports = class SetupCommand extends BaseCommand {
  constructor() {
    super(
      "setup",
      "Setup",
      ["settings"],
      "Setup the bot as per your needs",
      "[command | alias] <args>"
    );
  }

  async run(bot, message, args) {
    const gData = await Guild.findOne({
      where: {
        botId: bot.user.id,
        guildId: message.guild.id,
      },
    });
    const theme = await Theme.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id,
      },
    });
    const channel = await Channel.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id,
      },
    });

    const ticket = await Support.findOne({
      where: {
        guildId: message.guild.id,
        botId: bot.user.id,
      },
    });

    fetch(
        `https://bots.aquirty.com/api/ownership-check/${message.author.id}/${bot.user.id}`
      )
      .then((res) => res.json())
      .then((data) => {

        if (data.valid !== "true") return message.channel.send("You're aren't allowed to use this command.");
        if (gData) {
          const filter = (m) => m.author.id === message.author.id;

          if (args[0]) {
            if (args[0].toLowerCase() === "theme") {
              const awaitEmbed = new MessageEmbed()
                .setAuthor("Theme-Settings", bot.user.displayAvatarURL())
                .setTitle(
                  "To setup the following, read the Instructions Below."
                )
                .setDescription(
                  "To setup **Welcome banner** - Use ``Welcome`` below\nTo setup **Embed Hex Colour** - Type ``Embed`` below"
                )
                .setColor(theme.dataValues.embedTheme)
                .setFooter(
                  "Follow the instructions below in order to setup Theme."
                )
                .setTimestamp();
              message.channel.send(awaitEmbed).then((msg) =>
                msg.delete({
                  timeout: 60000,
                  reason: "It had to be done.",
                })
              );

              message.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 60000,
                  errors: ["time"],
                })
                .then((collected) => {
                  if (collected.first().content.toLowerCase() == "cancel") {
                    message.channel.send("Cancelled the Prompt!");
                  } else if (
                    collected.first().content.toLowerCase() === "embed"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the Hex Colour below in order to change the Embed colour. E.g. #FFFF",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else if (
                            collected.first().content.startsWith("#")
                          ) {
                            const hexcode = collected.first().content;
                            if (!theme) {
                              Theme.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                embedTheme: hexcode,
                                welcome: "-",
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Embed Colour to " +
                                    hexcode +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return message.channel.send(doneEmbed);
                              });
                            } else {
                              Theme.update({
                                embedTheme: hexcode,
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Embed Colour to " +
                                    hexcode +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return message.channel
                                  .send(doneEmbed)
                                  .then((message) =>
                                    message.delete({
                                      timeout: 10000,
                                      reason: "It had to be done.",
                                    })
                                  );
                              });
                            }
                          } else {
                            message.channel.send("Invalid Hex code.");
                          }
                        });
                    });
                  } else if (
                    collected.first().content.toLowerCase() === "welcome"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the URL below in order to change the Welcome Banner.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else if (
                            collected.first().content.startsWith("https")
                          ) {
                            const image = collected.first().content;
                            if (!theme) {
                              Theme.create({
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                embedTheme: "-",
                                welcome: image,
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Welcome Banner!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Theme.update({
                                welcome: image,
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Welcome Banner!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          } else {
                            message.channel.send("Invalid Image.");
                          }
                        });
                    });
                  }
                })
                .catch((collected) => {
                  message.channel.send("Time is over!");
                });
            }
            if (args[0].toLowerCase() === "support") {
              const awaitEmbed = new MessageEmbed()
                .setAuthor("Support-Settings", bot.user.displayAvatarURL())
                .setTitle(
                  "To setup the following, read the Instructions Below."
                )
                .setDescription(
                  "To setup **Category** - Type ``Category`` below.\nTo setup **Message** - Type ``Message`` below.\nTo setup **Support Type** - Type ``Type`` below.\nTo add **Roles** to Support Tickets - Type ``Add`` below.\nTo remove **Roles** from from Support Tickets - Type ``Remove`` below."
                )
                .setColor(theme.dataValues.embedTheme)
                .setFooter(
                  "Follow the instructions below in order to setup Support."
                )
                .setTimestamp();
              message.channel.send(awaitEmbed).then((msg) =>
                msg.delete({
                  timeout: 60000,
                  reason: "It had to be done.",
                })
              );
              message.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 60000,
                  errors: ["time"],
                })
                .then((collected) => {
                  if (collected.first().content.toLowerCase() == "cancel") {
                    message.channel.send("Cancelled the Prompt!");
                  } else if (
                    collected.first().content.toLowerCase() === "message"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the Message below in order to change the Support Message.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else {
                            if (ticket) {
                              Support.update({
                                message: collected.first().content,
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Support Message!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Support.create({
                                status: "true",
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                message: collected.first().content,
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Support Message!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          }
                        });
                    });
                  } else if (
                    collected.first().content.toLowerCase() === "add"
                  ) {
                    const addEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide all role names that you want to add in the Support Ticket.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(addEmbed).then((msg) => {
                      const msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      const collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message), {
                        max: 5,
                        time: 60000,
                        errors: ['time']
                      });
                      collector.on('collect', msg => {

                        if (msg.content.toLowerCase() == 'done') {
                          collector.stop('Done with the collection.');
                          return;
                        }
                        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() == msg.content.toLowerCase());
                        if (!role) return message.channel.send('No role found!');;
                        (async () => {
                          const found = await Support.findOne({
                            where: {
                              guildId: message.guild.id,
                              botId: bot.user.id,
                            },
                          });
                          if (found) {
                            if (found.dataValues.roles !== null) {
                              const newData = JSON.parse(JSON.stringify(found.dataValues.roles));
                              console.log(newData);
                              newData.push(role.id);
                              console.log(newData)
                              Support.update({
                                roles: newData
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id,
                                }
                              }).then(() => {
                                message.channel.send('Role saved.')
                              })
                            } else {
                              const newData = [
                                role.id
                              ];
                              Support.update({
                                roles: newData,
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id
                                }
                              }).then(() => {
                                message.channel.send('Role saved.')
                              })
                            }
                          } else {
                            const newData = [
                              role.id
                            ];
                            Support.create({
                              roles: newData,
                              guildId: message.guild.id,
                              botId: bot.user.id
                            }).then(() => {
                              message.channel.send('Role saved.')
                            })
                          }
                        })();
                      });
                      collector.on('end', async (collected, reason) => {
                        message.channel.send('All Roles has been saved.')
                      });
                    });
                  } else if (
                    collected.first().content.toLowerCase() === "remove"
                  ) {
                    (async () => {
                      const found = await Support.findOne({
                        where: {
                          guildId: message.guild.id,
                          botId: bot.user.id,
                        },
                      });
                      if (found) {
                        if (found.dataValues.roles !== null) {
                          const roles = JSON.parse(JSON.stringify(found.dataValues.roles));
                          if (!roles.length > 0) return message.channel.send('No roles found to remove.');
                          const map = roles.map((r) => `<@&${r}>` + " : ``" + r + "``").join(', ');
                          const removeEmbed = new MessageEmbed()
                            .setAuthor(
                              "Provide role id that you want to remove from the Support Ticket.",
                              bot.user.displayAvatarURL()
                            )
                            .setDescription(map)
                            .setColor(theme.dataValues.embedTheme);
                          message.channel.send(removeEmbed).then((msg) => {
                            msg.delete({
                              timeout: 60000,
                              reason: "It had to be done.",
                            });
                            message.channel
                              .awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ["time"],
                              })
                              .then((collected) => {
                                if (
                                  collected.first().content.toLowerCase() ==
                                  "cancel"
                                ) {
                                  message.channel.send("Cancelled the Prompt!");
                                } else {
                                  const id = collected.first().content;
                                  if (roles.find(r => r === id)) {
                                    const removeData = roles
                                      .map(function (item) {
                                        return item;
                                      })
                                      .indexOf(id);
                                    roles.splice(removeData, 1);
                                    Support.update({
                                      roles: roles
                                    }, {
                                      where: {
                                        guildId: message.guild.id,
                                        botId: bot.user.id,
                                      }
                                    }).then(() => {
                                      message.channel.send('Successfully, removed the role id: ' +
                                        "``" + id + "``!");
                                    })

                                  } else {
                                    message.channel.send('Invalid role id.');
                                  }
                                }
                              });
                          });
                        } else {
                          message.channel.send('No roles found to remove.');
                        }
                      } else {
                        message.channel.send('No roles found to remove.');
                      }
                    })();
                  } else if (
                    collected.first().content.toLowerCase() === "category"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the Category Name below in order to change the Support Category.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else {
                            const category = message.guild.channels.cache.find(
                              (c) =>
                              c.name.toLowerCase() == collected.first().content.toLowerCase() &&
                              c.type == "category"
                            );
                            if (!category)
                              return message.channel.send(
                                "No Category found."
                              );
                            if (ticket) {
                              Support.update({
                                category: category.name,
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Category to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Support.create({
                                status: "true",
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                category: category.name,
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Category to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          }
                        });
                    });
                  } else if (
                    collected.first().content.toLowerCase() === "type"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Type below the following:\nCommand\nReaction",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else if (
                            collected.first().content.toLowerCase() ==
                            "command"
                          ) {
                            if (ticket) {
                              Support.update({
                                supportType: "command",
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Support Type to Command!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Support.create({
                                status: "true",
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                supportType: "command",
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Support Type to Command!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          } else if (
                            collected.first().content.toLowerCase() ==
                            "reaction"
                          ) {
                            if (ticket) {
                              Support.update({
                                supportType: "reaction",
                              }, {
                                where: {
                                  guildId: message.guild.id,
                                  botId: bot.user.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Support Type to Reaction!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Support.create({
                                status: "true",
                                guildId: message.guild.id,
                                botId: bot.user.id,
                                supportType: "reaction",
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Support Type to Reaction!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          }
                        });
                    });
                  } else {
                    message.channel.send(awaitEmbed);
                  }
                });
            } else if (args[0].toLowerCase() === "channel") {
              const awaitEmbed = new MessageEmbed()
                .setAuthor("Channel-Settings", bot.user.displayAvatarURL())
                .setTitle(
                  "To setup the following, read the Instructions Below."
                )
                .setDescription(
                  "To setup **Suggestion Channel** - Type ``Suggestion`` below\nTo setup **Logs Channel** - Type ``Logs`` below\nTo setup **Welcome Channel** - Type ``Welcome`` below.\nTo setup **Mod-Logs Channel** - Type ``Mod`` below."
                )
                .setColor(theme.dataValues.embedTheme)
                .setFooter(
                  "Follow the instructions below in order to setup Support."
                )
                .setTimestamp();
              message.channel.send(awaitEmbed).then((msg) =>
                msg.delete({
                  timeout: 60000,
                  reason: "It had to be done.",
                })
              );
              message.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 60000,
                  errors: ["time"],
                })
                .then((collected) => {
                  if (collected.first().content.toLowerCase() == "cancel") {
                    message.channel.send("Cancelled the Prompt!");
                  } else if (
                    collected.first().content.toLowerCase() == "suggestion"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the Channel Name below in order to change the Suggestion Channel.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else {
                            const category = message.guild.channels.cache.find(
                              (c) => c.name == collected.first().content
                            );
                            if (!category)
                              return message.channel.send(
                                "No Channel found."
                              );
                            if (channel) {
                              Channel.update({
                                ideaChannel: category.name,
                              }, {
                                where: {
                                  botId: bot.user.id,
                                  guildId: message.guild.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Suggestion Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Channel.create({
                                botId: bot.user.id,
                                guildId: message.guild.id,
                                ideaChannel: category.name,
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Suggestion Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          }
                        });
                    });
                  } else if (
                    collected.first().content.toLowerCase() == "welcome"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the Channel Name below in order to change the Welcome Channel.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else {
                            const category = message.guild.channels.cache.find(
                              (c) => c.name.toLowerCase() == collected.first().content.toLowerCase()
                            );
                            if (!category)
                              return message.channel.send(
                                "No Channel found."
                              );
                            if (channel) {
                              Channel.update({
                                welcomeChannel: category.name,
                              }, {
                                where: {
                                  botId: bot.user.id,
                                  guildId: message.guild.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Welcome Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Channel.create({
                                botId: bot.user.id,
                                guildId: message.guild.id,
                                welcomeChannel: category.name,
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Welcome Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          }
                        });
                    });
                  } else if (
                    collected.first().content.toLowerCase() == "mod"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the Channel Name below in order to change the Mod-Logs Channel.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else {
                            const category = message.guild.channels.cache.find(
                              (c) => c.name.toLowerCase() == collected.first().content.toLowerCase()
                            );
                            if (!category)
                              return message.channel.send(
                                "No Channel found."
                              );
                            if (channel) {
                              Channel.update({
                                modChannel: category.name,
                              }, {
                                where: {
                                  botId: bot.user.id,
                                  guildId: message.guild.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Mod-Logs Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Channel.create({
                                botId: bot.user.id,
                                guildId: message.guild.id,
                                modChannel: category.name,
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Mod-Logs Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          }
                        });
                    });
                  } else if (
                    collected.first().content.toLowerCase() == "logs"
                  ) {
                    const colourEmbed = new MessageEmbed()
                      .setAuthor(
                        "Provide the Channel Name below in order to change the Logs Channel.",
                        bot.user.displayAvatarURL()
                      )
                      .setColor(theme.dataValues.embedTheme);
                    message.channel.send(colourEmbed).then((msg) => {
                      msg.delete({
                        timeout: 60000,
                        reason: "It had to be done.",
                      });
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then((collected) => {
                          if (
                            collected.first().content.toLowerCase() ==
                            "cancel"
                          ) {
                            message.channel.send("Cancelled the Prompt!");
                          } else {
                            const category = message.guild.channels.cache.find(
                              (c) => c.name.toLowerCase() == collected.first().content.toLowerCase()
                            );
                            if (!category)
                              return message.channel.send(
                                "No Channel found."
                              );
                            if (channel) {
                              Channel.update({
                                logChannel: category.name,
                              }, {
                                where: {
                                  botId: bot.user.id,
                                  guildId: message.guild.id,
                                },
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Logs Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            } else {
                              Channel.create({
                                botId: bot.user.id,
                                guildId: message.guild.id,
                                logChannel: category.name,
                              }).then(() => {
                                const doneEmbed = new MessageEmbed()
                                  .setAuthor(
                                    "Successfully, Changed the Logs Channel to " +
                                    category.name +
                                    "!",
                                    bot.user.displayAvatarURL()
                                  )
                                  .setColor(theme.dataValues.embedTheme);
                                return msg.edit(doneEmbed);
                              });
                            }
                          }
                        });
                    });
                  } else {
                    message.channel.send(awaitEmbed);
                  }
                });
            }
            if (args[0].toLowerCase() === "welcome") {
              const colourEmbed = new MessageEmbed()
                .setAuthor(
                  "Provide the Message below in order to change the Message for Welcome.",
                  bot.user.displayAvatarURL()
                )
                .setColor(theme.dataValues.embedTheme);
              message.channel.send(colourEmbed).then((msg) => {
                msg.delete({
                  timeout: 60000,
                  reason: "It had to be done.",
                });
                message.channel
                  .awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    if (collected.first().content.toLowerCase() == "cancel") {
                      message.channel.send("Cancelled the Prompt!");
                    } else {
                      const welcomeMsg = collected.first().content;
                      Bot.update({
                        welcomeMessage: welcomeMsg,
                      }, {
                        where: {
                          botId: bot.user.id,
                          guildId: message.guild.id,
                        },
                      }).then(() => {
                        const doneEmbed = new MessageEmbed()
                          .setAuthor(
                            "Successfully, Changed the Welcome Message!",
                            bot.user.displayAvatarURL()
                          )
                          .setColor(theme.dataValues.embedTheme);
                        return msg.edit(doneEmbed);
                      });
                    }
                  });
              });
            }
            if (args[0].toLowerCase() === "suggestion") {
              const colourEmbed = new MessageEmbed()
                .setAuthor(
                  "Provide the Emojis for the Suggestion. (Tick Emoji, Cross)",
                  bot.user.displayAvatarURL()
                )
                .setColor(theme.dataValues.embedTheme);
              message.channel.send(colourEmbed).then((msg) => {
                msg.delete({
                  timeout: 60000,
                  reason: "It had to be done.",
                });
                message.channel
                  .awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    if (collected.first().content.toLowerCase() == "cancel") {
                      message.channel.send("Cancelled the Prompt!");
                    } else {
                      const [emojit, emojic] = collected
                        .first()
                        .content.split(/,\s+/);
                      if (!emojit && !emojic)
                        return message.channel.send(
                          "Usage: Tick Emoji, Cross Emoji"
                        );
                      const emoji1 = message.guild.emojis.cache.find(
                        (emoji) =>
                        emoji.name.toLowerCase() === emojit.toLowerCase()
                      );
                      const emoji2 = message.guild.emojis.cache.find(
                        (emoji) =>
                        emoji.name.toLowerCase() === emojic.toLowerCase()
                      );
                      Bot.update({
                        ideaTicket: emoji1.id,
                        ideaCross: emoji2.id,
                      }, {
                        where: {
                          botId: bot.user.id,
                          guildId: message.guild.id,
                        },
                      }).then(() => {
                        const doneEmbed = new MessageEmbed()
                          .setAuthor(
                            "Successfully, Changed the Suggestion Reactions!",
                            bot.user.displayAvatarURL()
                          )
                          .setColor(theme.dataValues.embedTheme);
                        return msg.edit(doneEmbed);
                      });
                    }
                  });
              });
            }
          } else {
            const helpEmbed = new MessageEmbed()
              .setAuthor("Settings-Help", bot.user.displayAvatarURL())
              .setTitle(
                "To setup the following, read the Instructions Below."
              )
              .setDescription(
                "To setup **Welcome Message** - Use ``setup Welcome`` below\nTo setup **Theme** - Use ``setup Theme`` below\nTo setup **Support Ticket** - Use ``setup Support`` below.\nTo setup **Channels** - Use ``setup Channel`` below.\n To setup **Suggestion Reactions** - Use ``setup Suggestion`` below."
              )
              .setColor()
              .setFooter(
                "Follow the instructions below in order to setup the following."
              )
              .setTimestamp();
            return message.channel.send(helpEmbed);
          }
        }
      });
  }
};