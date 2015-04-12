var trashs = { };

var def = {
    '0': { type: 'Residuo orgânico', position: { lat: -29.978039, lng: -51.114759 } },
    '1': { type: 'Plástico', position: { lat: -29.970000, lng: -51.100000 } }
}

function save(id, value) {

    trashs[id] = {
        id: id,
        value: value,
        full: value < 10,    
        date: new Date(),
        position : def[id].position,
        type: def[id].type
    };
    
    return trashs[id];
} 

// exporta os metodos
module.exports = {
    save: save,
    all: trashs
};

// initial data
save(0, 200);
save(1, 200);