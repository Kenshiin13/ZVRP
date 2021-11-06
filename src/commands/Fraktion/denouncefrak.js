"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs denouncefrak command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: true });

    const fraktion = interaction.options.getString("fraktion", true),
        reason = interaction.options.getString("grund", true),
        channel = interaction.options.getChannel("channel", true),
        role = interaction.options.getMentionable("rolle", true);

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);

    if (!channel.isText())
    {
        embed.setDescription(":x: | Es muss ein Textkanal ausgewählt werden, um die Fraktionsauflösung zu verschicken.")
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    embed.setDescription(`Liebe Community,\n\nhiermit ist die Fraktion **${fraktion}** aufgelöst.\n
    Grund: **${reason}**\n\nMit freundlichen Grüßen,\n\n${role} | ${interaction.member}`);
    const msg = await channel.send({ embeds: [embed] });

    embed.setDescription(`:white_check_mark: | [Die Fraktionsauflösung](${msg.url}) wurde erfolgreich abgeschickt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("denouncefrak")
    .setDescription("Löst eine Fraktion auf.")
    .addStringOption(option => option.setName("fraktion").setDescription("Die Fraktion, die aufgelöst werden soll.").setRequired(true))
    .addStringOption(option => option.setName("grund").setDescription("Der Grund für die Auflösung.").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("Der Channel, in dem die Auflösung angekündigt wird.").setRequired(true))
    .addMentionableOption(option => option.setName("rolle").setDescription("Die Rolle, die gepinged werden soll (Frakverwaltung).").setRequired(true))
    .setDefaultPermission(false);

