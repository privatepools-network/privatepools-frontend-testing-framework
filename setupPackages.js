const fs = require('fs');

// Read package.json
const packageJsonPath = './package.json';
const packageJson = require(packageJsonPath);

// Modify package.json based on environment variables
packageJson.dependencies["@wavelength/sdk"] = process.env.WAVELENGTH_SDK_SOURCE || packageJson.dependencies["@wavelength/sdk"];
packageJson.dependencies["@wavelength/sor2"] = process.env.WAVELENGTH_SOR2_SOURCE || packageJson.dependencies["@wavelength/sor2"];

// Write the modified package.json back
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
