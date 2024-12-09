const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // HTTP server pro Express a Socket.IO
const io = new Server(server); // Socket.IO server
const PORT = 3000;

// Cesta k JSON souboru
const DATA_FILE = './button_clicks.json';

// Funkce pro načtení dat ze souboru JSON
function loadClicks() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({})); // Pokud soubor neexistuje, vytvoříme prázdný objekt
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Funkce pro uložení dat do souboru JSON
function saveClicks(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Statické soubory (frontend)

// API pro záznam kliknutí
app.post('/log-click', (req, res) => {
    const button = req.body.button;

    // Načteme aktuální data ze souboru
    const clicks = loadClicks();

    // Aktualizujeme počet kliknutí
    clicks[button] = (clicks[button] || 0) + 1;

    // Uložíme aktualizovaná data zpět do souboru
    saveClicks(clicks);

    // Odesíláme aktuální statistiky všem klientům přes WebSocket
    io.emit('stats-update', clicks);

    res.status(200).send('Button click logged');
});

// Endpoint pro získání statistik (pro prvotní načtení)
app.get('/stats', (req, res) => {
    const clicks = loadClicks(); // Načteme data ze souboru
    res.status(200).json(clicks);
});

// Spuštění serveru
server.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
