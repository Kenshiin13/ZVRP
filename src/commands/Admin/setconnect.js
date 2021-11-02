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
 * Runs setconnect command.
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

    if (link === currentGuild.connect)
    {
        embed.setDescription(`:x: | \`${link}\` ist bereits als FiveM Connect Link hinterlegt.`)
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    currentGuild.connect = link;
    await currentGuild.save();

    embed.setDescription(`:white_check_mark: | \`${link}\` wurde erfolgreich als FiveM Connect Link hinterlegt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.MANAGE_ROLES | Permissions.FLAGS.MANAGE_CHANNELS
};

module.exports.data = new SlashCommandBuilder()
    .setName("setconnect")
    .setDescription("Hinterlegt einen FiveM Connect Link.")
    .addStringOption(option => option.setName("link").setDescription("Der FiveM Connect Link.").setRequired(true));
