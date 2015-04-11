var trash = require('./trash');

module.exports = function (req, res) {
    res.send(trash.all);  
};