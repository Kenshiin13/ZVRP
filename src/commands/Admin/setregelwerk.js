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
 * Runs setregelwerk command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{

    await interaction.deferReply({ ephemeral: true });

    const link = interaction.options.getString("link", true);

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);

    const currentGuild = await Guild.findOne({ id: interaction.guildId });
    if (!currentGuild)
    {
        embed.setDescription(":x: | Dieser Server muss zuerst mit `/setup` eingerichtet werden.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    if (link === currentGuild.regelwerk)
    {
        embed.setDescription(`:x: | \`${link}\` ist bereits als Regelwerk hinterlegt.`)
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    currentGuild.regelwerk = link;
    await currentGuild.save();

    embed.setDescription(`:white_check_mark: | \`${link}\` wurde erfolgreich als Regelwerk hinterlegt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.MANAGE_ROLES | Permissions.FLAGS.MANAGE_CHANNELS
};

module.exports.data = new SlashCommandBuilder()
    .setName("setregelwerk")
    .setDescription("Hinterlegt ein Regelwerk")
    .addStringOption(option => option.setName("link").setDescription("Der Link zum Regelwerk.").setRequired(true));
