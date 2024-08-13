const redBlackTree = require('functional-red-black-tree');

function authorNameFormatter(author) {
    let words = author.trim().split(/[\s,]+/);
    for (let i = 0; i < words.length; i++) {
        if (i === 0) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        } else {
            words[i] = words[i].toLowerCase();
        }
    }
    return words.join("");
}

function loadTree(table) {
    const index = {};
    for (const [letter, entries] of Object.entries(table)) {
        const tree = Object.entries(entries).reduce(
            (subAcc, [entry, callNumber]) => subAcc.insert(entry, callNumber),
            redBlackTree()
        );

        index[letter] = tree;
    }
    return index;
}

function getCode(authorName, bookTitle, currentTable) {
    const table = loadTree(currentTable);
    const sanitizedAuthorName = authorNameFormatter(authorName);

    const letterTableTree = table[sanitizedAuthorName[0]];

    if (!letterTableTree) {
        throw new Error(`Tabela não encontrada para a letra inicial: ${sanitizedAuthorName[0]}`);
    }

    let code = sanitizedAuthorName[0] + letterTableTree.le(sanitizedAuthorName).value;

    if (bookTitle) {
        code = code + bookTitle[0].toLowerCase();
    }

    return code;
}

const fs = require('fs');

const data = fs.readFileSync('tabela_cutter.json', 'utf8');
const cutterTable = JSON.parse(data);

function authorNameFormatter(author) {
    let words = author.trim().split(/[\s,]+/);
    for (let i = 0; i < words.length; i++) {
        if (i === 0) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        } else {
            words[i] = words[i].toLowerCase();
        }
    }
    return words.join("");
}


function findMatches(entriesArray, query) {
    return entriesArray.filter(([key, value]) => key.startsWith(query));
}

function generateCutterCode(author, title) {
    const sanitizedAuthorName = authorNameFormatter(author);
    const cutterLetterTable = cutterTable[sanitizedAuthorName[0]];

    if (!cutterLetterTable) {
        throw new Error(`Tabela Cutter não encontrada para a letra inicial: ${sanitizedAuthorName[0]}`);
    }

    let currentSubstring = sanitizedAuthorName[0];
    let previousMatches = [];

    const entriesArray = Object.entries(cutterLetterTable);

    for (let i = 1; i < sanitizedAuthorName.length; i++) {
        currentSubstring += sanitizedAuthorName[i];
        const currentMatches = previousMatches.lenght > 0 ? findMatches(previousMatches, currentSubstring) : findMatches(entriesArray, currentSubstring);

        if (currentMatches.length === 0 || (previousMatches.length === 1 && currentMatches.length === 0)) {
            break;
        }

        previousMatches = currentMatches;
    }

    const result = previousMatches
        .map(([key, value]) => ({ [key]: value }))
        .map((obj) => Object.values(obj));

    let cutterCode = sanitizedAuthorName[0] + result[0];

    if (title) {
        cutterCode += title[0].toLowerCase();
    }

    return cutterCode;
}

module.exports = {getCode, generateCutterCode};
