import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '..', 'dist', 'components');
const port = Number(process.env.PORT) || 9101;

if (!fs.existsSync(distPath)) {
    console.error('ERROR: dist/components not found. Run `npm run build` first.');
    process.exit(1);
}

const mimeTypes: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
};

// Serve a test HTML page at root
const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Django HStore Widget Preview</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 2rem; background: #1a1a2e; color: #c9d1d9; }
        h1 { color: #58a6ff; }
        .widget-container { margin: 2rem 0; padding: 1.5rem; border: 1px solid #30363d; border-radius: 8px; }
        pre { background: #0d1117; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Django HStore Widget Preview</h1>
    <p>Test the widget with sample JSON data.</p>

    <div class="widget-container">
        <h2>Empty JSON</h2>
        <django-hstore-widget json='{}'></django-hstore-widget>
    </div>

    <div class="widget-container">
        <h2>Sample Data</h2>
        <django-hstore-widget json='{"name": "John Doe", "email": "john@example.com", "role": "admin"}'></django-hstore-widget>
    </div>

    <div class="widget-container">
        <h2>Nested-like Keys</h2>
        <django-hstore-widget json='{"user.name": "Jane", "user.email": "jane@example.com", "user.role": "editor", "settings.theme": "dark"}'></django-hstore-widget>
    </div>

    <div class="widget-container">
        <h2>Invalid JSON (error state)</h2>
        <django-hstore-widget json='{invalid json here}'></django-hstore-widget>
    </div>

    <script type="module" src="/components/django-hstore-widget.js"></script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Root serves test HTML
    if (pathname === '/') {
        res.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
        res.end(testHtml);
        return;
    }

    // Serve static files from dist/components (strip /components/ prefix)
    const relativePath = pathname.replace(/^\/components\//, '');
    const filePath = path.join(distPath, relativePath);
    const ext = path.extname(filePath);

    if (!filePath.startsWith(distPath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const data = fs.readFileSync(filePath);

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
});

server.listen(port, () => {
    console.log(`Preview server running at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop.');
});
