module.exports = function (app, server) {
    'use strict';

    /* Configuration */
    var env = process.env.env || 'dev';
    var config = require('./config/config-' + env + '.js');

    /* IOC Container */
    var ioc = require('./IOC/container.js');

    /* Models */
    var models = require('./models/models.js')(ioc);

    /* The socket.io server */
    var io = require('socket.io')(server);

    require('./events/events.js')(io, ioc.hashIDs, models, {});
}
