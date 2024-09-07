function authorNameFormatter(author) {
    return author
        .trim()
        .split(/[\s,]+/)
        .map((word, index) => 
            index === 0
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word.toLowerCase()
        )
        .join("");
}

function findMatches(entriesArray, query) {
    return entriesArray.filter(([key]) => key.startsWith(query));
}

function generateCode(author, table, title) {
    const sanitizedAuthorName = authorNameFormatter(author);
    const letterSubTable = table[sanitizedAuthorName[0]];
    const entriesArray = Object.entries(letterSubTable);
    
    let currentSubstring = sanitizedAuthorName[0];
    let previousMatches = [];

    for (let i = 1; i < sanitizedAuthorName.length; i++) {
        currentSubstring += sanitizedAuthorName[i];
        const currentMatches = findMatches(previousMatches.length > 0 ? previousMatches : entriesArray, currentSubstring);

        if (currentMatches.length === 0 || (previousMatches.length === 1 && currentMatches.length === 0)) break;
        previousMatches = currentMatches;
    }

    let exactMatch = previousMatches.find(subArray => subArray[0] === currentSubstring);
    
    if (previousMatches.length > 1 && !exactMatch) {
        const lastChar = currentSubstring.slice(-1);
        const filteredMatches = previousMatches.filter(([key]) => key.slice(-1) < lastChar);

        if (filteredMatches.length > 0) {
            const closestEntry = filteredMatches.reduce((acc, current) =>
                parseInt(current[1]) > parseInt(acc[1]) ? current : acc
            );
    
            let code = sanitizedAuthorName[0] + closestEntry[1];
            return title ? code + title[0].toLowerCase() : code;
        }
    }

    let result = previousMatches.map(([_, value]) => value)[0];
    let code = sanitizedAuthorName[0] + result;

    return title ? code + title[0].toLowerCase() : code;
}


module.exports = { generateCode };
