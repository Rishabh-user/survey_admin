const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, 'src/environments/version.ts');
const newVersion = `export const version = '${new Date().toISOString()}';\n`;

fs.writeFileSync(versionFilePath, newVersion);
