const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('data/knowledge/g2_chinese_recite_upper.json', 'utf8'));
    console.log('g2_chinese_recite_upper.json: OK,', data.length, 'items');
} catch(e) {
    console.error('g2_chinese_recite_upper.json: ERROR -', e.message);
}
try {
    const data = JSON.parse(fs.readFileSync('data/knowledge/g2_chinese_recite_lower.json', 'utf8'));
    console.log('g2_chinese_recite_lower.json: OK,', data.length, 'items');
} catch(e) {
    console.error('g2_chinese_recite_lower.json: ERROR -', e.message);
}
