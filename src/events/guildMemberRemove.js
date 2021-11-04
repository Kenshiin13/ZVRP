"use strict";

const { GuildMember, MessageEmbed } = require("discord.js");
const { colorPalette } = require("../util/util.js");
const Guild = require("../models/guilds.js");

module.exports.data =
{
    name: "guildMemberRemove",
    once: false,
};

/**
 * Handle the guildMemberRemove event.
 * @param {GuildMember} member The guild member that left the guild.
 */
module.exports.run = async (member) =>
{
    const currentGuild = await Guild.findOne({ id: member.guild.id });
    if (!currentGuild)
        return;

    if (!currentGuild.leavelog)
        return;

    const channel = member.guild.channels.cache.get(currentGuild.leavelog);
    if (!channel)
        return;

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", member.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setDescription(`${member} hat den Server verlassen.`)
        .setColor(colorPalette.brandColor);
    await channel.send({ embeds: [embed] });
};