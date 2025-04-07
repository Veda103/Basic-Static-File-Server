// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const mimeTypes = require('./modules/mimeTypes');

const publicDir = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                const notFoundPath = path.join(publicDir, '404.html');
                fs.readFile(notFoundPath, (err404, notFoundContent) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(notFoundContent || '<h1>404 Not Found</h1>', 'utf8');
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));