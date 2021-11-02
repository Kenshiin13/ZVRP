"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs setteamspeak command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{

    await interaction.deferReply({ ephemeral: true });

    const ip = interaction.options.getString("ip", true);

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }))
        .setColor(colorPalette.brandColor);

    const currentGuild = await Guild.findOne({ id: interaction.guildId });
    if (!currentGuild)
    {
        embed.setDescription(":x: | Dieser Server muss zuerst mit `/setup` eingerichtet werden.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    if (ip === currentGuild.teamspeak)
    {
        embed.setDescription(`:x: | \`${ip}\` ist bereits als TeamSpeak Server hinterlegt.`)
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    currentGuild.teamspeak = ip;
    await currentGuild.save();

    embed.setDescription(`:white_check_mark: | Die IP \`${ip}\` wurde erfolgreich als TeamSpeak Server hinterlegt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.MANAGE_ROLES | Permissions.FLAGS.MANAGE_CHANNELS
};

module.exports.data = new SlashCommandBuilder()
    .setName("setteamspeak")
    .setDescription("Hinterlegt einen TeamSpeak Server.")
    .addStringOption(option => option.setName("ip").setDescription("Die TeamSpeak Server IP.").setRequired(true));
