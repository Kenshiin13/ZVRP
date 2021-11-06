"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const { getLicenseKey } = require("../../api/fivem.js");
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Runs setup command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: true });

    const regelwerk = interaction.options.getString("regelwerk", false),
        ip = interaction.options.getString("ip", true),
        port = interaction.options.getString("port", false) ?? "30120",
        teamspeak = interaction.options.getString("teamspeak", false),
        connect = interaction.options.getString("connect", false);

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setColor(colorPalette.brandColor);
    try
    {
        await getLicenseKey(`${ip}:${port}`);

        const newGuild = new Guild({
            id: interaction.guildId,
            ip: ip,
            port: port
        });
        if (regelwerk)
            newGuild.regelwerk = regelwerk;
        if (teamspeak)
            newGuild.teamspeak = teamspeak;
        if (connect)
            newGuild.connect = connect;
        await newGuild.save();
        embed.setDescription(":white_check_mark: | Der Server wurde erfolgreich eingerichtet. Viel Spaß!");
        await interaction.editReply({ embeds: [embed] });
    }
    catch (err)
    {
        if (err.code == 11000) /* Duplicate key */
        {
            embed.setDescription(":x: | Dieser Server wurde bereits eingerichtet!");
            await interaction.editReply({ embeds: [embed] });
        }
        else if (err.code == "ENOTFOUND" || err.code == "ETIMEDOUT")
        {
            embed.setDescription(`Es wurde kein FiveM Server mit der IP \`${ip}:${port}\` gefunden.`);
            await interaction.editReply({ embeds: [embed] });
        }
        else
        {
            embed.setDescription(":x: | Etwas ist schiefgelaufen.. Melde dich bitte umgehend bei meinem Developer \`Kenshin13#6666\`!");
            await interaction.editReply({ embeds: [embed] });
            return Promise.reject(err);
        }
    }
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES | Permissions.FLAGS.KICK_MEMBERS | Permissions.FLAGS.BAN_MEMBERS | Permissions.FLAGS.MANAGE_ROLES | Permissions.FLAGS.EMBED_LINKS | Permissions.FLAGS.ADD_REACTIONS,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Richtet den Server für den Gebrauch ein.")
    .addStringOption(option => option.setName("ip").setDescription("Die IP des FiveM Servers.").setRequired(true))
    .addStringOption(option => option.setName("port").setDescription("Der Port des FiveM Servers. Standardwert: 30120").setRequired(false))
    .addStringOption(option => option.setName("regelwerk").setDescription("Ein Link zum Regelwerk.").setRequired(false))
    .addStringOption(option => option.setName("teamspeak").setDescription("Ein Link zum Teamspeak Server.").setRequired(false))
    .addStringOption(option => option.setName("connect").setDescription("Der Connect Link für den Server.").setRequired(false))
    .setDefaultPermission(false);

