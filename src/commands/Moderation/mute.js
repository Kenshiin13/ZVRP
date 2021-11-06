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
 * Runs mute command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: false });

    const member = interaction.options.getMember("user", true),
        reason = interaction.options.getString("grund", false) ?? "Kein Grund angegeben.",
        days = interaction.options.getInteger("tage", false) ?? 0,
        hours = interaction.options.getInteger("stunden", false) ?? 0,
        minutes = interaction.options.getInteger("minuten", false) ?? 0;

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setDescription(`:white_check_mark: | ${member} wurde von ${interaction.member} für \`${days} Tage, ${hours} Stunden, ${minutes} Minuten\` gemuted!`)
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

    const activeTempMutes = await TempAction.findOne({
        type: actions.mute,
        target: member.id,
        guildId: currentGuild._id
    });

    if (activeTempMutes?.length > 0 || member.roles.cache.has(currentGuild.mutedrole))
    {
        embed.setDescription(`:x: | ${member} ist bereits gemuted.`);
        await interaction.editReply({ embeds: [embed] });
        return;
    }
    /**
    * Error Codes
    * 50013 - Missing access
    * 10011 - Unknown Role
    */
    try
    {
        await member.roles.add(currentGuild.mutedrole);
    }
    catch (err)
    {
        if (err.code == 50013)
        {
            embed.setDescription(":x: | Mir fehlt die Berechtigung, um Usern die Muted Rolle zu geben.");
            await interaction.editReply({ embeds: [embed] });
        }
        else if (err.code == 10011)
        {
            embed.setDescription(":x: | Die Muted Rolle konnte nicht gefunden werden und wurde vermutlich gelöscht. Setze am besten eine neue Muted Rolle mit `/setmutedrole`.");
            await interaction.editReply({ embeds: [embed] });
        }
        else
        {
            embed.setDescription(":x: | Etwas ist schiefgelaufen.. melde dich bei `Kenshin13#6666`.");
            await interaction.editReply({ embeds: [embed] });
        }
        return;
    }

    const newAction = new Action({
        type: actions.mute,
        guildId: currentGuild._id,
        source: interaction.member.id,
        target: member.id,
        reason: reason
    });
    await newAction.save();

    const now = new Date();
    now.setDate(now.getDate() + days);
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + minutes);

    if (days == 0 && hours == 0 && minutes == 0)
    {
        embed.setDescription(`:white_check_mark: | ${member} wurde von ${interaction.member} permanent gemuted!`)
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    const newTempAction = new TempAction({
        type: actions.mute,
        target: member.id,
        guildId: currentGuild._id,
        length: now,
        action: newAction._id
    });
    await newTempAction.save();

    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.MUTE_MEMBERS
};

module.exports.data = new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Muted einen User für eine bestimmte Zeit.")
    .addUserOption(option => option.setName("user").setDescription("Der User, der gemuted werden soll.").setRequired(true))
    .addStringOption(option => option.setName("grund").setDescription("Der Grund für den Mute.").setRequired(false))
    .addIntegerOption(option => option.setName("tage").setDescription("Wieviele Tage der Nutzer gemuted werden soll.").setRequired(false))
    .addIntegerOption(option => option.setName("stunden").setDescription("Wieviele Stunden der Nutzer gemuted werden soll.").setRequired(false))
    .addIntegerOption(option => option.setName("minuten").setDescription("Wieviele Minuten der Nutzer gemuted werden soll.").setRequired(false));

