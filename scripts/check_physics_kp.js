const fs = require('fs');
const path = require('path');

const kDir = 'data/knowledge';
const eDir = 'data/examples';

// 读取初二物理上册知识点
const upper = JSON.parse(fs.readFileSync(path.join(kDir, 'g2_physics_upper.json'), 'utf8'));

// 输出006-028的知识点名称和解释，供生成答案参考
for (let i = 5; i <= 27; i++) {  // 索引从0开始，006是第5个
    const kp = upper[i];
    console.log('---');
    console.log('ID: ' + kp.id + ' (' + (i+1) + ')');
    console.log('名称: ' + kp.name);
    console.log('公式: ' + (kp.formula || '(无)'));
    console.log('解释(前200字): ' + (kp.explanation || '').slice(0, 200));
    console.log('');
}
