"use strict";

const { Permissions, CommandInteraction, MessageEmbed } = require("discord.js");
const { msToMinAndSec, colorPalette } = require("../util/util.js");
const { red } = require("colors/safe");

module.exports.data =
{
    name: "interactionCreate",
    once: false,
};

/**
 * Handle the clients interactionCreate event.
 * @param {CommandInteraction} interaction The interaction that triggered the event.
 */
module.exports.run = async (interaction) =>
{
    /* Only handle command interactions. */
    if (!interaction.isCommand()) return;
    const command = interaction.commandName.toLowerCase();
    let cmdFile;
    if (interaction.client.commands.has(command))
        cmdFile = interaction.client.commands.get(command);
    else return; /* Return if command doesn't exist. */

    const embed = new MessageEmbed()
        .setAuthor("Community Support Bot", interaction.client.user.avatarURL({ format: "png" }), "https://melion.cloud/")
        .setColor(colorPalette.brandColor);

    /* Check if command is on cooldown. */
    if (cmdFile.cooldown.users.has(interaction.member.id))
    {
        embed.setDescription(`:hourglass_flowing_sand: | You can only use this command every ${msToMinAndSec(cmdFile.cooldown.length)} minutes.`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    /* Check if the bot is missing any permissions to run the command */
    const missingClientPermissions = interaction.guild.me.permissions.missing(cmdFile.permissions.clientPermissions);
    if (missingClientPermissions.length > 0)
    {
        embed.setDescription(`:x: | I am missing the following permissions on this server to function properly:\n\`${missingClientPermissions}\``);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    /* Check if user is authorized to run the command */
    const missingUserPermissions = interaction.member.permissions.missing(cmdFile.permissions.userPermissions)
    if (missingUserPermissions.length > 0)
    {
        embed.setDescription(`:x: | You are missing the following permissions:\n\`${missingUserPermissions}\``);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    try { cmdFile.run(interaction).catch(err => console.error(red(err))); }
    catch (err) { console.error(red(err)); }

    /* Add command cooldown */
    /* TODO: Enable for production. */
    /*     cmdFile.cooldown.users.add(interaction.member.id);
        setTimeout(() =>
        {
            cmdFile.cooldown.users.delete(interaction.member.id);
        }, cmdFile.cooldown.length); */
};