// Send Info
const sendInfo = function (ioCache, where, botID, itemSent) {

    // Validate User Session
    for (const item in ioCache.users) {
        for (const id in ioCache.users[item].ids) {
            if (ioCache.users[item].ids[id].bot && ioCache.users[item].ids[id].bot.user && ioCache.users[item].ids[id].bot.user.id === botID) {
                ioCache.users[item].ids[id].socket.emit(where, itemSent);
            }
        }
    }

    // Complete
    return;

};

// Update Log
const updateDiscordLog = function (ioCache, logList, botID, where, itemResult) {

    // Add To Log
    logList.push(itemResult);

    // Check Log Size
    if (logList.length > 500) { logList.shift(); }

    // Complete
    return sendInfo(ioCache, 'dsBot_' + where, botID, { item: itemResult, list: logList });

};

// Start
const startDiscordSocket = function (ioCache, io, data) {

    // Get Bot
    const bot = data.bot;

    // Create Log
    data.log = {};

    // Create Error
    data.log.error = [];

    // Create Warn
    data.log.warn = [];

    // Create Rate Limit
    data.log.rateLimit = [];

    // Create Rate Limit
    data.log.shardError = [];

    // Log Items
    bot.on('rateLimit', (info) => { return updateDiscordLog(ioCache, data.log.rateLimit, bot.user.id, 'rateLimit', info); });
    bot.on('warn', (info) => { return updateDiscordLog(ioCache, data.log.warn, bot.user.id, 'warn', info); });
    bot.on('error', (info) => { return updateDiscordLog(ioCache, data.log.error, bot.user.id, 'error', info); });
    bot.on('shardError', (err, shardID) => { return updateDiscordLog(ioCache, data.log.shardError, bot.user.id, 'shardError', { err: err, shardID: shardID }); });

    // Channel
    bot.on('channelCreate', () => { return sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); });
    bot.on('channelDelete', () => { return sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); });

    // Guild
    bot.on('guildCreate', () => { return sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, bot.guilds.cache.size); });
    bot.on('guildDelete', () => { return sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, bot.guilds.cache.size); });

    // Complete
    return;

};

// Export Module
module.exports = function (ioCache, io, discord) {
    for (const item in discord.bots) { startDiscordSocket(ioCache, io, discord.bots[item]); }
    return;
};