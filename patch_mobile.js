const fs = require('fs');
const path = './client/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace('<main className="flex-1">', '<main className="flex-1 pb-20 lg:pb-0">');
fs.writeFileSync(path, content);
console.log('patched mobile margin');
