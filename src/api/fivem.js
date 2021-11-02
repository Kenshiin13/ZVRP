/* Credits: Static version of https://github.com/xliel/discord-fivem-api */

const fetch = require('node-fetch');

async function getHost(ip)
{
    const split = ip.split(':')
    return split[0];
}

async function getPort(ip)
{
    const split = ip.split(':')
    if (split.length >= 2)
    {
        return split[1];
    }
}

async function getServerStatus(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/info.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess('online');
        }).catch((err) =>
        {
            sendSuccess('offline')
        });
    });
}

async function getPlayers(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/players.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

async function getPlayersOnline(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/players.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body.length);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

async function getMaxPlayers(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/info.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body.vars.sv_maxClients);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

async function getServerResources(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/info.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body.resources);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

async function getServerLocale(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/info.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body.vars.locale);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

async function getServerTags(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/info.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body.vars.tags);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

async function getServerVersion(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/info.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body.version);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

async function getLicenseKey(ip)
{
    return new Promise((sendSuccess, sendError) =>
    {
        fetch(`http://${ip}/info.json`).then((res) => res.json()).then((body) =>
        {
            sendSuccess(body.vars.sv_licenseKeyToken);
        }).catch((err) =>
        {
            sendError(err);
        });
    });
}

module.exports = {
    getHost: getHost,
    getPort: getPort,
    getServerStatus: getServerStatus,
    getPlayers: getPlayers,
    getPlayersOnline: getPlayersOnline,
    getMaxPlayers: getMaxPlayers,
    getServerResources: getServerResources,
    getServerLocale: getServerLocale,
    getServerTags: getServerTags,
    getServerVersion: getServerVersion,
    getLicenseKey: getLicenseKey
};