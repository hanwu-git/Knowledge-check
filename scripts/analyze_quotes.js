const fs = require('fs');
const path = require('path');

const baseDir = 'd:/obj/学生复习/data/examples';
const files = fs.readdirSync(baseDir).filter(f => f.endsWith('.json'));

let chineseLeftQuoteCount = 0;
let chineseRightQuoteCount = 0;
let asciiQuoteCount = 0;
let escapedQuoteCount = 0;
let filesWithChineseLeft = [];
let filesWithChineseRight = [];

for (const filename of files) {
    const filepath = path.join(baseDir, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    
    const chineseLeft = (content.match(/\u201C/g) || []).length;
    const chineseRight = (content.match(/\u201D/g) || []).length;
    const asciiQuotes = (content.match(/\x22/g) || []).length;
    const escapedQuotes = (content.match(/\\"/g) || []).length;
    
    if (chineseLeft > 0) {
        chineseLeftQuoteCount++;
        filesWithChineseLeft.push(filename);
    }
    if (chineseRight > 0) {
        chineseRightQuoteCount++;
        filesWithChineseRight.push(filename);
    }
    if (asciiQuotes > 0) {
        asciiQuoteCount++;
    }
    if (escapedQuotes > 0) {
        escapedQuoteCount++;
    }
}

console.log(`Total files checked: ${files.length}`);
console.log(`Files with Chinese left quote (\\u201C): ${chineseLeftQuoteCount}`);
console.log(`Files with Chinese right quote (\\u201D): ${chineseRightQuoteCount}`);
console.log(`Files with ASCII quote (0x22): ${asciiQuoteCount}`);
console.log(`Files with escaped quote (\\\\"): ${escapedQuoteCount}`);

if (filesWithChineseLeft.length > 0) {
    console.log('\nFiles with Chinese left quotes:');
    console.log(filesWithChineseLeft.slice(0, 5));
}
if (filesWithChineseRight.length > 0) {
    console.log('\nFiles with Chinese right quotes:');
    console.log(filesWithChineseRight.slice(0, 5));
}