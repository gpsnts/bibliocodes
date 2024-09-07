function authorNameFormatter(author) {
    return author.trim().split(/[\s,]+/).map((word, index) =>
        index === 0
            ? capitalizeFirstLetter(word)
            : word.toLowerCase()
    ).join("");
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function findMatches(entriesArray, query) {
    return entriesArray.filter(([key]) => key.startsWith(query));
}

function generateCode(author, table, title) {
    const sanitizedAuthorName = authorNameFormatter(author);
    const letterSubTable = table[sanitizedAuthorName[0]];
    const entriesArray = Object.entries(letterSubTable);

    let currentSubstring = sanitizedAuthorName[0];
    let previousMatches = entriesArray;

    for (let i = 1; i < sanitizedAuthorName.length; i++) {
        currentSubstring += sanitizedAuthorName[i];
        const currentMatches = findMatches(previousMatches, currentSubstring);

        if (currentMatches.length === 0) break;
        previousMatches = currentMatches;
    }

    const exactMatch = previousMatches.find(([key]) => key === currentSubstring);

    if (!exactMatch && previousMatches.length > 1) {
        const lastChar = currentSubstring.slice(-1);
        const closestEntry = previousMatches
            .filter(([key]) => key.slice(-1) < lastChar)
            .reduce((acc, curr) => parseInt(curr[1]) > parseInt(acc[1]) ? curr : acc, previousMatches[0]);

        return buildCode(sanitizedAuthorName[0], closestEntry[1], title);
    }

    const result = previousMatches[0][1];
    return buildCode(sanitizedAuthorName[0], result, title);
}

function buildCode(initial, match, title) {
    return title ? `${initial}${match}${title[0].toLowerCase()}` : `${initial}${match}`;
}

module.exports = { generateCode };
