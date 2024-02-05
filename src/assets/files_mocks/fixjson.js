const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'opportunities.data.json');

fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.error('An error occurred:', err);
    return;
  }

  try {
    // Parse the file content as JSON
    let jsonArray = JSON.parse(data);

    // Map over the array and parse each stringified object
    jsonArray = jsonArray.map(item => JSON.parse(item));

    // Stringify the final JSON array with 2 spaces of indentation and write it back to the file
    const fixedData = JSON.stringify(jsonArray, null, 2);
    fs.writeFile(filePath, fixedData, (err) => {
      if (err) console.error('An error occurred:', err);
      else console.log('JSON file fixed successfully!');
    });

  } catch (parseErr) {
    console.error('An error occurred during JSON processing:', parseErr);
  }
});
