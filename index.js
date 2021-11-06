"use strict";

/**
 * Bot invite link.
 * https://discord.com/oauth2/authorize?client_id=904821099815124993&permissions=268790854&scope=applications.commands%20bot
 * 
*/

const client = require("./src/util/bot.js");

require("./src/util/db.js");

require("./src/util/tick.js")(client);

require("./src/setPermissions.js")(client); //only need this once
