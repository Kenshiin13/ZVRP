module.exports = async function (client)
{
    const fullPermissions = [
        {
            /* -- AB MANAGER -- */
            /* setconnect */
            id: '906662376475074621',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setjoinlog */
            id: '906662376475074622',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setleavelog */
            id: '906662376475074623',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setmutedrole */
            id: '906662376475074624',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setregelwerk */
            id: '906662376475074625',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setteamspeak */
            id: '906662376475074626',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setup */
            id: '906662376475074627',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setvorschlagschannel */
            id: '906662376475074628',
            permissions: [{
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050519',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050511',
                type: 'ROLE',
                permission: true,
            }],
        },
        /* -- ENDE -- * */
        {
            /* announcefrak */
            id: '906662376949022750',
            permissions: [{
                id: '893212186548256813',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* denouncefrak */
            id: '906662376949022751',
            permissions: [{
                id: '893212186548256813',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* strikefrak */
            id: '906662376949022752',
            permissions: [{
                id: '893212186548256813',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* ban */
            id: '906662376949022753',
            permissions: [{
                id: '893212186602774631',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* banid */
            id: '906946513622671361',
            permissions: [{
                id: '893212186602774631',
                type: 'ROLE',
                permission: true,
            }, {
                id: "197276836340826114",
                type: "USER",
                permission: true
            }],
        },
        {
            id: '906958507964784720',
            permissions: [{
                id: '893212186602774631',
                type: 'ROLE',
                permission: true,
            }, {
                id: "197276836340826114",
                type: "USER",
                permission: true
            }],
        },
        {
            /* kick */
            id: '906662376949022754',
            permissions: [{
                id: '893212186602774631',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* logs */
            id: '906662376949022755',
            permissions: [{
                id: '893212186527268939',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* mute */
            id: '906662376949022756',
            permissions: [{
                id: '893212186527268939',
                type: 'ROLE',
                permission: true,
            }]
        },
        {
            /* unmute */
            id: '906662376949022757',
            permissions: [{
                id: '893212186527268939',
                type: 'ROLE',
                permission: true,
            }],
        },
    ];

    await client.guilds.cache.get("893212186506321950")?.commands.permissions.set({ fullPermissions });
};