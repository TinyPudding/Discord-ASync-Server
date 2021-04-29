module.exports = function (guild) {

    // Data
    const data = {
        afkChannelID: guild.afkChannelID,
        afkTimeout: guild.afkTimeout,
        applicationID: guild.applicationID,
        approximateMemberCount: guild.approximateMemberCount,
        approximatePresenceCount: guild.approximatePresenceCount,
        available: guild.available,
        banner: guild.banner,
        createdAt: guild.createdAt,
        createdTimestamp: guild.createdTimestamp,
        defaultMessageNotifications: guild.defaultMessageNotifications,
        deleted: guild.deleted,
        description: guild.description,
        discoverySplash: guild.discoverySplash,
        explicitContentFilter: guild.explicitContentFilter,
        features: guild.features,
        icon: guild.icon,
        id: guild.id,
        joinedAt: guild.joinedAt,
        joinedTimestamp: guild.joinedTimestamp,
        large: guild.large,
        maximumMembers: guild.maximumMembers,
        memberCount: guild.memberCount,
        mfaLevel: guild.mfaLevel,
        name: guild.name,
        nameAcronym: guild.nameAcronym,
        ownerID: guild.ownerID,
        partnered: guild.partnered,
        preferredLocale: guild.preferredLocale,
        premiumSubscriptionCount: guild.premiumSubscriptionCount,
        premiumTier: guild.premiumTier,
        premiumTier: guild.premiumTier,
        premiumTier: guild.premiumTier,
        premiumTier: guild.premiumTier,
        premiumTier: guild.premiumTier,
        premiumTier: guild.premiumTier,
        premiumTier: guild.premiumTier,
        premiumTier: guild.premiumTier,
        presences: [],
        emojis: [],
        members: [],
        channels: []
    };

    // Member Generator
    const memberGenerator = require('./member');

    // Get Channel 
    if (guild.members && guild.members.cache) {
        guild.members.cache.forEach(function (value) {
            data.members.push(memberGenerator(value));
            return;
        });
    }

    // Me
    data.me = memberGenerator(guild.me);

    // Channel Generator
    const channelGenerator = require('./channel');

    // Get Channel 
    if (guild.channels && guild.channels.cache) {
        guild.channels.cache.forEach(function (value) {
            data.channels.push(channelGenerator(value));
            return;
        });
    }

    // Emoji Generator
    const emojiGenerator = require('./emoji');

    // Get Emoji
    if (guild.emojis && guild.emojis.cache) {
        guild.emojis.cache.forEach(function (value) {
            data.emojis.push(emojiGenerator(value));
            return;
        });
    }

    // Complete
    return data;

};