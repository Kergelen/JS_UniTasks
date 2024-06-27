const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const url = require('url');

storedKeys = [];

const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;
    if (req.method === 'POST' && path === '/generatekey') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { key } = JSON.parse(body);
            storedKeys.push(key);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
    } else if (path === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: 404 - Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (path === '/authorize') {
        fs.readFile('authorize.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: 404 - Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (path === '/generatekey') {
        fs.readFile('generatekey.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: 404 - Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (path === '/styles.css') {
        fs.readFile('styles.css', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: 404 - Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else if (path === '/script.js') {
        fs.readFile('script.js', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: 404 - Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else if (path === '/authorize.js') {
        fs.readFile('authorize.js', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: 404 - Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else if (path === '/generatekey.js') {
        fs.readFile('generatekey.js', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: 404 - Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - Not Found");
    }
});

const wss = new WebSocket.Server({ server });

const votes = {};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if (!isValidKey(data.key)) {
            console.log('Invalid key:', data.key);
            return;
        }
        if (votes[data.candidate]) {
            votes[data.candidate]++;
        } else {
            votes[data.candidate] = 1;
        }

        storedKeys = storedKeys.filter(key => key !== data.key);
        
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(votes));
            }
        });
    });
});

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});

function isValidKey(key) {
    return storedKeys.includes(key);
}
