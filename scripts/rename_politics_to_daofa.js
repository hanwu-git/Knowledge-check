const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join('data', 'knowledge');
const EXAMPLES_DIR = path.join('data', 'examples');

function renameAndReplace(dir, oldPrefix, newPrefix, filePattern) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith(filePattern));
  
  for (const file of files) {
    const oldPath = path.join(dir, file);
    const newFile = file.replace(oldPrefix, newPrefix);
    const newPath = path.join(dir, newFile);
    
    let content = fs.readFileSync(oldPath, 'utf8');
    content = content.split(oldPrefix).join(newPrefix);
    
    fs.writeFileSync(newPath, content, 'utf8');
    fs.unlinkSync(oldPath);
    
    console.log(`已转换: ${file} -> ${newFile}`);
  }
  
  return files.length;
}

console.log('=== 知识点文件 ===');
const kCount = renameAndReplace(KNOWLEDGE_DIR, 'g3_politics', 'g3_daofa', 'g3_politics');
console.log(`共转换 ${kCount} 个知识点文件\n`);

console.log('=== 例题文件 ===');
const eCount = renameAndReplace(EXAMPLES_DIR, 'g3_politics', 'g3_daofa', 'g3_politics');
console.log(`共转换 ${eCount} 个例题文件\n`);

console.log('全部转换完成！');
