// Utility to generate a simple crossword layout
// Input: List of words (objects with {word, clue})
// Output: Layout object { width, height, words: [{id, text, direction, x, y, clue}] }

export const generateCrossword = (wordList, maxWords = 5) => {
    let bestLayout = null;
    let maxPlaced = 0;

    // Try up to 20 times to generate a good layout
    for (let attempt = 0; attempt < 20; attempt++) {
        const layout = tryGenerate(wordList, maxWords);
        if (layout && layout.words.length > maxPlaced) {
            maxPlaced = layout.words.length;
            bestLayout = layout;
            // If we hit our target, stop early
            if (maxPlaced >= maxWords) break;
        }
    }

    return bestLayout; // Return best found, or null
};

const tryGenerate = (wordList, maxWords) => {
    // 1. Pick a random start word
    const availableWords = [...wordList].sort(() => Math.random() - 0.5);
    const grid = {}; // 'x,y': char
    const placedWords = [];

    if (availableWords.length === 0) return null;

    // Place first word horizontally at 0,0
    const firstWord = availableWords.pop();
    placedWords.push({
        id: 1,
        text: firstWord.word,
        direction: 'H',
        x: 0,
        y: 0,
        clue: firstWord.clue
    });

    // Mark grid
    for (let i = 0; i < firstWord.word.length; i++) {
        grid[`${i},0`] = firstWord.word[i];
    }

    // 2. Try to place subsequent words
    let attempts = 0;
    while (placedWords.length < maxWords && availableWords.length > 0 && attempts < 200) {
        attempts++;
        const candidate = availableWords[0];
        let placed = false;

        // Try to intersect with existing placed words
        for (let pWord of placedWords) {
            if (placed) break;

            // Check every char match between candidate and pWord
            for (let i = 0; i < candidate.word.length; i++) {
                if (placed) break;
                for (let j = 0; j < pWord.text.length; j++) {
                    if (candidate.word[i] === pWord.text[j]) {
                        // Intersection found
                        const newDir = pWord.direction === 'H' ? 'V' : 'H';
                        let nx, ny;

                        if (pWord.direction === 'H') {
                            nx = pWord.x + j;
                            ny = pWord.y - i;
                        } else {
                            nx = pWord.x - i;
                            ny = pWord.y + j;
                        }

                        // Validate Placement
                        if (isValidPlacement(candidate.word, newDir, nx, ny, grid)) {
                            // Place it
                            const newEntry = {
                                id: placedWords.length + 1,
                                text: candidate.word,
                                direction: newDir,
                                x: nx,
                                y: ny,
                                clue: candidate.clue
                            };

                            placedWords.push(newEntry);
                            // Update grid
                            for (let k = 0; k < candidate.word.length; k++) {
                                const kx = newDir === 'H' ? nx + k : nx;
                                const ky = newDir === 'V' ? ny + k : ny;
                                grid[`${kx},${ky}`] = candidate.word[k];
                            }

                            // Remove form available
                            const index = availableWords.findIndex(w => w.word === candidate.word);
                            if (index > -1) availableWords.splice(index, 1);

                            placed = true;
                        }
                    }
                }
            }
        }

        if (!placed) {
            // Move to back of line
            availableWords.push(availableWords.shift());
            if (attempts > 50) break; // Break loop if struggling
        }
    }

    // Normalize coordinates (shift to 0,0)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    if (placedWords.length === 0) return null;

    placedWords.forEach(w => {
        if (w.direction === 'H') {
            minX = Math.min(minX, w.x);
            minY = Math.min(minY, w.y);
            maxX = Math.max(maxX, w.x + w.text.length - 1);
            maxY = Math.max(maxY, w.y);
        } else {
            minX = Math.min(minX, w.x);
            minY = Math.min(minY, w.y);
            maxX = Math.max(maxX, w.x);
            maxY = Math.max(maxY, w.y + w.text.length - 1);
        }
    });

    return {
        width: (maxX - minX) + 1,
        height: (maxY - minY) + 1,
        words: placedWords.map(w => ({ ...w, x: w.x - minX, y: w.y - minY }))
    };
};

function isValidPlacement(word, direction, x, y, grid) {
    for (let i = 0; i < word.length; i++) {
        const cx = direction === 'H' ? x + i : x;
        const cy = direction === 'V' ? y + i : y;
        const key = `${cx},${cy}`;

        // 1. Check Collision
        if (grid[key] && grid[key] !== word[i]) return false;

        // 2. Check Neighbors (prevent adjacent words)
        // Check cells perpendicular to flow direction at this position
        // If we are placing 'H', check (cx, cy-1) and (cx, cy+1)
        // BUT only if this specific cell (cx, cy) is NOT an intersection (was empty before)
        // If it was occupied (grid[key]), it's a valid crossing, so neighbors are expected.

        if (!grid[key]) {
            const neighbors = [];
            if (direction === 'H') {
                neighbors.push(`${cx},${cy - 1}`, `${cx},${cy + 1}`);
                // Also check ends: (x-1, y) and (x+len, y) should be empty
                if (i === 0) neighbors.push(`${cx - 1},${cy}`);
                if (i === word.length - 1) neighbors.push(`${cx + 1},${cy}`);
            } else {
                neighbors.push(`${cx - 1},${cy}`, `${cx + 1},${cy}`);
                // Also check ends: (x, y-1) and (x, y+len) should be empty
                if (i === 0) neighbors.push(`${cx},${cy - 1}`);
                if (i === word.length - 1) neighbors.push(`${cx},${cy + 1}`);
            }

            for (const nKey of neighbors) {
                if (grid[nKey]) return false; // Too close to another word
            }
        }
    }
    return true;
}
