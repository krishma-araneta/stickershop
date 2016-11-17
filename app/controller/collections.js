const juanachat = require('../component/juanachat');

module.exports = {
    get: function (req, res) {
        juanachat.getCollections(function (error, response, body) {
            res.send(error || body);
        });
    }
};
