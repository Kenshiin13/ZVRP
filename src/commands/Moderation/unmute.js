"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const { actions } = require("../../util/util.js");
const Guild = require("../../models/guilds.js");
const Action = require("../../models/actions.js");
const TempAction = require("../../models/tempactions.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs unmute command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: false });

    const member = interaction.options.getMember("user", true),
        reason = interaction.options.getString("grund", false) ?? "Kein Grund angegeben.";

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

    if (!currentGuild.mutedrole)
    {
        embed.setDescription(":x: | Für diesen Server wurde noch keine Mute Rolle hinterlegt. Führe zunächst `/setmutedrole` aus.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    const activeTempMute = await TempAction.findOne({
        type: actions.mute,
        target: member.id,
        guildId: currentGuild._id
    });

    if (activeTempMute || member.roles.cache.has(currentGuild.mutedrole))
    {
        const newAction = new Action({
            type: actions.unmute,
            guildId: currentGuild._id,
            source: interaction.member.id,
            target: member.id,
            reason: reason
        });
        await newAction.save();
        await member.roles.remove(currentGuild.mutedrole);
        await activeTempMute?.remove();
        embed.setDescription(`:white_check_mark: | ${member} wurde erfolgreich unmuted.`);
        await interaction.editReply({ embeds: [embed] });
    }
    else
    {
        embed.setDescription(`:x: | ${member} ist nicht gemuted.`);
        await interaction.editReply({ embeds: [embed] });
    }
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.MUTE_MEMBERS
};

module.exports.data = new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmuted einen User.")
    .addUserOption(option => option.setName("user").setDescription("Der User, der unmuted werden soll.").setRequired(true))
    .addStringOption(option => option.setName("grund").setDescription("Gib einen Grund für den unmute an.").setRequired(false));