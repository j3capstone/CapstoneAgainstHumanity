module.exports = function (app, server) {
    'use strict';

    var serveStatic = require('serve-static');
    app.use(serveStatic('public'));

    server.listen(8000, function () {
        console.log('\'Capstone Against Humanity\' app listening port 8000');
    });
}
