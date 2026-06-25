const fs = require('fs');
const path = require('path');

// 检查zip文件
const zipPath = 'd:/obj/学生复习.zip';

try {
    // 读取zip文件（zip格式）
    const buffer = fs.readFileSync(zipPath);
    
    // 检查是否有效的zip文件
    // ZIP文件以 PK (0x50 0x4B) 开头
    console.log('File header:', buffer.slice(0, 4).toString('hex'));
    console.log('File size:', buffer.length);
    
    // 检查local file header签名
    const sig = buffer.slice(0, 4).toString('hex');
    if (sig === '504b0304') {
        console.log('Valid ZIP file');
    } else {
        console.log('Not a standard ZIP file');
    }
    
    // 尝试找第一个文件
    let offset = 0;
    while (offset < buffer.length - 4) {
        const possibleSig = buffer.slice(offset, offset + 4).toString('hex');
        if (possibleSig === '504b0304') {
            // 找到local file header
            // 跳过到文件名
            const filenameLen = buffer.readUInt16LE(offset + 26);
            const extraLen = buffer.readUInt16LE(offset + 28);
            const filename = buffer.slice(offset + 30, offset + 30 + filenameLen).toString('utf8');
            console.log('First file:', filename);
            break;
        }
        offset++;
    }
} catch (e) {
    console.log('Error:', e.message);
}