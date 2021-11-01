"use strict";

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Client, Intents, Collection } = require("discord.js");
const { getAllFilesSync } = require("./util.js");
const { cyan, green, red } = require("colors/safe");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.commands = new Collection();

/* -- Load Events -- */

console.log(cyan("Loading Events . . ."));
const events = getAllFilesSync(path.join(__dirname, "../events"));
if (events.length == 0)
    console.log(red("NO EVENTS FOUND"));
else
{
    /* Iterate every file in the array and require it. Also register every event. */
    events.forEach((file, i) =>
    {
        const event = require(`${file}`);
        console.log(green(`${++i}. Event: ${file.split('\\').pop().split('/').pop()} loaded!`)); //Strip absoulte path
        if (event.data.once)
            client.once(event.data.name, (...args) => event.run(...args).catch(err => console.error(red(err))));
        else client.on(event.data.name, (...args) => event.run(...args).catch(err => console.error(red(err))));
    });
}

/* -- End Load Events -- */


/* -- Load Commands -- */

console.log(cyan("Loading Commands . . ."));
const commands = getAllFilesSync(path.join(__dirname, "../commands"));
if (commands.length == 0)
    console.log(red("NO COMMANDS FOUND"));
else
{
    /* Iterate every file in the array and require it. Also map it to the commands collection. */
    commands.forEach((file, i) =>
    {
        const props = require(`${file}`);
        console.log(green(`${++i}. Command: ${file.split('\\').pop().split('/').pop()} loaded!`)); //Strip absoulte path
        client.commands.set(props.data.name, props);
    });
}

/* -- End Load Commands -- */

client.login(process.env.BOT_TOKEN).then(() =>
{
    client.user.setActivity("Author: Kenshin13#6666", { type: 'WATCHING' });
});


module.exports = client;