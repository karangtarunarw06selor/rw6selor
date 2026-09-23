const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'Dockerfile',
  'Dockerfile.node',
  'docker-compose.yml',
  'index.html',
  'config.php',
  'api/config.php',
  'db-init/01-mudamudi-common.sql',
  'sql/mudamudi_common_SAFE_UPDATE.sql',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`${file} missing`);
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!index.includes('RW06 Selor') || index.includes('BPH MMS 05')) {
  throw new Error('index branding is not RW06 Selor clean');
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
if (manifest.name !== 'RW06 Selor' || manifest.theme_color !== '#0f5ea8') {
  throw new Error('manifest branding/theme mismatch');
}

const compose = fs.readFileSync(path.join(root, 'docker-compose.yml'), 'utf8');
for (const needle of ['rw6selor-db', 'mariadb:11.4', 'rw6selor-db-data', './sql:/rw6-data/sql:ro']) {
  if (!compose.includes(needle)) {
    throw new Error(`docker-compose missing ${needle}`);
  }
}

const dbInit = fs.readFileSync(path.join(root, 'db-init/01-mudamudi-common.sql'), 'utf8');
if (!dbInit.includes('/rw6-data/sql/mudamudi_common_SAFE_UPDATE.sql')) {
  throw new Error('database init does not source Mudamudi RW06 data');
}

const style = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
if (!style.includes('#0f5ea8') || !style.includes('radial-gradient(circle at top')) {
  throw new Error('blue theme styles missing');
}

console.log('rw06 deployment smoke test passed');
