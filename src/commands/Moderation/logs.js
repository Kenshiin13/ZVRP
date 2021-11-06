"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const { actions, getKeyByValue } = require("../../util/util.js");
const Action = require("../../models/actions.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs logs command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: false });

    const user = interaction.options.getMember("user", true);

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);

    const logs = await Action.find({ target: user.id })
    if (logs.length == 0)
    {
        embed.setDescription(`Zu dem User ${user} wurden keine Moderationseinträge gefunden.`);
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    logs.sort((a, b) =>
    {
        if (a.createdAt < b.createdAt)
            return -1
        else return 1;
    });

    logs.forEach((entry, i) =>
    {
        embed.setDescription(`${embed.description ?? ""}\n**${++i}. Eintrag**\n**Typ:** ${getKeyByValue(actions, entry.type)}\n**User:** <@${entry.target}>\n**Moderator:** <@${entry.source}>\n**Grund:** ${entry.reason}\n`);
    });

    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.MANAGE_ROLES
};

module.exports.data = new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Zeigt die Moderations Logs von einem Nutzer an.")
    .addUserOption(option => option.setName("user").setDescription("Der Nutzer, von dem die Logs abgerufen werden sollen.").setRequired(true))
    .setDefaultPermission(false);

