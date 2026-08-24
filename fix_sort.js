const fs = require('fs');

const dir = 'back/src/services';
const files = fs.readdirSync(dir).map(f => dir + '/' + f).filter(f => f.endsWith('.js'));
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    if (content.includes('sort({ averageRating: -1 })')) {
        content = content.replace(/sort\(\{ averageRating: -1 \}\)/g, 'sort({ averageRating: -1, _id: 1 })');
        modified = true;
    }
    if (content.includes('sort({ startDate: 1 })')) {
        content = content.replace(/sort\(\{ startDate: 1 \}\)/g, 'sort({ startDate: 1, _id: 1 })');
        modified = true;
    }
    if (content.includes('sort({ rating: -1 })')) {
        content = content.replace(/sort\(\{ rating: -1 \}\)/g, 'sort({ rating: -1, _id: 1 })');
        modified = true;
    }
    if (content.includes('sort({ createdAt: -1 })')) {
        content = content.replace(/sort\(\{ createdAt: -1 \}\)/g, 'sort({ createdAt: -1, _id: 1 })');
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed sort in', file);
    }
}
console.log('Done!');

