"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs strikefrak command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: true });

    const fraktion = interaction.options.getString("fraktion", true),
        reason = interaction.options.getString("grund", true),
        strikecount = interaction.options.getInteger("strikecount", true),
        length = interaction.options.getNumber("länge", true),
        channel = interaction.options.getChannel("channel", true),
        role = interaction.options.getMentionable("rolle", true);

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);

    if (!channel.isText())
    {
        embed.setDescription(":x: | Es muss ein Textkanal ausgewählt werden, um den Strike zu verschicken.")
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    embed.setDescription(`Liebe Community,\n\nhiermit erhält die Fraktion **${fraktion}** einen Strike.\n
    Grund: **${reason}**\n\nDauer: **${length} Tage**\n\nStrike: **${strikecount}/3**\n\nMit freundlichen Grüßen,\n\n${role} | ${interaction.member}`);
    const msg = await channel.send({ embeds: [embed] });

    embed.setDescription(`:white_check_mark: | [Der Strike](${msg.url}) wurde erfolgreich abgeschickt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("strikefrak")
    .setDescription("Schreibt ein Strike an eine Frkation aus.")
    .addStringOption(option => option.setName("fraktion").setDescription("Die Fraktion, die gestriked werden soll.").setRequired(true))
    .addStringOption(option => option.setName("grund").setDescription("Der Grund für den Strike.").setRequired(true))
    .addIntegerOption(option => option.setName("strikecount").setDescription("Die Anzahl an Strikes, die die Fraktion inkl. diesem Strike hat.").setRequired(true))
    .addNumberOption(option => option.setName("länge").setDescription("Die Länge in Tagen, bis der Strike verschwindet.").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("Der Channel, in dem der Strike ausgesprochen wird.").setRequired(true))
    .addMentionableOption(option => option.setName("rolle").setDescription("Die Rolle, die gepinged werden soll (Frakverwaltung).").setRequired(true))
    .setDefaultPermission(false);

