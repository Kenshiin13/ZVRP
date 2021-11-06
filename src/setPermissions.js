module.exports = async function (client)
{
    const fullPermissions = [
        {
            /* setconnect */
            id: '904942140264689724',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setjoinlog */
            id: '905236868336074752',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setleavelog */
            id: '905236868336074753',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setmutedrole */
            id: '906565104018010222',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setregelwerk */
            id: '904942140264689725',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setteamspeak */
            id: '904940559490228275',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setup */
            id: '904925316936511550',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* setvorschlagschannel */
            id: '904952713438183444',
            permissions: [{
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* announcefrak */
            id: '906194168085377084',
            permissions: [{
                id: '893212186548256813',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* denouncefrak */
            id: '906192958196441139',
            permissions: [{
                id: '893212186548256813',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* strikefrak */
            id: '906190990551961690',
            permissions: [{
                id: '893212186548256813',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* ban */
            id: '905517348172230728',
            permissions: [{
                id: '893212186602774631',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* kick */
            id: '905456223023943711',
            permissions: [{
                id: '893212186602774631',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* logs */
            id: '905522064440561674',
            permissions: [{
                id: '893212186527268939',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* mute */
            id: '905897975694368810',
            permissions: [{
                id: '893212186548256817',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050510',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050512',
                type: 'ROLE',
                permission: true,
            },
            {
                id: '893212186548256812',
                type: 'ROLE',
                permission: true,
            },
            {
                id: '893212186565050513',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050514',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            /* unmute */
            id: '906579408448544798',
            permissions: [{
                id: '893212186548256817',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050510',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050512',
                type: 'ROLE',
                permission: true,
            },
            {
                id: '893212186548256812',
                type: 'ROLE',
                permission: true,
            },
            {
                id: '893212186565050513',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050514',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186565050516',
                type: 'ROLE',
                permission: true,
            }, {
                id: '895750945831550977',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774628',
                type: 'ROLE',
                permission: true,
            }, {
                id: '893212186602774629',
                type: 'ROLE',
                permission: true,
            }],
        },
    ];
    await client.guilds.cache.get("893212186506321950")?.commands.permissions.set({ fullPermissions });
};