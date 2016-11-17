const fs = require('fs');
const path = require('path');

const __ = require('lodash');
const async = require('async');
const swaggerize = require('swaggerize-express');
const yaml = require('js-yaml');

const entrypoint = require('./mw/entrypoint');

function init(callback)
{
    async.map([
        async.constant(entrypoint),
        function (next)
        {
            async.waterfall([
                function (next)
                {
                    const filepath = path.join(__dirname, 'api.yaml');
                    fs.readFile(filepath, next);
                },
                function (definition, next)
                {
                    const config =
                    {
                        api: yaml.load(definition),
                        handlers: 'controller',
                    };

                    const router = swaggerize(config);

                    next(null, router);
                },
            ],
            next);
        },
    ],
    __.attempt,
    callback);
}

module.exports = init;

