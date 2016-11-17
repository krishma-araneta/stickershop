const url = require('url');
const util = require('util');

const __ = require('lodash');
const request = require('request');
const uuid = require('uuid');

function http(options, callback) {
    options = __.clone(options);
    options.uri = url.format(options.uri);
    options.method = __.defaultTo(options.method, 'GET');

    const id = uuid.v4();

    const prefix = util.format('[OUTGOING] [%s]', id.slice(0, 8).toUpperCase());

    console.info('%s [%s] %s', prefix, __.padStart(options.method.toUpperCase(), 7, ' '), options.uri);

    request(options, function (err, response, body) {
        if (err) {
            console.error('%s %s', prefix, error);
            callback({error: error});
            return;
        }

        if (response.statusCode !== 200) {
            var error = response.statusCode;
            console.error('%s %s', prefix, error);
            callback({error: error});
            return;
        }

        console.info('%s %s', prefix, response.statusCode);

        callback(null, response, body);
    });
}

module.exports = http;