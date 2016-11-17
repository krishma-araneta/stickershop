const orchestration = require('../../component/orchestration');

module.exports = {
    get: function (req, res) {
        orchestration.getUserCollection(req.query.key, function (error, response, body) {
            res.send(error || body);
        });
    }
};
