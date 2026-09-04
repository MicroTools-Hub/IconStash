const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'icons');

function main() {
  const t0 = Date.now();
  console.log('Reading icons directory...');
  const subdirs = fs.readdirSync(ICONS_DIR);
  console.log(`Total items in icons/: ${subdirs.length}`);

  let totalIndexHtml = 0;
  let updatedFiles = 0;
  let alreadyUpdated = 0;
  let targetOccurrences = 0;

  const target = 'content="https://iconstash.io/logo.png"';
  const replacement = 'content="https://iconstash.io/og-default.png"';

  for (let i = 0; i < subdirs.length; i++) {
    const p = path.join(ICONS_DIR, subdirs[i], 'index.html');
    if (fs.existsSync(p)) {
      totalIndexHtml++;
      const content = fs.readFileSync(p, 'utf8');
      if (content.includes(target)) {
        const count = content.split(target).length - 1;
        targetOccurrences+= count;
        const updated = content.split(target).join(replacement);
        fs.writeFileSync(p, updated, 'utf8');
        updatedFiles++;
      } else if (content.includes(replacement)) {
        alreadyUpdated++;
      }
    }
    if ((i + 1) % 25000 === 0) {
      console.log(`Checked ${i + 1}/${subdirs.length} dirs... (${updatedFiles} files updated so far)`);
    }
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log('--- Summary ---');
  console.log(`Total directories: ${subdirs.length}`);
  console.log(`Total index.html found: ${totalIndexHtml}`);
  console.log(`Files updated: ${updatedFiles}`);
  console.log(`Total target strings replaced: ${targetOccurrences}`);
  console.log(`Files already using og-default.png: ${alreadyUpdated}`);
  console.log(`Elapsed time: ${elapsed}s`);
}

main();