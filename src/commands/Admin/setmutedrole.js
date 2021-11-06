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
 * Runs setmutedrole command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole("rolle", true);

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

    if (currentGuild.mutedrole === role.id)
    {
        embed.setDescription(`:x: | ${role} ist bereits die Muted Rolle für diesen Server.`);
        await interaction.editReply({ embeds: [embed] });
        return;
    }
    if (role.comparePositionTo(interaction.guild.me.roles.highest) > 0)
    {
        embed.setDescription(`:x: | Die Muted Rolle darf nicht über mir stehen.`);
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    currentGuild.mutedrole = role.id;
    await currentGuild.save();

    embed.setDescription(`:white_check_mark: | ${role} wurde erfolgreich als Muted Rolle hinterlegt.`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.MANAGE_ROLES | Permissions.FLAGS.MANAGE_CHANNELS
};

module.exports.data = new SlashCommandBuilder()
    .setName("setmutedrole")
    .setDescription("Legt die Rolle fest, die ein gemuted User bekommt.")
    .addRoleOption(option => option.setName("rolle").setDescription("Wähle die Rolle aus, die ein muted User bekommt.").setRequired(true));
