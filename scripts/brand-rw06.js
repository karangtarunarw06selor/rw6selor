const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = new Set(['.html', '.js', '.css', '.json', '.php']);
const skipDirs = new Set(['.git', 'node_modules', 'vendor']);

const replacements = [
  ['https://rw6selor.org', 'https://rw6selor.org'],
  ['https://rw6selor.org', 'https://rw6selor.org'],
  ['rw6selor.org', 'rw6selor.org'],
  ['rw6selor.org', 'rw6selor.org'],
  ['Login Portal Admin - RW06 Selor', 'Login Portal Admin - RW06 Selor'],
  ['RW06 SELOR', 'RW06 SELOR'],
  ['RW06 SELOR', 'RW06 SELOR'],
  ['RW06 SELOR', 'RW06 SELOR'],
  ['Logo RW06 Selor', 'Logo RW06 Selor'],
  ['Aplikasi RW06 SELOR', 'Aplikasi RW06 Selor'],
  ['Portal RW06 Selor', 'Portal RW06 Selor'],
  ['RW06 Selor', 'RW06 Selor'],
  ['RW06 SELOR', 'RW06 SELOR'],
  ['RW06 Selor', 'RW06 Selor'],
  ['RW06 Selor', 'RW06 Selor'],
  ['RW06 Selor', 'RW06 Selor'],
  ['RW06 Selor', 'RW06 Selor'],
  ['RW06 Selor', 'RW06 Selor'],
  ['RW06 SELOR', 'RW06 SELOR'],
  ['RW06', 'RW06'],
  ['PORTAL WARGA', 'PORTAL WARGA'],
  ['Portal warga RW06 Selor', 'Portal warga RW06 Selor'],
];

function walk(dir) {
  const changed = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      changed.push(...walk(full));
      continue;
    }
    if (!entry.isFile() || !exts.has(path.extname(entry.name))) continue;
    const before = fs.readFileSync(full, 'utf8');
    let after = before;
    for (const [from, to] of replacements) {
      after = after.split(from).join(to);
    }
    if (after !== before) {
      fs.writeFileSync(full, after);
      changed.push(path.relative(root, full));
    }
  }
  return changed;
}

const changed = walk(root);
console.log(`brand files changed: ${changed.length}`);
for (const file of changed) console.log(file);
