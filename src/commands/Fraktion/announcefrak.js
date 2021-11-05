"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs announcefrak command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: true });

    const fraktion = interaction.options.getString("fraktion", true),
        channel = interaction.options.getChannel("channel", true),
        role = interaction.options.getMentionable("rolle", true);

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);

    if (!channel.isText())
    {
        embed.setDescription(":x: | Es muss ein Textkanal ausgewählt werden, um die Fraktionsankündigung zu verschicken.")
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    embed.setDescription(`Liebe Community,\n\nhiermit ist die Fraktion **${fraktion}** offiziell.\n
    Mit freundlichen Grüßen,\n\n${role} | ${interaction.member}`);
    const msg = await channel.send({ embeds: [embed] });

    embed.setDescription(`:white_check_mark: | [Die Fraktionsankündigung](${msg.url}) wurde erfolgreich abgeschickt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES | Permissions.FLAGS.MANAGE_CHANNELS | Permissions.FLAGS.MANAGE_ROLES
};

module.exports.data = new SlashCommandBuilder()
    .setName("announcefrak")
    .setDescription("Kündigt eine Fraktion als offiziell an.")
    .addStringOption(option => option.setName("fraktion").setDescription("Die Fraktion, die als offiziell angekündigt werden soll.").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("Der Channel, in dem die Ankündigung verschickt wird.").setRequired(true))
    .addMentionableOption(option => option.setName("rolle").setDescription("Die Rolle, die gepinged werden soll (Frakverwaltung).").setRequired(true));
