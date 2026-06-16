import { transform } from 'lightningcss';

/**
 * Webpack loader that minifies CSS using lightningcss before raw-loader
 * wraps it as a JS string.
 */
function MinifyCssLoader(this: { async?: () => (err: Error | null, result?: string) => void }, source: string) {
    const cb = this.async && this.async();
    if (!cb) return source;

    try {
        const result = transform({
            filename: 'widget.css',
            code: Buffer.from(source, 'utf-8'),
            minify: true,
        });
        cb(null, result.code.toString('utf-8'));
    } catch {
        // Fall back to regex-based minification
        let css = source.replace(/\/\*[\s\S]*?\*\//g, '');
        css = css.replace(/\s+/g, ' ');
        css = css.replace(/\s*{\s*/g, '{');
        css = css.replace(/\s*}\s*/g, '}');
        css = css.replace(/\s*;\s*/g, ';');
        css = css.replace(/\s*:\s*/g, ':');
        css = css.replace(/\s*,\s*/g, ',');
        cb(null, css.trim());
    }
}

export default MinifyCssLoader;
