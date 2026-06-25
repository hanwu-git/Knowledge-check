const fs = require('fs');
const content = fs.readFileSync('data/knowledge/g2_chinese_recite_upper.json', 'utf8');
const lines = content.split('\n');
const line6 = lines[5];
console.log('Line 6 length:', line6.length);
console.log('Chars around 189:', line6.substring(180, 210));
// Check char codes
for(let i=185; i<=195; i++) {
    console.log('Char', i, ':', line6.charCodeAt(i-1), line6.charAt(i-1));
}
