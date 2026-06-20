import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist', 'components');
const target = path.resolve(
    import.meta.dirname,
    '..',
    'src',
    'django_hstore_widget',
    'static',
    'admin',
    'js',
    'django_hstore_widget',
);

if (!fs.existsSync(dist)) {
    console.error('ERROR: dist/components not found. Run `npm run build` first.');
    process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true, maxRetries: 2 });
fs.mkdirSync(target, { recursive: true });

const files = fs.readdirSync(dist).filter((f) => /\.(js|css|LICENSE)/.test(f));

if (!files.length) {
    console.error('ERROR: No files found in dist/components.');
    process.exit(1);
}

let copied = 0;
let skipped = 0;

for (const f of files) {
    const src = path.join(dist, f);
    const stat = fs.statSync(src);

    if (stat.size === 0) {
        console.log(`SKIP (empty): ${f}`);
        skipped++;
        continue;
    }

    const dest = path.join(target, f);
    fs.cpSync(src, dest);
    console.log(`COPY: ${f} (${(stat.size / 1024).toFixed(1)} KiB)`);
    copied++;
}

console.log(`\nDone: ${copied} copied, ${skipped} skipped.`);
