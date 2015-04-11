var lixeiras = require('./lixeiras');

module.exports = function (req, res) {

    var id = req.params.id;
    var dados = lixeiras.get(id);

    res.send(dados);

  
};