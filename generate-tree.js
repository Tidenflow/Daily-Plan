const fs = require('fs');
const path = require('path');

function walkDir(dir, basePath = '') {
  const result = { tree: [] };

  function traverse(currentPath, relativePath = '') {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(currentPath, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        traverse(fullPath, relPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        result.tree.push({ path: relPath, type: 'blob' });
      }
    }
  }

  traverse(dir);
  return result;
}

const tree = walkDir('.');
fs.writeFileSync('tree.json', JSON.stringify(tree, null, 2));
console.log('tree.json generated with', tree.tree.length, 'files');