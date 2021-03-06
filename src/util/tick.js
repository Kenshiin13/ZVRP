const { Client } = require("discord.js");
const TempAction = require("../models/tempactions.js");
const { actions } = require("../util/util.js");

/**
 * 
 * @param {Client} client 
 */
module.exports = async function (client)
{
    try
    {
        setInterval(async () =>
        {
            const now = new Date();
            const res = await TempAction.find({
                length: {
                    "$lte": now
                }
            }).populate(["guildId", "action"]);
            if (res.length != 0)
            {
                res.forEach(async (action) =>
                {
                    if (action.type == actions.mute)
                    {
                        client.guilds.cache.get(action.guildId.id).members.fetch(action.target).then((member) =>
                        {
                            if (action.guildId.mutedrole)
                                member.roles.remove(action.guildId.mutedrole);
                        });
                    }

                    await action.remove();
                });
            }
        }, 60000);
    }
    catch (err)
    {

    }
};
