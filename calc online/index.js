const express = require('express');

const session = require('express-session');

require('dotenv').config();
const secret = process.env.SECRET;

const app = express();

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

module.exports = app;   