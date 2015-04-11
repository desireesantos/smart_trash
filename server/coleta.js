var trashs = require('./trash');

module.exports = function (req, res) {

    var id = req.params.id;
    var value = req.params.value;
    
    trashs.save(id, value);
    
    res.send(value);
  
};