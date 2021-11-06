const { Schema, Types, model } = require("mongoose");

const tempActionSchema = new Schema({
    type: /* kick/ban/mute */
    {
        type: Number,
        required: true
    },
    target:
    {
        type: String,
        required: true
    },
    guildId:
    {
        type: Types.ObjectId,
        ref: "Guild",
        required: true
    },
    length: /* date when it ends */
    {
        type: Date,
        required: true
    },
    action:
    {
        type: Types.ObjectId,
        ref: "Action",
        required: true
    }
}, { timestamps: true });

const TempAction = model("TempAction", tempActionSchema);

module.exports = TempAction;