const BaseEvent = require("../../utils/structures/BaseEvent");
const {
    MessageEmbed
} = require("../../utils/structures/BaseEvent");
module.exports = class MessageDeleteBulkEvent extends BaseEvent {
    constructor() {
        super("messageDeleteBulk");
    }
    async run(bot, message) {


    }
};