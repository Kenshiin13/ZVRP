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
 * Runs setjoinlog command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{

    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel("textkanal", true);

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

    if (!channel.isText())
    {
        embed.setDescription(":x: | Es muss ein Textkanal als Willkommensnachricht Channel ausgewählt werden!");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    if (currentGuild.joinlog === channel.id)
    {
        embed.setDescription(`:x: | ${channel} ist bereits der Willkommensnachricht Channel für diesen Server.`);
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    currentGuild.joinlog = channel.id;
    await currentGuild.save();

    embed.setDescription(`:white_check_mark: | ${channel} wurde erfolgreich als Willkommensnachricht Channel hinterlegt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("setjoinlog")
    .setDescription("Wählt den Textkanal, in dem Willkommensnachrichten für den Server verschickt werden.")
    .addChannelOption(option => option.setName("textkanal").setDescription("Der Textkanal, in dem die Willkommensnachricht verschickt werden.").setRequired(true))
    .setDefaultPermission(false);
