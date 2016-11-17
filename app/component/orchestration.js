const CONFIG = require('config');
const async = require('async');
const http = require('../lib/http');

var domainAccessToken;
module.exports = {
    getUserCollection: function (key, cb) {
        const uri = {
            protocol: CONFIG.orchestration.protocol,
            hostname: CONFIG.orchestration.host,
            pathname: CONFIG.orchestration.userCollections.path,
            method: CONFIG.orchestration.userCollections.method,
            query: {
                key: key
            },
            json: true,
        };

        const options = { uri: uri };
        fetch(options, cb);
    },

    getDomainAccessToken: function (cb) {
        const uri = {
            protocol: CONFIG.orchestration.protocol,
            hostname: CONFIG.orchestration.host,
            pathname: CONFIG.orchestration.domainAccessToken.path,
            method: CONFIG.orchestration.domainAccessToken.method,
            query: {
                key: CONFIG.auth.DAK,
                domain_api_secret: CONFIG.auth.DAS
            },
            json: true,
        };

        http({ uri: uri }, function (err, response, body) {
            if (!err) {
                body = JSON.parse(body);
                domainAccessToken = body.result.domain_access_token;
                cb(null, body.result.domain_access_token);
            } else {
                cb(err);
            }
        });
    },

    getDomainCollection: function (cb) {
        const that = this;
        async.waterfall([
            function (callback) {
                that.getDomainAccessToken(function (error, key) {
                    if (!error) {
                        callback(null, key);
                    } else {
                        cb(error);
                    }
                });
            },
            function (key, callback) {
                const uri = {
                    protocol: CONFIG.orchestration.protocol,
                    hostname: CONFIG.orchestration.host,
                    pathname: CONFIG.orchestration.domainCollections.path,
                    method: CONFIG.orchestration.domainCollections.method,
                    query: {
                        key: key
                    },
                    json: true,
                };

                const options = { uri: uri };
                fetch(options, callback);
            }
        ], cb);
    },

    getUserSticker: function (key, content_uuid, cb) {
        const uri = {
            protocol: CONFIG.orchestration.protocol,
            hostname: CONFIG.orchestration.host,
            pathname: CONFIG.orchestration.getSticker.path,
            method: CONFIG.orchestration.getSticker.method,
            query: {
                key: key,
                content_uuid: content_uuid
            },
        };

        const options = { uri: uri };
        fetch(options, cb);
    },

    buySticker: function (collectionId, userAccessToken, cb) {
        async.waterfall([
            function (callback) {
                getUserDetails(userAccessToken, function (error, res, body) {
                    if(!error) {
                        callback(null, body.result.user.user_id);
                    } else {
                        callback(error);
                    }
                });
            },
            function (userId, callback) {
                associateCollectionToUser(userId, collectionId, function (error, res, body) {
                    if(!error) {
                        callback(null, body);
                    } else {
                        callback(error);
                    }
                });
            }
        ], cb);
    }
};

function getUserDetails(userAccessToken, cb) {
    const uri = {
        protocol: CONFIG.orchestration.protocol,
        hostname: CONFIG.orchestration.host,
        pathname: CONFIG.orchestration.userDetails.path,
        method: CONFIG.orchestration.userDetails.method,
        query: {
            key: userAccessToken
        }
    };

    const options = { uri: uri, json: true };
    fetch(options, cb);
}

function associateCollectionToUser(userId, collectionId, cb) {
    const uri = {
        protocol: CONFIG.orchestration.protocol,
        hostname: CONFIG.orchestration.host,
        pathname: CONFIG.orchestration.associateCollection.path,
        query: {
            key: domainAccessToken,
            collection_id: collectionId,
            user_id: userId
        }
    };

    const options = { uri: uri, json: true, method: CONFIG.orchestration.associateCollection.method};
    fetch(options, cb);
}

function fetch(options, callback)
{
    // TODO: handle body.status
    http(options, callback);
}

