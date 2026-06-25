const fs = require('fs');
const path = require('path');

const filepath = 'd:/obj/学生复习/data/examples/g2_english_u042_010.json';
const content = fs.readFileSync(filepath, 'utf8');

console.log('File length:', content.length);
console.log('First 500 chars:');
console.log(content.substring(0, 500));
console.log('---');
console.log('Contains ASCII quote (0x22):', content.includes('\x22'));
console.log('Contains Chinese left quote (0x201C):', content.includes('\u201C'));
console.log('Contains Chinese right quote (0x201D):', content.includes('\u201D'));
console.log('Contains escaped quote (\\"):', content.includes('\\"'));