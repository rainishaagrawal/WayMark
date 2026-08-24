const fs = require('fs');
const path = require('path');

const dir = 'back/src/services';
const files = fs.readdirSync(dir).map(f => path.join(dir, f)).filter(f => f.endsWith('.js'));
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if the file has pagination
    if (content.includes('parseInt(page, 10) - 1')) {
        content = content.replace(/const skip = \(parseInt\(page, 10\) - 1\) \* parseInt\(limit, 10\);/g, 'const pageNumber = Math.max(1, parseInt(page, 10) || 1);\n  const limitNumber = Math.max(1, parseInt(limit, 10) || 10);\n  const skip = (pageNumber - 1) * limitNumber;');
        
        content = content.replace(/limit\(parseInt\(limit, 10\)\)/g, 'limit(limitNumber)');
        
        content = content.replace(/page:\s*parseInt\(page,\s*10\)/g, 'page: pageNumber');
        content = content.replace(/limit:\s*parseInt\(limit,\s*10\)/g, 'limit: limitNumber');
        content = content.replace(/totalPages:\s*Math\.ceil\([^/]+\/\s*[^)]+\)/g, 'totalPages: Math.ceil(count / limitNumber)');
        
        content = content.replace(/Math\.ceil\(count \/ limitNumber\)/g, (match, offset, str) => {
            if (str.includes('total, page:')) {
                return 'Math.ceil(total / limitNumber)';
            }
            return match;
        });

        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed pagination in', file);
    }
}
