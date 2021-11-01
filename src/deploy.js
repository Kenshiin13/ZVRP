"use strict";

/* Script to deploy slash commands */

const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { getAllFilesSync } = require("./util/util.js");
const { green, yellow } = require("colors/safe");

const local = true; /* Change to false to deploy global commands */

const clientId = "904821099815124993"; /* Change clientId */
const guildId = "889234462884372520"; /* Change guildId (for local commands) */
const commands = [];

const commandFiles = getAllFilesSync(path.join(__dirname, "./commands"));
for (const file of commandFiles)
{
    const command = require(`${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);
(async () =>
{
    try
    {
        console.log(yellow("Started refreshing application (/) commands."));
        await rest.put(
            (local ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId)),
            { body: commands },
        ).then((c) =>
        {
            console.log(green("Successfully reloaded application (/) commands."));
        });
    } catch (err)
    {
        console.error(err);
        return Promise.reject(err);
    }
})();