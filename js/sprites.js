/**
 * Sprite Definitions for English Dungeon
 * 
 * Format: Array of strings. Each character represents a pixel color.
 * Key mapping should be provided when drawing.
 * '.' or ' ' = transparent
 */

const SPRITES = {
    PLAYER_BOY: [
        "      BBBB      ",
        "     BBBBBB     ",
        "    BBBFFBBB    ",
        "    BBBFFBBB    ",
        "    B BFFB B    ",
        "      FFFF      ",
        "    CCFFFFCC    ",
        "   CCCCCCCCCC   ",
        "  CCCCCCCCCCCC  ",
        "  CC CCCCCC CC  ",
        "  CC CCCCCC CC  ",
        "     CCCCCC     ",
        "     BB  BB     ",
        "     BB  BB     ",
        "    BB    BB    ",
        "   BB      BB   "
    ],
    PLAYER_GIRL: [
        "   YYYYYYYYYY   ",
        "  RYYYYYYYYYYR  ",
        "  YYYYYYYYYYYY  ",
        "  YYYYFFFFYYYY  ",
        "  YYY FFFF YYY  ",
        "  YY  FFFF  YY  ",
        "      FFFF      ",
        "   PPPPPPPPPP   ",
        "  PPPPPPPPPPPP  ",
        "  PPPPPPPPPPPP  ",
        "  PPPPPPPPPPPP  ",
        "  PPPPPPPPPPPP  ",
        "     PP  PP     ",
        "     LL  LL     ",
        "    LL    LL    ",
        "   LL      LL   "
    ],
    PLAYER_CAT: [
        "     Y    Y     ",
        "    YYY  YYY    ",
        "   YYYYYYYYYY   ",
        "   YYYYYYYYYY   ",
        "   YYYYYYYYYY   ",
        "   Y YYYYYY Y   ",
        "     W WW W     ",
        "    YYYYYYYY    ",
        "   YYYYYYYYYY   ",
        "  YYYYYYYYYYYY  ",
        "  YYYYYYYYYYYY  ",
        "   YYYYYYYYYY   ",
        "   Y Y    Y Y   ",
        "   Y Y    Y Y   ",
        "   Y Y    Y Y   ",
        "   W W    W W   "
    ],
    PLAYER_RABBIT: [
        "     WW  WW     ",
        "    WWWWWWWW    ",
        "    P  WW  P    ",
        "    P  WW  P    ",
        "    WWWWWWWW    ",
        "    WWWWWWWW    ",
        "    W BWW B W   ",
        "     WWWWWW     ",
        "    WWWWWWWW    ",
        "   WWWWWWWWWW   ",
        "   WWWWWWWWWW   ",
        "   WWWWWWWWWW   ",
        "   W W    W W   ",
        "   W W    W W   ",
        "   W W    W W   ",
        "   W W    W W   "
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
        'C': '#00ffff', // Cyan (Boy/Orb)
        'R': '#ff4444', // Red (Enemy/Ribbon)
        'G': '#39ff14', // Green (Potion)
        'W': '#ffffff', // White (Rabbit/Pot/Orb)
        'P': '#ff66aa', // Pink (Girl/Ears) - Tweak for better contrast
        'Y': '#ffdd00', // Yellow (Cat/Hair) - More Golden
        'B': '#8b4513', // Brown (Hair/Boots/Eyes)
        'F': '#ffccaa', // Flesh (Skin)
        'L': '#dddddd', // Light Gray (Socks)
        '#': '#444444', // Wall Border
        '.': '#222222', // Floor/Inner Wall
        ' ': null      // Transparent
    }
};
