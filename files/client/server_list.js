// Select Server Page System
const pageSystem = { page: 1, perpage: 50, menuOn: false };

// Open Server
const openServer = (data, isCount, isSelected) => {

    // Complete
    if (data.success) {

        // Change ID Number
        $('#guild_info_table #server_id #info').text(bot.guild);
        $('#guild_info_table').fadeIn();

        // Is Selected
        if (isSelected) {

            // Data
            console.log(data);

            // Complete
            startGuild(bot.guild, false);

        }

    }

    // Error
    else {

        // Fail Error Message
        $('#guild_info_table').fadeOut();
        tinyLib.modal({
            dialog: 'modal-lg',
            id: 'server-list-modal',
            title: 'Error!',
            body: data.errorGetGuild,
            footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
        });

    }

    // Update Page Data
    if (!isCount) { socket.emit('updateCountPage', 'openServer'); }

};

// Research Server
const researchServers = function (isServerCount) {

    // Start Loading
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

    // Go to Page
    socket.emit('getDiscordGuilds', pageSystem, (data) => {

        // Complete
        $.LoadingOverlay("hide");

        // Success
        if (data.success) {
            const resultData = getPage(data);
            $('#server-list-modal .modal-body').empty()
                .append(resultData.leaveAllServers, resultData.pagination, resultData.serverList, resultData.pagination.clone());
        }

        // Fail
        else {

            // Fail Error Message
            tinyLib.modal({
                dialog: 'modal-lg',
                id: 'server-list-modal',
                title: 'Error!',
                body: data.error,
                footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
            });

        }

        // Update Page Data
        if (!isServerCount) { socket.emit('updateCountPage', 'getDiscordGuilds'); }

    });

};

// Select Server

