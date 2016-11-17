require('use-strict');

const CONFIG = require('config');

const async = require('async');

const app = require('./app');

function run(callback)
{
    async.waterfall([
        app,
        function (app, next)
        {
            const server = app.listen(CONFIG.port, function () {
                const endpoint = server.address();
                console.log('listening on %s:%s', endpoint.address, endpoint.port);
                next();
            });
        },
    ],
    callback);
}

run(function (error) {
    if (error) {
        throw error;
    }
});

