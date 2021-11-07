"use strict";

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
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
 * Runs banid command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: false });

    const id = interaction.options.getString("id", true),
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

    const rest = new REST().setToken(process.env.BOT_TOKEN);
    try
    {
        const user = await rest.get(Routes.user(id));
        embed.setDescription(`:white_check_mark: | ${user.username}#${user.discriminator} wurde von ${interaction.member} vom Server entbannt!`);
        await interaction.guild.members(id, { reason: reason, days: 7 });
        const newAction = new Action({
            type: actions.ban,
            guildId: currentGuild._id,
            source: interaction.member.id,
            target: id,
            reason: reason
        });
        await newAction.save();

        await interaction.editReply({ embeds: [embed] });
    }
    catch (err)
    {
        if (err.code == 10013)
        {
            embed.setDescription(`:x: | Kein User mit der ID ${id} gefunden.`);
            await interaction.editReply({ embeds: [embed] });
        }
        else
        {
            console.log(err);
            embed.setDescription(`:x: | Etwas ist schiefgelaufen. Error Code: ${err.code}`);
            await interaction.editReply({ embeds: [embed] });
        }
        return;
    }

};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES | Permissions.FLAGS.BAN_MEMBERS,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("unbanid")
    .setDescription("Entbannt einen Nutzer vom Server.")
    .addStringOption(option => option.setName("id").setDescription("Die ID von dem Nutzer, der entbannt werden soll.").setRequired(true))
    .addStringOption(option => option.setName("grund").setDescription("Gibt den Grund für die Entbannung an.").setRequired(false))
    .setDefaultPermission(false);

