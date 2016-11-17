const orchestration = require('../component/orchestration');

module.exports =
{
    post: function (req, res) {
        orchestration.buySticker(req.body.collection_id, req.body.key, function (error, response) {
            res.send(error || response);
        });
    }
};

