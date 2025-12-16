// Utility to generate a simple crossword layout
// Input: List of words (objects with {word, clue})
// Output: Layout object { width, height, words: [{id, text, direction, x, y, clue}] }

export const generateCrossword = (wordList, maxWords = 5) => {
    // 1. Pick a random start word
    const availableWords = [...wordList].sort(() => Math.random() - 0.5);
    const usedWords = [];
    const grid = {}; // 'x,y': char

    if (availableWords.length === 0) return null;

    // Place first word horizontally at 0,0
    const firstWord = availableWords.pop();
    const placedWords = [{
        id: 1,
        text: firstWord.word,
        direction: 'H',
        x: 0,
        y: 0,
        clue: firstWord.clue
    }];

    // Mark grid
    for (let i = 0; i < firstWord.word.length; i++) {
        grid[`${i},0`] = firstWord.word[i];
    }

    usedWords.push(firstWord);

    // 2. Try to place subsequent words
    let attempts = 0;
    while (placedWords.length < maxWords && availableWords.length > 0 && attempts < 50) {
        attempts++;
        const candidate = availableWords[0];

        // Find intersection point with any placed word
        let placed = false;

        // Try to intersect with existing placed words
        for (let pWord of placedWords) {
            if (placed) break;

            // Check every char match between candidate and pWord
            for (let i = 0; i < candidate.word.length; i++) {
                if (placed) break;
                for (let j = 0; j < pWord.text.length; j++) {
                    if (candidate.word[i] === pWord.text[j]) {
                        // Found a common letter. 
                        // If pWord is H, candidate must be V.
                        // If pWord is V, candidate must be H.

                        const newDir = pWord.direction === 'H' ? 'V' : 'H';

                        // Calculate potential new x,y
                        // If pWord is H at (px, py), char is at (px+j, py)
                        // Candidate V needs to align its ith char there.
                        // So candidate starts at (px+j, py-i)

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

                            availableWords.shift(); // Remove from available
                            placed = true;
                        }
                    }
                }
            }
        }

        if (!placed) {
            // Move to back of line if couldn't place
            availableWords.push(availableWords.shift());
            // If we looped through all, break to avoid infinite loop
            if (attempts > wordList.length * 2) break;
        }
    }

    // Normalize coordinates (shift to 0,0)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
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

    const finalWords = placedWords.map(w => ({
        ...w,
        x: w.x - minX,
        y: w.y - minY
    }));

    return {
        width: (maxX - minX) + 1,
        height: (maxY - minY) + 1,
        words: finalWords
    };
};

// Check if placement collides or is adjacent incorrectly
function isValidPlacement(word, direction, x, y, grid) {
    for (let i = 0; i < word.length; i++) {
        const cx = direction === 'H' ? x + i : x;
        const cy = direction === 'V' ? y + i : y;
        const key = `${cx},${cy}`;

        // If cell is occupied
        if (grid[key]) {
            if (grid[key] !== word[i]) return false; // Clash
        } else {
            // Check immediate neighbors (classic crossword rule: no adjacent words unless crossing)
            // But for simple intersecting logic, we mainly care about direct overwrites being valid.
            // Strict check: if (cx,cy) is empty, ensure we don't accidentally touch another word 
            // parallel to us.

            // Simplified for 6 yr olds: Just ensure no overwrite clash. 
            // The intersections handle the connectivity.
        }
    }
    return true;
}
