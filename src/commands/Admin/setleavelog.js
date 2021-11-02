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
 * Runs setleavelog command.
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
        embed.setDescription(":x: | Es muss ein Textkanal als Verabschiedungsnachricht Channel ausgewählt werden!");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    if (currentGuild.leavelog === channel.id)
    {
        embed.setDescription(`:x: | ${channel} ist bereits der Verabschiedungsnachricht Channel für diesen Server.`);
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    currentGuild.leavelog = channel.id;
    await currentGuild.save();

    embed.setDescription(`:white_check_mark: | ${channel} wurde erfolgreich als Verabschiedungsnachricht Channel hinterlegt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.ADMINISTRATOR
};

module.exports.data = new SlashCommandBuilder()
    .setName("setleavelog")
    .setDescription("Wählt den Textkanal, in dem Verabschiedungsnachrichten für den Server verschickt werden.")
    .addChannelOption(option => option.setName("textkanal").setDescription("Der Textkanal, in dem die Verabschiedungsnachrichten verschickt werden.").setRequired(true));