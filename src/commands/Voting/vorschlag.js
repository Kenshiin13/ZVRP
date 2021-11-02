"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { colorPalette } = require("../../util/util.js");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const Guild = require("../../models/guilds.js");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Runs vorschlag command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: true });

    const vorschlag = interaction.options.getString("vorschlag", true);
    let embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }))
        .setColor(colorPalette.brandColor);

    const currentGuild = await Guild.findOne({ id: interaction.guildId });
    if (!currentGuild)
    {
        embed.setDescription(":x: | Dieser Server muss zuerst mit `/setup` eingerichtet werden.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }
    if (!currentGuild.vorschlagschannel)
    {
        embed.setDescription(":x: | Es wurde noch kein Vorschlagschannel für diesen Server hinterlegt. Nutze `/setvorschlagchannel <@textchannel>`.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    const channel = interaction.guild.channels.cache.get(currentGuild.vorschlagschannel);
    if (!channel)
    {
        embed.setDescription(":x: | Der Vorschlagschannel konnte nicht gefunden werden oder ich habe keinen Zugriff auf ihn.");
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    embed.setAuthor(`${interaction.member.displayName}'s Vorschlag`, interaction.member.user.avatarURL({ format: "png" }))
        .setColor(colorPalette.brandColor)
        .setFooter("Zero-V", interaction.client.user.avatarURL({ format: "png" }))
        .setDescription(vorschlag);

    const msg = await channel.send({ embeds: [embed] });
    await msg.react("✅");
    await msg.react("❌");

    embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", interaction.client.user.avatarURL({ format: "png" }))
        .setColor(colorPalette.brandColor)
        .setDescription(`:white_check_mark: | [Dein Vorschlag](${msg.url}) wurde abgeschickt!`);
    await interaction.editReply({ embeds: [embed] });
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("vorschlag")
    .setDescription("Mache einen Vorschlag für den Server.")
    .addStringOption(option => option.setName("vorschlag").setDescription("Dein Vorschlag.").setRequired(true));
