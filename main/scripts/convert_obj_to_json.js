// Load required modules
const fs = require('fs');
const path = require('path');
const THREE = require('three');
const OBJLoader = require('three-obj-loader');

// Initialize OBJLoader with THREE
OBJLoader(THREE);

// Create a new OBJLoader instance
const loader = new THREE.OBJLoader();

// Read the OBJ file from the specified path
const objFilePath = process.argv[2]; // Argument 0 is the script name, Argument 1 is the OBJ file path
const outputJsonPath = process.argv[3]; // Argument 2 is the output JSON file path

// Read the OBJ file
fs.readFile(objFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading OBJ file:', err);
        process.exit(1); // Exit the script with an error code
    }

    // Parse the OBJ data using the OBJLoader
    const objModel = loader.parse(data);

    // Convert the parsed model to JSON format
    const jsonModel = JSON.stringify(objModel.toJSON(), null, 2);

    // Write the JSON data to the specified output file
    fs.writeFileSync(outputJsonPath, jsonModel);

    console.log('Conversion completed.'); // Log a success message
});
