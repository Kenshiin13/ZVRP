"use strict";

const { GuildMember, MessageEmbed } = require("discord.js");
const { colorPalette } = require("../util/util.js");
const Guild = require("../models/guilds.js");

module.exports.data =
{
    name: "guildMemberAdd",
    once: false,
};

/**
 * Handle the guildMemberAdd event.
 * @param {GuildMember} member The guild member that joined the guild.
 */
module.exports.run = async (member) =>
{
    const currentGuild = await Guild.findOne({ id: member.guild.id });
    if (!currentGuild)
        return;

    if (!currentGuild.joinlog)
        return;

    const channel = member.guild.channels.cache.get(currentGuild.joinlog);
    if (!channel)
        return;

    const embed = new MessageEmbed()
        .setAuthor("Zero-V Roleplay", member.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
        .setDescription(`Willkommen bei Zero-V Roleplay ${member}!`)
        .setColor(colorPalette.brandColor);
    await channel.send({ embeds: [embed] });
};