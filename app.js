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

    let response;

    if (req.query.test) {
        response = `<h1 style="font-size: 12em;">${getCode(authorName, bookTitle, cutterTable)}</h1>`;
    } else {
        response = {"result": getCode(authorName, bookTitle, cutterTable)};
    }

    res.send(response);
});

app.get('/pha/:authorName', (req, res) => {
    const authorName = req.params.authorName;
    const bookTitle = req.query.bookTitle;

    let response;

    if (req.query.test) {
        response = `<h1 style="font-size: 12em;">${getCode(authorName, bookTitle, phaTable)}</h1>`
    } else {
        response = {"result": getCode(authorName, bookTitle, phaTable)};
    }
    
    res.send(response);
});

app.listen(port, () => {
    console.log(`Server on http://localhost:${port}`);
});