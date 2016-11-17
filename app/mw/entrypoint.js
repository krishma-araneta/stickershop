const util = require('util');

const bodyParser = require('body-parser');
const express = require('express');
const __ = require('lodash');

const reqID = require('./reqID');

const router = express.Router();

router.use(bodyParser.json());

router.use(function (req, res, next) {
    req.uri = req._parsedUrl;
    next();
});

router.use(function(req, res, next) {
    __.set(req, 'time.from', new Date);
    next();
});

router.use(reqID);

// TODO: app.set('trust proxy', true)
router.use(function(req, res, next) {
    const client_ip_array = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const client_ip = __(client_ip_array).chain().split(',').head().value();

    __.set(req, 'connection.remoteIP', client_ip);

    next();
});

router.use(function (req, res, next) {
    const prefix = util.format('[INCOMING] [%s]', req.id.slice(0, 8).toUpperCase());

    console.log('%s [%s] %s', prefix, __.padStart(req.method.toUpperCase(), 7, ' '), req.uri.pathname);
    console.log('%s unique ID: %s', prefix, req.id);
    console.log('%s remote IP: %s', prefix, req.connection.remoteIP);

    var key = req.headers['x-api-key'];
    if (key) {
        console.log('%s key: %s', prefix, key);
    }

    next();
});

router.use(function (req, res, next) {
    res.on('finish', __.bind(exit, null, req, res));
    next();
});

module.exports = router;

function exit(req, res)
{
    const prefix = util.format('[INCOMING] [%s]', req.id.slice(0, 8).toUpperCase());

    console.log('%s HTTP %s', prefix, res.statusCode);
}

