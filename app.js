const express = require('express');
const fs = require('fs');

const {getCode, generateCutterCode} = require('./utils');

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
        response = {"result": generateCutterCode(authorName, bookTitle)};
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

app.get('/list', (req, res) => {
    const letter = req.query.letter;
    const test = req.query.test;
    const type = req.query.type;

    let response;

    if (type && ["cutter", "pha"].includes(type)) {
        let selectedTable = type === "cutter" ? cutterTable : phaTable;

        if (test && letter) {
            const tableStart = '<table>';
            const tableEnd = '</table>';

            const firstRowLetter= `<thead><tr><th colspan="2">${letter}</th><th>Código</th></tr></thead>`;
            const rows = Object.entries(selectedTable[letter]).map(([entry, code]) => {
                return `<tr><td><strong>${entry}</strong></td><td>${code}</td></tr>`;
            });

            response = tableStart + firstRowLetter + "<tbody>" + rows.join("") + "</tbody>" + tableEnd;
        } else if (letter) {
            response = selectedTable[letter];
        } else {
            response = selectedTable;
        }
    } else {
        response = "Tipo inválido";
    }

    res.send(response);
});

app.listen(port, () => {
    console.log(`Server on http://localhost:${port}`);
});