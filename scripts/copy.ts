import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist', 'components');
const target = path.resolve(import.meta.dirname, '..', 'src', 'django_hstore_widget', 'static', 'admin', 'js', 'django_hstore_widget');

fs.rmSync(target, { recursive: true, force: true, maxRetries: 2 });
fs.mkdirSync(target, { recursive: true });

const files = fs.readdirSync(dist).filter(f => f.endsWith('.js'));

if (!files.length) throw new Error('No JS files found. Re-run `npm run build`');

let n = 0;
for (const f of files) {
    const src = path.join(dist, f);
    fs.statSync(src).size > 0 && (fs.cpSync(src, path.join(target, f)), n++);
}

n ? console.log('DONE') : console.warn('No non-empty files copied');
