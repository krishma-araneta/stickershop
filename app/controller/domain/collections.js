const orchestration = require('../../component/orchestration');

module.exports = {
    get: function (req, res) {
        orchestration.getDomainCollection(function (error, response, body) {
            res.send(error || body);
        });
    }
};
