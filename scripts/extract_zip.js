const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 首先尝试用PowerShell解压
const zipPath = 'd:/obj/学生复习.zip';
const extractDir = 'd:/obj/学生复习/data/examples_backup';

// 创建备份目录
try {
    fs.mkdirSync(extractDir, { recursive: true });
} catch (e) {
    // 目录可能已存在
}

// 使用PowerShell的Compress-Archive来提取（但我们需要的是Expand-Archive）
// 由于沙盒限制，我们尝试使用Node.js的adm-zip或其他方法

// 首先检查是否有adm-zip
try {
    const admZip = require('adm-zip');
    const zip = new admZip(zipPath);
    zip.extractAllTo(extractDir, true);
    console.log('Extracted with adm-zip');
} catch (e) {
    console.log('adm-zip not available:', e.message);
    // 尝试使用PowerShell
    try {
        const cmd = `powershell -ExecutionPolicy Bypass -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}' -Force"`;
        execSync(cmd, { encoding: 'utf8' });
        console.log('Extracted with PowerShell');
    } catch (e2) {
        console.log('PowerShell failed:', e2.message);
    }
}

// 检查解压结果
const files = fs.readdirSync(extractDir);
console.log('Extracted files count:', files.length);
if (files.length > 0) {
    console.log('First few files:', files.slice(0, 5));
}