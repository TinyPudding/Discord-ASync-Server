module.exports = function (bot, index, fbCfg, firebaseBaseCfg, firebase, login) {
    return new Promise(async (resolve, reject) => {

        // Log
        console.log('Preparing Firebase Bot Cache... (Index ' + index + ')');

        // Modules
        const objType = require('@tinypudding/puddy-lib/get/objType');
        const _ = require('lodash');
        const clone = require('clone');

        // Prepare Config
        fbCfg = _.defaultsDeep({}, fbCfg, {

            // Database
            databaseURL: '',
            path: null,
            id: null,

            // Message Cache
            messageCache: {
                maxSize: 200,
                lifeTime: 0,
                sweepInterval: 0,
                editHistoryMaxSize: -1
            },

            // All Events
            allEvents: false,

            // Events
            events: {
                channelCreate: false,
                channelDelete: false,
                channelPinsUpdate: false,
                channelUpdate: false,
                debug: false,
                emojiCreate: false,
                emojiDelete: false,
                emojiUpdate: false,
                error: false,
                guildBanAdd: false,
                guildBanRemove: false,
                guildCreate: false,
                guildDelete: false,
                guildIntegrationsUpdate: false,
                guildMemberAdd: false,
                guildMemberAvailable: false,
                guildMemberRemove: false,
                guildMembersChunk: false,
                guildMemberSpeaking: false,
                guildMemberUpdate: false,
                guildUnavailable: false,
                guildUpdate: false,
                invalidated: false,
                inviteCreate: false,
                inviteDelete: false,
                message: false,
                messageDelete: false,
                messageDeleteBulk: false,
                messageReactionAdd: false,
                messageReactionRemove: false,
                messageReactionRemoveAll: false,
                messageReactionRemoveEmoji: false,
                messageUpdate: false,
                presenceUpdate: false,
                rateLimit: false,
                ready: false,
                roleCreate: false,
                roleDelete: false,
                roleUpdate: false,
                shardDisconnect: false,
                shardError: false,
                shardReady: false,
                shardReconnecting: false,
                shardResume: false,
                typingStart: false,
                userUpdate: false,
                voiceStateUpdate: false,
                warn: false,
                webhookUpdate: false
            }

        });

        // Is Object
        if (
            objType(firebase, 'object') &&
            objType(firebaseBaseCfg, 'object') &&
            objType(fbCfg, 'object') &&
            typeof fbCfg.databaseURL === "string" &&
            typeof fbCfg.id === "string" &&
            fbCfg.id.length > 0 &&
            fbCfg.databaseURL.length > 0
        ) {

            // Start Firebase
            try {

                // Config Firebase
                const firebaseCfg = clone(firebaseBaseCfg);
                firebaseCfg.databaseURL = fbCfg.databaseURL;

                // Create Firebase App
                bot.firebase = { root: firebase.initializeApp(firebaseCfg, fbCfg.id) };
                bot.firebase.db = { root: bot.firebase.root.database() };

                // Start DB
                if (typeof fbCfg.path !== "string" || fbCfg.path === '') {
                    bot.firebase.db.main = bot.firebase.db.root.ref('/');
                } else {
                    bot.firebase.db.main = bot.firebase.db.root.ref(fbCfg.path);
                }

                // Prepare Auth
                bot.firebase.auth = bot.firebase.root.auth();

                // Firebase AuthStateChanged
                let firstTiemAuthState = true;
                bot.firebase.auth.onAuthStateChanged((user) => {

                    // Update User
                    fbCfg.user = user;

                    // is User
                    if (user) {
                        console.log('Firebase Auth from Discord Bot received User Data! (Index ' + index + ')');
                        if (firstTiemAuthState) {

                            // Disable
                            firstTiemAuthState = false;

                            // Result
                            fbCfg.bot = bot;
                            require('./discord')(bot, fbCfg, index);
                            console.log('Firebase Bot Cache started! (Index ' + index + ')');
                            resolve();

                        }
                    }

                    // Nope
                    else {
                        console.log('Firebase Auth from Discord Bot received a empty User Data! (Index ' + index + ')');
                    }

                });

                // bot.firebase.auth
                // Start Login
                const loginStart = function (token) {
                    return bot.firebase.auth.signInWithCustomToken(token).then((userCredential) => {
                        fbCfg.userCredential = userCredential;
                        return;
                    }).catch((err) => {
                        reject(err);
                        return;
                    });
                };

                // Is Function
                if (typeof login === "function") {

                    // Try Token
                    try {
                        const tokenResult = await login();
                        loginStart(tokenResult);
                    }

                    // Fail
                    catch (err) { reject(err); }

                }

                // Is String
                else if (typeof login === "string") {
                    loginStart(login);
                }

                // Nothing
                else { reject(new Error('Invalid Firebase Token Value from Discord Bot in the login method! (Index ' + index + ')')); }

            }

            // Fail
            catch (err) {

                // Error Message
                console.error(err);
                bot.firebase = null;

            }

        }

        // Nope
        else { console.log('Firebase Bot Cache disabled! (Index ' + index + ')'); resolve(); }

        // Complete
        return;

    });
};