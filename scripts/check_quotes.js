const fs = require('fs');

const filepath = 'd:/obj/学生复习/data/examples/g2_english_u042_010.json';
const content = fs.readFileSync(filepath, 'utf8');

// 查找所有Unicode引号字符
const chineseLeftMatches = [];
const chineseRightMatches = [];
const regularQuoteMatches = [];

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const code = content.charCodeAt(i);
    
    if (code === 0x201C) {
        chineseLeftMatches.push({ char, pos: i, code: code.toString(16) });
    } else if (code === 0x201D) {
        chineseRightMatches.push({ char, pos: i, code: code.toString(16) });
    } else if (code === 0x22) {
        regularQuoteMatches.push({ char, pos: i, code: code.toString(16) });
    }
}

console.log('Chinese left quotes (U+201C):', chineseLeftMatches.length);
console.log('Chinese right quotes (U+201D):', chineseRightMatches.length);
console.log('Regular quotes (U+0022):', regularQuoteMatches.length);

if (chineseLeftMatches.length > 0) {
    console.log('First 3 Chinese left quotes:', chineseLeftMatches.slice(0, 3));
}
if (chineseRightMatches.length > 0) {
    console.log('First 3 Chinese right quotes:', chineseRightMatches.slice(0, 3));
}
if (regularQuoteMatches.length > 0) {
    console.log('First 3 regular quotes:', regularQuoteMatches.slice(0, 3));
}