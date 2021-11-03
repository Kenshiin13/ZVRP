const { Schema, Types, model } = require("mongoose");

const guildSchema = new Schema({
    id: /* Guild Id */
    {
        type: String,
        unique: true,
        required: true
    },
    ip:
    {
        type: String,
        required: true
    },
    port:
    {
        type: String,
        required: true
    },
    regelwerk:
    {
        type: String,
        required: false
    },
    teamspeak:
    {
        type: String,
        required: false
    },
    connect:
    {
        type: String,
        required: false
    },
    vorschlagschannel:
    {
        type: String,
        required: false
    },
    joinlog:
    {
        type: String,
        required: false
    },
    leavelog:
    {
        type: String,
        required: false
    }
}, { timestamps: true });

const Guild = model("Guild", guildSchema);

module.exports = Guild;