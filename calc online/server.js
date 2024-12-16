const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Attach Socket.IO to the HTTP server

const PORT = 3000;

// Path to JSON file
const DATA_FILE = './button_clicks.json';

// Function to load data from JSON file
function loadClicks() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({})); // Create empty JSON if it doesn't exist
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Function to save data to JSON file
function saveClicks(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (frontend)

// API to log button clicks
app.post('/log-click', (req, res) => {
    const button = req.body.button;

    // Load current click data
    const clicks = loadClicks();

    // Update button click count
    clicks[button] = (clicks[button] || 0) + 1;

    // Save updated data back to file
    saveClicks(clicks);

    // Emit the updated stats to all connected clients via Socket.IO
    io.emit('stats-update', clicks);

    res.status(200).send('Button click logged');
});

// API to retrieve statistics
app.get('/stats', (req, res) => {
    const clicks = loadClicks(); // Load data from file
    res.status(200).json(clicks);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send current statistics when a user connects
    socket.emit('stats-update', loadClicks());

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
