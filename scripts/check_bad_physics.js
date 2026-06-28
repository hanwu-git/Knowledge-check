const fs = require('fs');
const path = require('path');

const dir = 'data/examples';

for (let i = 6; i <= 28; i++) {
    const idx = String(i).padStart(3, '0');
    const file = 'g2_physics_' + idx + '_010.json';
    const filePath = path.join(dir, file);
    
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const ex09 = data.find(e => e.id === 'g2_physics_' + idx + '_ex09');
        if (ex09) {
            console.log(file + ':');
            console.log('  题目: ' + ex09.question.slice(0, 80) + '...');
            console.log('  答案: ' + ex09.answer.slice(0, 80) + '...');
            console.log('');
        }
    }
}
