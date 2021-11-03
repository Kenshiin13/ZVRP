const { Schema, Types, model } = require("mongoose");

const actionSchema = new Schema({
    type: /* kick/ban/mute */
    {
        type: Number,
        required: true
    },
    guildId:
    {
        type: Types.ObjectId,
        ref: "Guild",
        required: true
    },
    source: /* command issuer */
    {
        type: String,
        required: true
    },
    target: /* command target */
    {
        type: String,
        required: true
    },
    reason:
    {
        type: String,
        required: false
    },
}, { timestamps: true });

const Action = model("Action", actionSchema);

module.exports = Action;