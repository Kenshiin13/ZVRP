"use strict";
const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageButton, MessageEmbed, MessageActionRow } = require("discord.js");
const { colorPalette } = require("../../util/util.js");

module.exports.cooldown = {
    length: 5000, /* in ms */
    users: new Set()
};

/**
 * Runs help command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    await interaction.deferReply({ ephemeral: true });
    const command = interaction.options.getString("command", false)?.toLowerCase();
    /* If a specific command has been passed, only display info about that command. Otherwise display the normal help menu. */
    if (command)
    {
        let cmdFile;
        if (interaction.client.commands.has(command))
            cmdFile = interaction.client.commands.get(command);
        else
        {
            await interaction.editReply({ content: `Unbekannter Befehl \`${command}\`.` });
            return;
        }

        /* If a command has no arguments, display info about base command */
        if (cmdFile.data.options.length == 0)
        {
            await interaction.editReply({
                embeds: [
                    {
                        author: {
                            name: "Zero-V Roleplay - Hilfsmenü",
                            url: "https://zero-v.de/",
                            iconURL: interaction.client.user.avatarURL({ format: "png" })
                        },
                        description: `\`/${command}\` - ${cmdFile.data.description}`,
                        color: colorPalette.brandColor
                    }
                ]
            });

            return;
        }

        /** 
         * Me for the next couple of lines: https://preview.redd.it/x8kwswn852e51.png?auto=webp&s=891d648dcd77b21b92dc7eca5e9b6048c8e68948
         * Thanks to: https://github.com/ryzyx/discordjs-button-pagination/
         */
        let pageCount = 0;
        const pages = [];
        cmdFile.data.options.forEach((option) =>
        {
            const optionType = Object.keys(ApplicationCommandOptionType).find((key) => ApplicationCommandOptionType[key] == option.type);
            pages.push(
                new MessageEmbed()
                    .setAuthor("Zero-V Roleplay - Hilfsmenü", interaction.client.user.avatarURL({ format: "png" }), "https://zero-v.de/")
                    .setColor(colorPalette.brandColor)
                    .setURL("https://zero-v.de/")
                    .addField("Parameter", `${option.name}`)
                    .addField("Beschreibung", `${option.description}`)
                    .addField("Typ", `${optionType}`)
                    .addField("Erforderlich", `${option.required}`)
            );
        });

        /* Only display page buttons if there are multiple arguments to a command */
        if (pages.length == 1)
        {
            await interaction.editReply({ embeds: [pages[0]] });
            return;
        }

        /* Previous page button */
        const btnPrev = new MessageButton()
            .setCustomId("btnprev")
            .setLabel("Zurück")
            .setStyle("DANGER");
        /* Next page button */
        const btnNext = new MessageButton()
            .setCustomId("btnnext")
            .setLabel("Weiter")
            .setStyle("SUCCESS");

        const row = new MessageActionRow().addComponents([btnPrev, btnNext]);
        const message = await interaction.editReply({
            embeds: [pages[pageCount].setFooter(`Seite ${pageCount + 1} / ${pages.length}`)],
            components: [row]
        });

        /* Sets up filter for the collector to only listen to the two buttons above */
        const filter = (i) => i.customId == btnPrev.customId || i.customId == btnNext.customId;
        const collector = await message.createMessageComponentCollector({ filter, time: 120000 });

        /* Handles button clicks */
        collector.on("collect", async (i) =>
        {
            if (i.customId == btnPrev.customId)
                pageCount -= (pageCount > 0 ? 1 : 0);
            else if (i.customId == btnNext.customId)
                pageCount += (pageCount < pages.length - 1 ? 1 : 0);

            await i.deferUpdate();
            await i.editReply({
                embeds: [pages[pageCount].setFooter(`Seite ${pageCount + 1} / ${pages.length}`)],
                components: [row]
            });
            collector.resetTimer();
        });

        /* Disables the buttons once the collector has stopped listening for interactions */
        collector.on("end", () =>
        {
            const disabledRow = new MessageActionRow().addComponents(btnPrev.setDisabled(true), btnNext.setDisabled(true));
            interaction.editReply({
                embeds: [pages[pageCount].setFooter(`Seite ${pageCount + 1} / ${pages.length}`)],
                components: [disabledRow],
            });
        });
    }
    else /* No command has been passed. Display the normal help menu. */
    {
        let description = "";
        interaction.client.commands.forEach((cmd) => { description += `\n\`/${cmd["data"]["name"]}\` - ${cmd["data"]["description"]}\n`; });
        await interaction.editReply({
            embeds: [{
                author: {
                    name: "Zero-V Roleplay - Hilfsmenü",
                    url: "https://zero-v.de/",
                    iconURL: interaction.client.user.avatarURL({ format: "png" })
                },
                description: description,
                color: colorPalette.brandColor
            }]
        });
    }
};

module.exports.permissions = {
    clientPermissions: Permissions.FLAGS.SEND_MESSAGES,
    userPermissions: Permissions.FLAGS.SEND_MESSAGES
};

module.exports.data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Eine Auflistung aller Befehle.")
    .addStringOption(option => option.setName("command").setDescription("Hilfsmenü für einen spezifischen Befehl.").setRequired(false));
