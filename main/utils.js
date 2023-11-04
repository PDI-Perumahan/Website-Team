// utils.js
const fs = require('fs');
const three = require('three');

function convertObjToJson(objPath, jsonPath) {
    const objLoader = new three.OBJLoader();

    objLoader.load(objPath, function (object) {
        const geometry = object.children[0].geometry;
        const json = geometry.toJSON();

        fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
    });
}

module.exports = { convertObjToJson };