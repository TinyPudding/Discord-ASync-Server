module.exports = async function (resolve, reject, discordCfg, webCfg, web, app) {

    // Nunjucks
    const path = require('path');
    const nunjucks = require('nunjucks');
    nunjucks.configure(path.join(__dirname, '../views'), {
        autoescape: true,
        express: web.app
    });

    web.app.set('view engine', 'nunjucks');

    // Modules
    const bodyParser = require('body-parser');
    const interactionEndPoint = require('./interactionEndPoint');
    const homepage = require('./homepage');

    // Create Express App
    app.web.server = require('http').createServer(web.app);

    // bot Checker
    if (webCfg.botChecker) { app.web.io = require('socket.io')(app.web.server); }

    // Body Parser
    web.app.use(bodyParser.json());
    web.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Extra
    if (typeof webCfg.middleware === "function") { await webCfg.middleware(web, app); }

    // Terms
    web.app.get('/tos', (req, res) => { return res.render('tos'); });
    web.app.get('/privacy', (req, res) => { return res.render('privacy'); });

    // Bot Checker
    if (webCfg.botChecker) { web.app.get('/', web.dsSession({ getUser: true }), (req, res) => { return homepage(req, res, webCfg, web, app); }); }

    // Interaction
    if (
        webCfg.slashCommandListener &&
        webCfg.slashCommandListener.enabled &&
        typeof webCfg.slashCommandListener.function === "string" &&
        discordCfg && discordCfg.apps
    ) {

        // Insert Interactions Endpoint
        web.app.all('/interactions/endpoint', (req, res) => {
            return interactionEndPoint(req, res, webCfg.slashCommandListener, app.firebase, discordCfg.apps);
        });

    }

    // Load Bots and Start the Website
    if (app.discord.bots && app.discord.bots.length > 0) {

        require('for-promise')({ data: app.discord.bots }, function (i, fn, fn_error) {

            // Complete
            app.discord.bots[i].bot.login(app.discord.bots[i].token).then(() => { return fn(); }).catch(err => { return fn_error(err); });
            return;

        }).then(() => {

            // Complete
            web.fn();
            resolve();
            return;

        }).catch(err => {
            reject(err);
            return;
        });

        return;

    }

    // Nope
    else { web.fn(); resolve(); return; }

};