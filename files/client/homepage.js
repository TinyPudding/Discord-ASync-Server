$(() => {

    // Socket Connection
    const socket = io.connect();
    let firstTime = true;
    let user = null;
    const bot = { id: null };
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

    // Connected
    socket.on('discordConnected', user => {
        if (firstTime) { firstTime = false; $.LoadingOverlay('hide'); $('.bot_list').fadeIn(); }
        user = user;
    });

    // Tools Creator
    const toolsCreator = {

        // Card Row
        cardRow: function (title = 'Example', info = '???', icon = 'fas fa-question', color = 'primary', size = 'col-xl-4 col-md-6 mb-4') {

            return $('<div>', { class: size }).append(
                $('<div>', { class: 'card border-left-' + color + ' shadow h-100 py-2' }).append(
                    $('<div>', { class: 'card-body' }).append(
                        $('<div>', { class: 'row no-gutters align-items-center' }).append(

                            // Data
                            $('<div>', { class: 'col mr-2' }).append(

                                // Title
                                $('<div>', { class: 'text-xs font-weight-bold text-' + color + ' text-uppercase mb-1', id: 'title' }).text(title),

                                // Info
                                $('<div>', { class: 'h5 mb-0 font-weight-bold text-gray-800', id: 'info' }).text(info)

                            ),

                            // Icon
                            $('<div>', { class: 'col-auto' }).append($('<i>', { class: icon + ' fa-2x text-gray-300', id: 'icon' }))

                        )
                    )
                )
            )

        }

    };

    // Select Bot
    $('[id^="ds_bot_"]').click(function () {

        // Get Bot ID
        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
        const botID = $(this).attr('id').substring(7);
        socket.emit('connectDiscordBot', botID, (data) => {

            // Is Active
            if (data.success && (typeof bot.id !== "string" || botID !== bot.id)) {

                // Change Option
                $('#ds_bot_' + botID).parent().addClass('active').css('pointer-events', 'none');
                $('#ds_bot_' + botID + ' > span > span').text(data.tag);
                $('#ds_bot_' + botID + ' > span > img').attr('src', data.avatar);
                $('#ds_bot_' + bot.id).parent().removeClass('active').css('pointer-events', '');

                // Rest App Place
                $('#panel_title').text(tinyLang.dashboard);
                $('.config-list').removeClass('active');
                $('#dashboard.config-list').addClass('active');
                $('#app').empty().append(

                    // Statics
                    $('<div>', { id: 'statistical_table', class: 'row' }).append(

                        // Bot Name
                        toolsCreator.cardRow('ID', botID, 'fas fa-robot').attr('id', 'bot_id'),

                        // Servers
                        toolsCreator.cardRow('Servers', '???', 'fas fa-server', 'info').attr('id', 'server_count'),

                        // Channels
                        toolsCreator.cardRow('Channels', '???', 'fas fa-th-list', 'info').attr('id', 'channel_count')

                    )

                );

                // Set new ID
                bot.id = botID;

            }

            // Complete
            $.LoadingOverlay('hide');
            return;

        });

    });

    // Update Info
    socket.on('dsBot_serverCount', (count) => { $('#server_count #info').text(count); });
    socket.on('dsBot_channelCount', (count) => { $('#channel_count #info').text(count); });

});