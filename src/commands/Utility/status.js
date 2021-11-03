"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const { getPlayersOnline, getMaxPlayers, getServerStatus } = require("../../api/fivem.js");
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs status command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: false });

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay - Status", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);

    const currentGuild = await Guild.findOne({ id: interaction.guildId });
    if (!currentGuild)
    {
        embed.setDescription(":x: | Dieser Server muss zuerst mit `/setup` eingerichtet werden.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    try
    {
        const players = await getPlayersOnline(`${currentGuild.ip}:${currentGuild.port}`);
        const maxPlayers = await getMaxPlayers(`${currentGuild.ip}:${currentGuild.port}`);
        const status = await getServerStatus(`${currentGuild.ip}:${currentGuild.port}`);

        embed.setFooter("Zero-V", interaction.client.user.avatarURL({ format: "png" }))
            .setTitle(`Zero-V ist akutell ${status}!`)
            .setDescription(`**IP:** ${currentGuild.connect ?? ` /`}\n**Spieler:** ${players}/${maxPlayers}\n**TeamSpeak:** ${currentGuild.teamspeak ?? ` /`}`);
        await interaction.editReply({ embeds: [embed] });
    }
    catch (err)
    {
        if (err.code == "ENOTFOUND" || err.code == "ETIMEDOUT")
        {
            embed.setDescription(":x: | Der Server ist derzeit nicht erreichbar.");
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("status")
    .setDescription("Ruft den Status des FiveM Servers ab.");
