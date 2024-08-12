const express = require('express');
const fs = require('fs');

const getCode = require('./utils');

const app = express();
const port = process.env.PORT || 5555;

const cutterTable = JSON.parse(fs.readFileSync('tabela_cutter.json', 'utf8'));
const phaTable = JSON.parse(fs.readFileSync('tabela_pha.json', 'utf8'));

app.get('/cutter/:authorName', (req, res) => {
    const authorName = req.params.authorName;
    const bookTitle = req.query.bookTitle;

    res.send(getCode(authorName, bookTitle, cutterTable));
});

app.get('/pha/:authorName', (req, res) => {
    const authorName = req.params.authorName;
    const bookTitle = req.query.bookTitle;

    res.send(getCode(authorName, bookTitle, phaTable));
});

app.listen(port, () => {
    console.log(`Server on http://localhost:${port}`);
});