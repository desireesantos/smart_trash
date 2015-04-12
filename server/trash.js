var trashs = { };

var position = {
    '0': { lat: -29.978039, lng: -51.114759 },
    '1': { lat: -29.970000, lng: -51.100000 }
}

var counter = {
    '0': 0, 
    '1': 0
}

function save(id, value) {

    trashs[id] = {
        id: id,
        value: value,
        empty: value > 10,    
        date: new Date(),
        position : position[id],
        counter: ++counter[id]
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