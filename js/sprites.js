/**
 * Sprite Definitions for English Dungeon
 * 
 * Format: Array of strings. Each character represents a pixel color.
 * Key mapping should be provided when drawing.
 * '.' or ' ' = transparent
 */

const SPRITES = {
    PLAYER: [
        "   CC   ",
        "  CCCC  ",
        " C C C  ",
        " CCCCC  ",
        "  CCC   ",
        " CCCCC  ",
        "  C C   ",
        " C   C  "
    ],
    WALL: [
        "########",
        "#......#",
        "#......#",
        "#......#",
        "#......#",
        "#......#",
        "#......#",
        "########"
    ],
    FLOOR: [
        "........",
        "........",
        "........",
        "........",
        "........",
        "........",
        "........",
        "........"
    ],
    ENEMY: [
        "  R  R  ",
        " RRRRRR ",
        "RRR  RRR",
        "RR RR RR",
        "RRR  RRR",
        " RRRRRR ",
        "  R  R  ",
        " R    R "
    ],
    POTION: [
        "   W    ",
        "  WWW   ",
        "  GRG   ",
        " GGGGG  ",
        " GGGGG  ",
        " GGGGG  ",
        "  GGG   ",
        "   G    "
    ],
    STAIRS: [
        "WWWWWWWW",
        "WWWWWWWW",
        "PPPPPPPP",
        "PPPPPPPP",
        "PPPPPPPP",
        "WWWWWWWW",
        "WWWWWWWW",
        "WWWWWWWW"
    ],
    ORB: [
        "  CCCC  ",
        " CWWWWCC ",
        "CWWWWCCCC",
        "CWWWCCCCC",
        "CWWWCCCCC",
        "CWWWCCCCC",
        " CCCCCCC ",
        "  CCCCC  "
    ]
};

// Color Palettes (Character to Color Hex/Var)
const PALETTES = {
    DEFAULT: {
        'C': '#00ffff', // Cyan (Player)
        'R': '#ff4444', // Red (Enemy)
        'G': '#39ff14', // Green (Potion)
        'W': '#ffffff', // White
        'P': '#ff00ff', // Pink (Stairs)
        '#': '#444444', // Wall Border
        '.': '#222222', // Floor/Inner Wall
        ' ': null      // Transparent
    }
};
