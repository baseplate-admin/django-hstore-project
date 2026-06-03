import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname);
const DIST_DIR = path.resolve(BASE_DIR, '..', 'dist', 'components');
const TARGET_DIR = path.resolve(BASE_DIR, '..', 'src', 'django_hstore_widget', 'static', 'admin', 'js', 'django_hstore_widget');

try {
    // Remove target directory if exists
    if (fs.existsSync(TARGET_DIR)) {
        fs.rmSync(TARGET_DIR, { recursive: true, force: true });
    }

    // Create target directory
    fs.mkdirSync(TARGET_DIR, { recursive: true });

    // Find JS files in dist directory
    const files = fs
        .readdirSync(DIST_DIR)
        .filter(file => file.endsWith('.js'))
        .map(file => path.join(DIST_DIR, file));

    if (files.length === 0) {
        throw new Error('There are no js files. Re-Run `npm run build`');
    }

    // Copy files
    let copiedCount = 0;
    for (const file of files) {
        const stats = fs.statSync(file);
        if (stats.size > 0) {
            const targetFile = path.join(TARGET_DIR, path.basename(file));
            fs.copyFileSync(file, targetFile);
            copiedCount++;
        }
    }

    if (copiedCount > 0) {
        console.log('DONE');
    } else {
        console.warn('No non-empty files were copied');
    }
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
