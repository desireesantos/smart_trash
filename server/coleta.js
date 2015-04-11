var lixeiras = require('./lixeiras');

module.exports = function (req, res) {

    var id = req.params.id;
    var value = req.params.value;
    
    lixeiras.save(id, value);
    
    res.send(lixeiras.get(id));
  
};