"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed, IntegrationApplication } = require("discord.js");
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs regelwerk command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: false });

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay - Regelwerk", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);

    const currentGuild = await Guild.findOne({ id: interaction.guildId });
    if (!currentGuild)
    {
        embed.setDescription(":x: | Dieser Server muss zuerst mit `/setup` eingerichtet werden.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }
    if (!currentGuild.regelwerk)
    {
        embed.setDescription(":x: | Für diesen Server wurde noch kein Regelwerk hinterlegt. Nutze `/setregelwerk <link>`.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    embed.setFooter("Zero-V", interaction.client.user.avatarURL({ format: "png" }));
    embed.setDescription(`Hier findet ihr unser [Regelwerk](${currentGuild.regelwerk}).\n\nBitte bedenkt noch mal, das wir uns keiner RP Richtung zuwenden, sondern das Regelwerk dies entscheidet.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("regelwerk")
    .setDescription("Ruft den Link für das Regelwerk ab.");
