const CONFIG = require('config');
const http = require('../lib/http');
const __ = require('lodash');

module.exports = {
    getCollections: function (cb) {
        const uri = {
            protocol: CONFIG.juanachat.protocol,
            hostname: CONFIG.juanachat.host,
            query: {
                brand: CONFIG.juanachat.brand
            },
            json: true
        };
        http({ uri: uri }, function (error, response, body) {
            cb(error, response, formatData(body));
        });
    }
};

function formatData(data) {
    data = JSON.parse(data);
    __.forEach(data.packages, function (item) {
        __.set(item, 'metadata.package_id', {});
        item.metadata.package_id = item.package_id;
        item.metadata.cost = parseFloat(item.cost);
        item.metadata.currency = item.currency;
        item.metadata.free = item.type;
        item.metadata.name = item.name;
        item.metadata.package_img_url = item.package_image;
        item.metadata.package_sprite = item.all_stickers_image;
    });

    return data.packages;
}