const fs = require('fs');
const path = './package.json';
let content = fs.readFileSync(path, 'utf8');
const pkg = JSON.parse(content);
pkg.engines = { node: ">=18.0.0" };
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
console.log('added engines to package.json');
