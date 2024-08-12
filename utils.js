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

module.exports = getCode;