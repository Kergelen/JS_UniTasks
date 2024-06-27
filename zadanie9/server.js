const http = require('http');
const WebSocket = require('ws');
const fs = require('fs').promises; // Użycie wersji z Obietnicami - zwraca Obietnice zamiast używania funkcji zwrotnych
const url = require('url');
const mariadb = require('mariadb');
const multer = require('multer');
const upload = multer();

const storedKeys = [];

const pool = mariadb.createPool({
    host: 'localhost',
    port: 1500,
    user: 'root',
    password: '123321',
    database: 'example',
});

async function createTable() {
    let conn;
    try {
        conn = await pool.getConnection(); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        console.log("Database created.");
        await conn.query(`
            CREATE TABLE IF NOT EXISTS entries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                surname VARCHAR(255),
                phone VARCHAR(255),
                email VARCHAR(255)
            )
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                vote VARCHAR(255)
            )
        `);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

createTable().catch(console.error);

const server = http.createServer(async (req, res) => {
    const path = url.parse(req.url).pathname;
    if (req.method === 'POST' && path === '/generatekey') {
        const body = await getRequestBody(req); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        const { key } = JSON.parse(body); // Destrukturyzacja obiektu - wyodrębnia właściwość 'key' z obiektu
        storedKeys.push(key);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
    } else if (req.method === 'POST' && path === '/add-entry') {
        upload.none()(req, res, async () => {
            const { name, surname, phone, email } = req.body; // Destrukturyzacja obiektu - wyodrębnia właściwości z obiektu req.body
            let conn;
            try {
                conn = await pool.getConnection();
                await conn.query(`
                    INSERT INTO entries (name, surname, phone, email) 
                    VALUES (?, ?, ?, ?)
                `, [name, surname, phone, email]);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false }));
            } finally {
                if (conn) conn.end();
            }
        });
    } else if (path === '/') {
        const data = await fs.readFile('index.html'); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    } else if (path === '/authorize') {
        const data = await fs.readFile('authorize.html'); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    } else if (path === '/generatekey') {
        const data = await fs.readFile('generatekey.html'); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    } else if (path === '/styles.css') {
        const data = await fs.readFile('styles.css'); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
    } else if (path === '/script.js') {
        const data = await fs.readFile('script.js'); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
    } else if (path === '/authorize.js') {
        const data = await fs.readFile('authorize.js'); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
    } else if (path === '/generatekey.js') {
        const data = await fs.readFile('generatekey.js'); // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
    } else {
        res.writeHead(404);
        res.end("Error: 404 - Not Found");
    }
});

const wss = new WebSocket.Server({ server });

const votes = {};

wss.on('connection', function connection(ws) {
    ws.on('message', async function incoming(message) {
        const data = JSON.parse(message);
        if (!isValidKey(data.key)) {
            console.log('Invalid key:', data.key);
            return;
        }

        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(`
                INSERT INTO votes (vote) VALUES (?)
            `, [data.candidate]);
        } catch (err) {
            console.error(err);
        } finally {
            if (conn) conn.end();
        }

        if (votes[data.candidate]) {
            votes[data.candidate]++;
        } else {
            votes[data.candidate] = 1;
        }

        storedKeys.splice(storedKeys.indexOf(data.key), 1); // Użycie metody splice do usunięcia elementu z tablicy

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
    return storedKeys.includes(key); // Metoda includes sprawdza, czy element znajduje się w tablicy
}

// Funkcja pomocnicza do odczytu ciała żądania
async function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body); // Resolve rozwiązuje Obietnicę, zwracając ciało żądania
        });
        req.on('error', (err) => {
            reject(err); // Reject odrzuca Obietnicę w przypadku błędu
        });
    });
}