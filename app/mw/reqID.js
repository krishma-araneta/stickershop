const uuid = require('uuid');

function reqID(req, res, next) {
    req.id = uuid.v4();
    res.header('X-Request-ID', req.id);
    next();
}

module.exports = reqID;

