var lixeiras = {};

function save(id, value) {

    lixeiras[id] = { value: value, date: new Date() };
}

function get(id) {
    return lixeiras[id] || {};
}

// exporta os metodos
module.exports = {
    save: save,
    get: get
};