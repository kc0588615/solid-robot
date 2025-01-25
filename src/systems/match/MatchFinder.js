export class MatchFinder {
    static findMatches(grid) {
        const matches = new Set();
        this.findHorizontalMatches(grid, matches);
        this.findVerticalMatches(grid, matches);
        return Array.from(matches);
    }

    static findHorizontalMatches(grid, matches) {
        const height = grid[0].length;
        const width = grid.length;

        for (let y = 0; y < height; y++) {
            let matchCount = 1;
            let currentType = null;

            for (let x = 0; x < width; x++) {
                const gem = grid[x][y];
                if (gem && gem.type === currentType) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        for (let i = 1; i <= matchCount; i++) {
                            matches.add(grid[x - i][y]);
                        }
                    }
                    matchCount = 1;
                    currentType = gem ? gem.type : null;
                }
            }

            if (matchCount >= 3) {
                for (let i = 1; i <= matchCount; i++) {
                    matches.add(grid[width - i][y]);
                }
            }
        }
    }

    static findVerticalMatches(grid, matches) {
        const height = grid[0].length;
        const width = grid.length;

        for (let x = 0; x < width; x++) {
            let matchCount = 1;
            let currentType = null;

            for (let y = 0; y < height; y++) {
                const gem = grid[x][y];
                if (gem && gem.type === currentType) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        for (let i = 1; i <= matchCount; i++) {
                            matches.add(grid[x][y - i]);
                        }
                    }
                    matchCount = 1;
                    currentType = gem ? gem.type : null;
                }
            }

            if (matchCount >= 3) {
                for (let i = 1; i <= matchCount; i++) {
                    matches.add(grid[x][height - i]);
                }
            }
        }
    }
}