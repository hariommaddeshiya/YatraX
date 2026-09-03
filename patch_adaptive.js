const fs = require('fs');
const path = './server/services/adaptiveEngine.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/trip\.adaptationHistory\.unshift\(adaptationRecord\);/g, 
  "if (!trip.adaptationHistory) trip.adaptationHistory = [];\n      trip.adaptationHistory.unshift(adaptationRecord);");

fs.writeFileSync(path, content);
console.log('patched adaptive engine');