// Get Page
const getPage = function (data) {

    // Get Pagination
    const pagination = tinyLib.paginationCreator(data.pagination, function () {

        // Page
        const page = Number($(this).attr('page'));
        pageSystem.page = page;
        researchServers();

    });

    // Server List
    const servers = [];
    for (const item in data.data) {

        // Create TR
        servers.push({

            // TD
            items: [

                // Icon
                {
                    item: $('<img>', { alt: `${data.data[item].id}_icon`, src: data.data[item].icon, height: 32, style: 'height: 32px;' }),
                    isText: false
                },

                // Name
                {
                    item: $('<span>').append(
                        $('<div>').text(data.data[item].name),
                        $('<small>').text(data.data[item].id),
                    ),
                    isText: false
                },

                // Region
                {
                    item: data.data[item].region,
                    isText: true
                },

                // Members
                {
                    item: data.data[item].members,
                    isText: true
                },

                // Actions
                {
                    item: [

                        // Select Server
                        tinyLib.button(tinyLang.select_server, 'secondary mx-1', { 'data-dismiss': 'modal', id: 'ds_bot_guild_' + data.data[item].id }).click(function () {

                            // Guild ID
                            const guildID = $(this).attr('id').substring(13);

                            // Connect Guild
                            bot.guild = guildID;
                            socket.emit('connectDiscordGuild', guildID, function (data) {
                                return openServer(data, false, true);
                            });

                        }),

                        // Remove Server
                        tinyLib.button(tinyLang.leave, 'danger mx-1', { 'data-dismiss': 'modal', id: 'ds_bot_guild_' + data.data[item].id }).click(function () {

                            // Guild ID
                            const guildID = $(this).attr('id').substring(13);

                            // Modal
                            tinyLib.modal({
                                dialog: 'modal-lg',
                                id: 'delete-confirm',
                                title: $('<span>').text(tinyLang.leave),
                                body: tinyLang.confirm_leave,
                                footer: [
                                    tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                                    tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                                        socket.emit('leaveDiscordGuild', { guildID: guildID }, function (data) {

                                            // Success
                                            if (data.success) {

                                                // Modal
                                                tinyLib.modal({
                                                    dialog: 'modal-lg',
                                                    id: 'delete-confirm-success',
                                                    title: $('<span>').text(tinyLang.leave),
                                                    body: tinyLang.guild_deleted,
                                                    footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })],
                                                    hidden: function () {
                                                        return $('#ds_bot_' + bot.id).trigger('click');
                                                    }
                                                });

                                            }

                                            // Fail
                                            else {

                                                // Fail Error Message
                                                tinyLib.modal({
                                                    dialog: 'modal-lg',
                                                    id: 'delete-all-confirm-error',
                                                    title: 'Error!',
                                                    body: data.error,
                                                    footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
                                                });

                                            }

                                        });

                                    }),
                                ]
                            });

                        })
                    ],
                    isText: false
                },

            ]

        });

    }

    // Leave All Servers
    const leaveAllServers = $('<center>').append(tinyLib.button(tinyLang.leave_all, 'danger', { 'data-dismiss': 'modal' })).click(function () {

        // Modal
        tinyLib.modal({
            dialog: 'modal-lg',
            id: 'delete-all-confirm-1',
            title: [$('<i>', { class: 'fas fa-exclamation-triangle mr-2' }), $('<span>').text(tinyLang.leave_all)],
            body: tinyLang.confirm_leave_all,
            footer: [
                tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                    // Modal
                    tinyLib.modal({
                        dialog: 'modal-lg',
                        id: 'delete-all-confirm-2',
                        title: [$('<i>', { class: 'fas fa-exclamation-triangle mr-2' }), $('<span>').text(tinyLang.leave_all)],
                        body: tinyLang.confirm_leave_all_1,
                        footer: [
                            tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                            tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                                // Modal
                                tinyLib.modal({
                                    dialog: 'modal-lg',
                                    id: 'delete-all-confirm-3',
                                    title: [$('<i>', { class: 'fas fa-radiation-alt mr-2' }), $('<span>').text(tinyLang.leave_all)],
                                    body: tinyLang.confirm_leave_all_2,
                                    footer: [
                                        tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                                        tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                                            socket.emit('leaveDiscordGuild', { guildID: 'all' }, function (data) {

                                                // Success
                                                if (data.success) {

                                                    // Modal
                                                    tinyLib.modal({
                                                        dialog: 'modal-lg',
                                                        id: 'delete-all-confirm-success',
                                                        title: [$('<i>', { class: 'fas fa-radiation-alt mr-2' }), $('<span>').text(tinyLang.leave_all)],
                                                        body: tinyLang.guilds_deleted,
                                                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })],
                                                        hidden: function () {
                                                            return $('#ds_bot_' + bot.id).trigger('click');
                                                        }
                                                    });

                                                }

                                                // Fail
                                                else {

                                                    // Fail Error Message
                                                    tinyLib.modal({
                                                        dialog: 'modal-lg',
                                                        id: 'delete-all-confirm-error',
                                                        title: 'Error!',
                                                        body: data.error,
                                                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
                                                    });

                                                }

                                            });

                                        }),
                                    ]
                                });

                            }),
                        ]
                    });

                }),
            ]
        });

        socket.emit('connectDiscordGuild', guildID, function (data) {
            return openServer(data, false, true);
        });

    });

    // Server List
    const serverList = tinyLib.table({

        // Info
        id: 'servers',
        class: 'table-striped',
        responsive: true,

        // Head
        thead:
        {
            items: [

                // TDs
                {
                    items: [

                        // Icon
                        {
                            isText: true,
                            item: tinyLang.icon
                        },

                        // Name
                        {
                            isText: true,
                            item: tinyLang.name
                        },

                        // Region
                        {
                            isText: true,
                            item: tinyLang.region
                        },

                        // Members
                        {
                            isText: true,
                            item: tinyLang.members
                        },

                        // Actions
                        {
                            isText: true,
                            item: tinyLang.actions
                        }

                    ]
                }

            ]
        },

        // Body
        tbody: { items: servers }

    });

    // Complete
    return {

        // Leave All Servers
        leaveAllServers: leaveAllServers,

        // Create Table
        serverList: serverList,

        // Pagination
        pagination: pagination

    };

};

// Select Server Button
$('#select_server').click(function () {

    // Page System
    pageSystem.page = 1;
    pageSystem.menuOn = true;
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
    socket.emit('getDiscordGuilds', pageSystem, (data) => {

        // Complete
        $.LoadingOverlay("hide");

        // Success
        if (data.success) {

            const resultData = getPage(data);

            // Modal
            tinyLib.modal({
                dialog: 'modal-lg',
                id: 'server-list-modal',
                title: tinyLang.server_list,
                body: [resultData.leaveAllServers, resultData.pagination, resultData.serverList, resultData.pagination.clone()],
                footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })],
                hidden: function () { pageSystem.menuOn = false; }
            });

        }

        // Fail
        else {

            // Fail Error Message
            tinyLib.modal({
                dialog: 'modal-lg',
                id: 'server-list-modal-error',
                title: 'Error!',
                body: data.error,
                footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
            });

        }

    });

});

// Socket Auto Update Server List
socket.on('dsBot_channelCount', (count) => { $('#statistical_table #channel_count #info').text(count); });
socket.on('dsBot_serverCount', (item) => {

    // Update Number
    $('#statistical_table #server_count #info').text(item.value);

    // Update Server List
    if ($('#server-list-modal').length > 0) { researchServers(true); }

    // Check Exist Server
    if (bot.guild) {
        socket.emit('connectDiscordGuild', bot.guild, function (data) {
            return openServer(data, item.isCount);
        });
    }

});