const orchestration = require('../../component/orchestration');

module.exports =
{
    get: function (req, res) {
        orchestration.getUserSticker(req.headers['x-api-key'], req.params.content_id, function (error, response) {
            res.setHeader('Cache-Control', 'max-age=' + (60 * 60 * 24 * 7));
            res.send(error || response);
        });
    }
};
