"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const { actions } = require("../../util/util.js");
const Action = require("../../models/actions.js");
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs ban command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: false });

    const member = interaction.options.getMember("user", true);
    const reason = interaction.options.getString("grund", false) ?? "Kein Grund angegeben.";

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setDescription(`:white_check_mark: | ${member} wurde von ${interaction.member} vom Server gebannt!`)
        .setColor(colorPalette.brandColor);


    const currentGuild = await Guild.findOne({ id: interaction.guildId });
    if (!currentGuild)
    {
        embed.setDescription(":x: | Dieser Server muss zuerst mit `/setup` eingerichtet werden.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    if (!member.manageable)
    {
        embed.setDescription(`:x: | ${member} steht in der Hierachie über mir. Ich kann nichts gegehn ihn unternehmen.`);
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    await member.ban({ reason: reason, days: 7 });

    const newAction = new Action({
        type: actions.ban,
        guildId: currentGuild._id,
        source: interaction.member.id,
        target: member.id,
        reason: reason
    });
    await newAction.save();

    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES | Permissions.FLAGS.BAN_MEMBERS,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannt einen Nutzer vom Server.")
    .addUserOption(option => option.setName("user").setDescription("Der Nutzer, der vom Server gebannt wird.").setRequired(true))
    .addStringOption(option => option.setName("grund").setDescription("Gibt den Grund für den Bann an.").setRequired(false))
    .setDefaultPermission(false);

