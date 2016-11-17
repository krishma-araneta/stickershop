const path = require('path');

const async = require('async');
const express = require('express');

const api = require('./api');
const compress = require('compression');

function init(callback)
{
    async.waterfall([
        function (next)
        {
            const app = express();
            next(null, app);
        },
        function (app, next)
        {
            app.use(compress());
            next(null, app);
        },
        function (app, next)
        {
            const dirpath = path.join(__dirname, '..', 'public');
            const mw = express.static(dirpath, { maxAge: (60 * 60 * 24 * 7) });
            app.use(mw);
            next(null, app);
        },
        function (app, next)
        {
            api(function (error, router) {
                if (error) {
                    next(error);
                    return;
                }

                app.use(router);
                next(null, app);
            });
        },
    ],
    callback);
}

module.exports = init;

