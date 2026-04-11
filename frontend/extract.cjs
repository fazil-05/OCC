const fs = require('fs');
const content = fs.readFileSync('lusion.htm', 'utf8');
const urls = content.match(/https?:\/\/[^\s"'()]+/g) || [];
const mediaExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.webm', '.ogg'];
const uniqueRefs = [...new Set(urls)].filter(u => mediaExts.some(ext => u.toLowerCase().endsWith(ext) || u.toLowerCase().includes(ext + '?')));
fs.writeFileSync('extracted_media_refs.txt', uniqueRefs.join('\n'), 'utf8');
console.log('Extracted ' + uniqueRefs.length + ' references.');
