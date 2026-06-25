const fs = require('fs');
const path = require('path');

const zipPath = 'd:/obj/学生复习.zip';
const outputDir = 'd:/obj/学生复习/data/examples_backup';

try {
    fs.mkdirSync(outputDir, { recursive: true });
} catch (e) {}

const buffer = fs.readFileSync(zipPath);

// ZIP文件解析
// 找到所有local file header
let offset = 0;
let fileCount = 0;
const files = [];

while (offset < buffer.length - 4) {
    const sig = buffer.slice(offset, offset + 4).toString('hex');
    
    if (sig === '504b0304') {
        // Local file header
        const version = buffer.readUInt16LE(offset + 4);
        const flags = buffer.readUInt16LE(offset + 6);
        const compression = buffer.readUInt16LE(offset + 8);
        const modTime = buffer.readUInt16LE(offset + 10);
        const modDate = buffer.readUInt16LE(offset + 12);
        const crc32 = buffer.readUInt32LE(offset + 14);
        const compressedSize = buffer.readUInt32LE(offset + 18);
        const uncompressedSize = buffer.readUInt32LE(offset + 22);
        const filenameLen = buffer.readUInt16LE(offset + 26);
        const extraLen = buffer.readUInt16LE(offset + 28);
        
        const filenameBuffer = buffer.slice(offset + 30, offset + 30 + filenameLen);
        const filename = filenameBuffer.toString('utf8');
        
        const dataOffset = offset + 30 + filenameLen + extraLen;
        
        files.push({
            filename,
            offset: dataOffset,
            compressedSize,
            uncompressedSize,
            compression
        });
        
        fileCount++;
        
        // 移动到下一个header (考虑数据描述符如果存在)
        offset = dataOffset + compressedSize;
        
        // 跳过数据描述符（如果flags的第3位被设置）
        if (flags & 0x0008) {
            // 数据描述符存在，跳过12字节 (CRC32 + 压缩大小 + 未压缩大小)
            offset += 12;
        }
    } else if (sig === '504b0102') {
        // Central directory file header - 停止
        break;
    } else {
        offset++;
    }
}

console.log(`Found ${fileCount} files in ZIP`);

// 只提取examples目录下的json文件
const jsonFiles = files.filter(f => f.filename.includes('data/examples/') && f.filename.endsWith('.json'));
console.log(`Found ${jsonFiles.length} JSON files in data/examples/`);

if (jsonFiles.length > 0) {
    console.log('First 5 files:');
    jsonFiles.slice(0, 5).forEach(f => console.log('  ', f.filename));
    
    // 尝试解压第一个文件作为测试
    const firstFile = jsonFiles[0];
    console.log('\nTrying to extract first file:', firstFile.filename);
    
    // 如果是deflate压缩 (compression = 8)
    if (firstFile.compression === 8) {
        console.log('File is deflate compressed');
        console.log('Compressed size:', firstFile.compressedSize);
        console.log('Uncompressed size:', firstFile.uncompressedSize);
    }
}