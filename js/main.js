/**
 * English Dungeon - Main Game Logic
 */

/* --- CONSTANTS --- */
const COLORS = {
    BLACK: '#050505',
    WHITE: '#ffffff',
    GREEN: '#39ff14',
    CYAN: '#00ffff',
    PINK: '#ff00ff',
    RED: '#ff4444',
    YELLOW: '#ffff00',
    GRAY: '#888888'
};
const GAME_WIDTH = 320;
const GAME_HEIGHT = 320;

const TIME_LIMITS = {
    'A': 15, // Slash
    'B': 10, // Shield
    'C': 15, // Magic
    'D': 10, // Echo
    'E': 10  // Talk
};

const randElem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

/* --- AUDIO MANAGER --- */
class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.pausedBgmType = null;
    }

    init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.initialized = true;

        // Handle page visibility change (stop BGM/SE when backgrounded)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause BGM if playing
                if (this.bgmInterval) {
                    this.pausedBgmType = this.currentBgmType;
                    this.stopBgm();
                }
                // Suspend audio context
                if (this.ctx && this.ctx.state === 'running') {
                    this.ctx.suspend();
                }
            } else {
                // Resume audio context
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                // Resume BGM if it was paused
                if (this.pausedBgmType) {
                    this.startBgm(this.pausedBgmType);
                    this.pausedBgmType = null;
                }
            }
        });
    }

    playTone(freq, type, duration, vol = 0.3) {
        if (!this.initialized || !this.ctx) return;
        // Don't play if context is suspended or hidden (double check)
        if (this.ctx.state === 'suspended') return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    // Sound Effects
    playCursor() { this.playTone(440, 'triangle', 0.1, 0.3); }
    playSelect() { this.playTone(880, 'square', 0.1, 0.3); }
    playCancel() { this.playTone(220, 'sawtooth', 0.2, 0.4); }
    playStep() { this.playTone(100, 'square', 0.05, 0.2); }
    playDamage() {
        this.playTone(150, 'sawtooth', 0.1, 0.4);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.2, 0.5), 50);
    }
    playWrong() { this.playTone(100, 'sawtooth', 0.5, 0.6); }
    playAttack() { this.playTone(300, 'square', 0.1, 0.4); }
    playHeal() {
        this.playTone(400, 'sine', 0.1, 0.4);
        setTimeout(() => this.playTone(600, 'sine', 0.2, 0.5), 100);
        setTimeout(() => this.playTone(800, 'sine', 0.4, 0.6), 200);
    }
    playMagic() {
        this.playTone(600, 'sine', 0.2, 0.4);
        setTimeout(() => this.playTone(800, 'sine', 0.2, 0.5), 100);
    }
    playWin() {
        this.stopBgm(); // Win fanfare pauses BGM
        this.playTone(523.25, 'square', 0.1, 0.4); // C5
        setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.4), 100); // E5
        setTimeout(() => this.playTone(783.99, 'square', 0.2, 0.5), 200); // G5
        setTimeout(() => this.playTone(1046.50, 'square', 0.4, 0.6), 300); // C6
        setTimeout(() => this.startBgm(this.currentBgmType), 1000); // Resume
    }
    playExplosion() {
        if (!this.ctx) return;
        const duration = 1.0;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // White noise with exponential decay
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 4);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Lowpass filter to make it "boomy"
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    /* --- BGM SYSTEM --- */
    startBgm(type) {
        if (document.hidden) {
            this.pausedBgmType = type;
            this.currentBgmType = type;
            return;
        }

        if (this.currentBgmType === type && this.bgmInterval) return;
        this.stopBgm();
        this.currentBgmType = type;

        // Simple patterns (Frequency, Duration)
        let pattern = [];
        let speed = 200; // ms per note
        let vol = 0.2;
        let wave = 'triangle';

        if (type === 'dungeon') {
            // Spooky, slow bass
            speed = 400;
            pattern = [
                110, 0, 110, 0, 123, 0, 110, 0,
                98, 0, 98, 0, 110, 0, 0, 0
            ];
            vol = 0.5; // Significantly increased
            wave = 'square'; // More audible than triangle for bass
        } else if (type === 'battle') {
            // Urgent, faster arpeggio
            speed = 150;
            pattern = [
                220, 220, 261, 220, 329, 220, 261, 293,
                220, 220, 261, 220, 392, 349, 329, 293
            ];
            vol = 0.4;
            wave = 'triangle';
        } else if (type === 'title') {
            // Bright, Upbeat, RPG Main Menu Style
            // Major scale arpeggio or simple melody
            speed = 180;
            pattern = [
                523.25, 659.25, 783.99, 1046.50, // C E G C
                880.00, 1046.50, 783.99, 659.25, // A C G E
                587.33, 783.99, 987.77, 1174.66, // D G B D
                1046.50, 0, 783.99, 0            // C - G -
            ];
            vol = 0.3;
            wave = 'square';
        }

        let noteIndex = 0;
        this.bgmInterval = setInterval(() => {
            if (this.ctx && this.ctx.state === 'suspended') return; // Don't queue if suspended
            const freq = pattern[noteIndex];
            if (freq > 0) {
                this.playTone(freq, wave, 0.1, vol);
            }
            noteIndex = (noteIndex + 1) % pattern.length;
        }, speed);
    }

    stopBgm() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
}

/* --- TTS MANAGER --- */
class TtsManager {
    speak(text, lang = 'en-US') {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        window.speechSynthesis.speak(utter);
    }
}

/* --- INPUT MANAGER --- */
class InputManager {
    constructor() {
        this.keys = { up: false, down: false, left: false, right: false, a: false, b: false };
        this.lastKeys = { ...this.keys };
        this.touchX = 0;
        this.touchY = 0;
        this.isTouching = false;
        this.justTouched = false;
    }

    init() {
        this.bindTouch('btn-up', 'up');
        this.bindTouch('btn-down', 'down');
        this.bindTouch('btn-left', 'left');
        this.bindTouch('btn-right', 'right');
        this.bindTouch('btn-a', 'a');
        this.bindTouch('btn-b', 'b');

        window.addEventListener('keydown', (e) => this.onKey(e, true));
        window.addEventListener('keyup', (e) => this.onKey(e, false));

        const canvas = document.getElementById('gameCanvas');
        const handleStart = (e) => {
            e.preventDefault();
            this.setTouchPos(e, canvas);
            this.isTouching = true;
            this.justTouched = true;
        };
        const handleEnd = (e) => {
            e.preventDefault();
            this.isTouching = false;
        };

        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('touchstart', handleStart, { passive: false });
        canvas.addEventListener('touchend', handleEnd, { passive: false });
    }

    setTouchPos(e, canvas) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        this.touchX = (clientX - rect.left) * scaleX;
        this.touchY = (clientY - rect.top) * scaleY;
    }

    bindTouch(id, keyName) {
        const el = document.getElementById(id);
        if (!el) return;
        const setKey = (val) => { this.keys[keyName] = val; };
        el.addEventListener('mousedown', (e) => { e.preventDefault(); setKey(true); });
        el.addEventListener('mouseup', (e) => { e.preventDefault(); setKey(false); });
        el.addEventListener('touchstart', (e) => { e.preventDefault(); setKey(true); });
        el.addEventListener('touchend', (e) => { e.preventDefault(); setKey(false); });
    }

    onKey(e, isDown) {
        switch (e.key) {
            case 'ArrowUp': this.keys.up = isDown; break;
            case 'ArrowDown': this.keys.down = isDown; break;
            case 'ArrowLeft': this.keys.left = isDown; break;
            case 'ArrowRight': this.keys.right = isDown; break;
            case 'z': case 'Enter': this.keys.a = isDown; break;
            case 'x': case 'Backspace': this.keys.b = isDown; break;
        }
    }

    update() {
        this.lastKeys = { ...this.keys };
        this.justTouched = false;
    }

    isJustPressed(key) { return this.keys[key] && !this.lastKeys[key]; }
}

/* --- RENDERER --- */
class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.imageSmoothingEnabled = false;
    }

    clear() {
        this.ctx.fillStyle = COLORS.BLACK;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawText(text, x, y, color = COLORS.WHITE, size = 16, align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px '${getComputedStyle(document.body).getPropertyValue('--font-main').replace(/['"]/g, "")}'`;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    drawRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    strokeRect(x, y, w, h, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, w, h);
    }

    drawCircle(x, y, r, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSprite(sprite, x, y, width, height, palette = PALETTES.DEFAULT) {
        if (!sprite) return;
        const rows = sprite.length;
        const cols = sprite[0].length;
        const pw = width / cols;
        const ph = height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const char = sprite[r][c];
                const color = palette[char];
                if (color) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x + c * pw, y + r * ph, pw, ph);
                }
            }
        }
    }
}

/* --- GAME STATE --- */
class Game {
    constructor() {
        this.audio = new AudioManager();
        this.tts = new TtsManager();
        this.input = new InputManager();
        this.renderer = new Renderer('gameCanvas');

        this.state = 'TITLE';
        this.lastTime = 0;
        this.player = {
            x: 1, y: 1,
            hp: 100, maxHp: 100,
            atk: 10,
            level: 1,
            exp: 0, nextExp: 50,
            items: { potion: 3, dictionary: 0 },
            char: 'BOY' // Default
        };
        this.availableChars = ['BOY', 'GIRL', 'CAT', 'RABBIT'];
        this.charSelectIndex = 0;
        this.map = [];
        this.floor = 1;
        this.battle = null;
        this.audioInitialized = false;
        this.blinkTimer = 0;
    }

    saveData() {
        const data = {
            player: this.player,
            floor: this.floor,
            map: this.map,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('englishDungeonSave', JSON.stringify(data));
        this.setMessage("GAME SAVED!");
        this.audio.playHeal();
    }

    loadData() {
        const json = localStorage.getItem('englishDungeonSave');
        if (!json) {
            this.setMessage("NO SAVE DATA!");
            this.audio.playWrong();
            return false;
        }
        try {
            const data = JSON.parse(json);
            this.player = data.player;
            this.floor = data.floor;
            this.map = data.map;
            this.setMessage("GAME LOADED!");
            this.audio.playHeal();
            return true;
        } catch (e) {
            console.error(e);
            this.setMessage("LOAD FAILED!");
            this.audio.playWrong();
            return false;
        }
    }

    exportData() {
        const data = {
            player: this.player,
            floor: this.floor,
            map: this.map,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `english_dungeon_save_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.setMessage("EXPORTED SAVE FILE!");
        this.audio.playHeal();
    }

    importData() {
        const input = document.getElementById('import-file');
        if (!input) return;

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (!data.player || !data.floor || !data.map) throw new Error("Invalid Save Data");

                    this.player = data.player;
                    this.floor = data.floor;
                    this.map = data.map;

                    this.state = 'EXPLORE';
                    this.toggleControls(true);
                    this.audio.startBgm('dungeon');
                    this.setMessage("IMPORTED GAME!");
                    this.audio.playHeal();
                } catch (err) {
                    console.error(err);
                    this.setMessage("IMPORT FAILED!");
                    this.audio.playWrong();
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    start() {
        this.input.init();
        this.generateMap();
        this.toggleControls(false); // Hide controls initially
        this.state = 'TITLE'; // Ensure state is TITLE
        requestAnimationFrame((t) => this.loop(t));
    }

    generateMap() {
        this.map = Array(10).fill().map(() => Array(10).fill(1));
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                if (x === 0 || x === 9 || y === 0 || y === 9) this.map[y][x] = 0;
            }
        }
        this.map[8][8] = 2; // Exit
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.update(dt);
        this.draw();
        this.input.update();
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        if (this.state === 'TITLE') {
            this.blinkTimer += dt;

            if (!this.audioInitialized) {
                // Wait for any interaction to init audio
                if (this.input.justTouched || this.input.isJustPressed('a') || this.input.isJustPressed('b')) {
                    this.audio.init();
                    this.audio.startBgm('title');
                    this.audioInitialized = true;
                    this.blinkTimer = 0;
                }
            } else {
                // Main Title Menu
                if (this.input.justTouched) {
                    // "GAME START" (160)
                    if (this.checkButton(60, 160, 200, 30)) {
                        this.audio.playSelect();
                        this.state = 'EXPLORE';
                        this.toggleControls(true);
                        this.audio.startBgm('dungeon');
                        this.setMessage("DUNGEON START! Floor 1");
                    }
                    // "LOAD GAME" (200)
                    else if (this.checkButton(60, 200, 200, 30)) {
                        if (this.loadData()) {
                            this.state = 'EXPLORE';
                            this.toggleControls(true);
                            this.audio.startBgm('dungeon');
                        }
                    }
                    // "IMPORT" (240)
                    else if (this.checkButton(60, 240, 200, 30)) {
                        this.importData();
                    }
                    // "CHARACTERS" (280)
                    else if (this.checkButton(60, 280, 200, 30)) {
                        this.audio.playSelect();
                        this.state = 'CHAR_SELECT';
                        this.toggleControls(true);
                        this.setMessage("SELECT YOUR CHARACTER");
                    }
                }
                if (this.input.isJustPressed('a')) {
                    this.audio.playSelect();
                    this.state = 'EXPLORE';
                    this.toggleControls(true);
                    this.audio.startBgm('dungeon');
                    this.setMessage("DUNGEON START! Floor 1");
                }
                // Optional: Press 'B' for Character Select?
                if (this.input.isJustPressed('b')) {
                    this.audio.playSelect();
                    this.state = 'CHAR_SELECT';
                    this.toggleControls(true);
                    this.setMessage("SELECT YOUR CHARACTER");
                }
            }
        }
        else if (this.state === 'CHAR_SELECT') {
            this.updateCharSelect();
        }
        else if (this.state === 'EXPLORE') {
            this.updateExplore();
        }
        else if (this.state === 'MENU') {
            this.updateMenu();
        }
        else if (this.state === 'BATTLE') {
            this.updateBattle(dt);
        }
        else if (this.state === 'GAMEOVER') {
            if (this.input.justTouched) {
                // Retry Button (Top)
                if (this.checkButton(80, 200, 160, 40)) { // Retry
                    this.audio.playSelect();
                    this.state = 'EXPLORE';
                    this.player.hp = this.player.maxHp; // Restore HP
                    // Optional: Reset position to start of floor? Or just stay?
                    // Let's reset to start for fairness
                    this.player.x = 1; this.player.y = 1;
                    this.toggleControls(true);
                    this.audio.startBgm('dungeon');
                    this.setMessage("TRY AGAIN!");
                }
                // Main Menu Button (Bottom)
                else if (this.checkButton(80, 260, 160, 40)) { // Menu
                    this.audio.playCancel();
                    this.state = 'TITLE';
                    this.audioInitialized = false; // Reset to force re-interaction or just go to menu? Let's go to menu but keep audio if possible.
                    // Actually, better to keep audio running or switch to title track immediately
                    this.audio.startBgm('title');
                    this.audioInitialized = true; // Audio context is alrdy running
                    this.toggleControls(false);
                    // Reset Game Data?
                    this.player.level = 1;
                    this.player.hp = 100; this.player.maxHp = 100;
                    this.player.exp = 0; this.player.nextExp = 50;
                    this.player.items = { potion: 3, dictionary: 0 };
                    this.floor = 1;
                    this.generateMap();
                }
            }
        }
    }

    updateExplore() {
        let moved = false;
        let nx = this.player.x, ny = this.player.y;
        if (this.input.isJustPressed('up')) ny--;
        else if (this.input.isJustPressed('down')) ny++;
        else if (this.input.isJustPressed('left')) nx--;
        else if (this.input.isJustPressed('right')) nx++;

        if (nx !== this.player.x || ny !== this.player.y) {
            if (this.map[ny][nx] !== 0) {
                this.player.x = nx;
                this.player.y = ny;
                this.audio.playStep();
                moved = true;
                if (this.map[ny][nx] === 2) {
                    this.audio.playWin();
                    this.setMessage("NEXT FLOOR!");
                    this.player.x = 1; this.player.y = 1; this.floor++;
                    this.generateMap();
                }
            }
        }

        if (moved && Math.random() < 0.15) {
            this.startBattle();
        }

        if (this.input.isJustPressed('b')) {
            this.audio.playSelect();
            this.state = 'MENU';
            // BGM continues in Menu
            this.setMessage("MENU: 'A' to use Potion, 'B' to Return");
        }
    }

    updateMenu() {
        if (this.input.isJustPressed('b')) {
            this.audio.playCancel();
            this.state = 'EXPLORE';
            this.setMessage("");
        }
        if (this.input.isJustPressed('a')) {
            if (this.player.items.potion > 0 && this.player.hp < this.player.maxHp) {
                this.player.items.potion--;
                this.player.hp = Math.min(this.player.hp + 50, this.player.maxHp);
                this.audio.playHeal();
                this.setMessage("Used Potion! HP Restored.");
            } else {
                this.audio.playWrong();
                if (this.player.items.potion <= 0) this.setMessage("No Potions left!");
                else this.setMessage("HP is full!");
            }
        }

        if (this.input.justTouched) {
            // SAVE (190)
            if (this.checkButton(60, 190, 200, 25)) {
                this.saveData();
            }
            // EXPORT (220)
            else if (this.checkButton(60, 220, 200, 25)) {
                this.exportData();
            }
            // Main Menu Button (250)
            else if (this.checkButton(60, 250, 200, 25)) {
                this.audio.playCancel();
                this.state = 'TITLE';
                this.audio.startBgm('title');
                this.toggleControls(false);

                // Reset Game Data
                this.player.level = 1;
                this.player.hp = 100; this.player.maxHp = 100;
                this.player.exp = 0; this.player.nextExp = 50;
                this.player.items = { potion: 3, dictionary: 0 };
                this.floor = 1;
                this.generateMap();
            }
        }
    }

    updateCharSelect() {
        if (this.input.isJustPressed('left')) {
            this.charSelectIndex = (this.charSelectIndex - 1 + this.availableChars.length) % this.availableChars.length;
            this.audio.playCursor();
        } else if (this.input.isJustPressed('right')) {
            this.charSelectIndex = (this.charSelectIndex + 1) % this.availableChars.length;
            this.audio.playCursor();
        }

        if (this.input.isJustPressed('a')) {
            this.audio.playSelect();
            this.player.char = this.availableChars[this.charSelectIndex];
            this.state = 'EXPLORE';
            this.audio.startBgm('dungeon');
            this.setMessage("DUNGEON START! Floor 1");
        }
        // Handle touch for character selection
        if (this.input.justTouched) {
            // Check if touched any character slot
            const margin = 20;
            const spacing = 70;
            const startX = (GAME_WIDTH - (this.availableChars.length * spacing)) / 2 + 20;

            this.availableChars.forEach((char, i) => {
                const x = startX + i * spacing;
                const y = 140;
                if (this.checkButton(x, y, 50, 50)) {
                    this.charSelectIndex = i;
                    this.audio.playSelect();
                    // Confirm selection? Or just select? Let's just select first, or confirm if already selected.
                    // Making it simple: Touch to select, Press A or Touch Button below to Start?
                    // Let's make touching the character select it, and a separate "OK" button or touching it again confirms.
                    // For simplicity: Update index.
                    this.audio.playCursor();
                }
            });

            // OK Button
            if (this.checkButton(110, 240, 100, 40)) {
                this.audio.playSelect();
                this.player.char = this.availableChars[this.charSelectIndex];
                this.state = 'EXPLORE';
                this.audio.startBgm('dungeon');
                this.setMessage("DUNGEON START! Floor 1");
            }
        }
    }

    setMessage(text) {
        const el = document.getElementById('message-text');
        if (el) el.innerText = text;
    }

    /* --- BATTLE SYSTEM --- */
    startBattle() {
        this.state = 'BATTLE';
        this.audio.playDamage();
        this.audio.startBgm('battle'); // Start Battle BGM

        const types = ['A', 'B', 'C', 'D', 'E'];
        const type = types[Math.floor(Math.random() * types.length)];

        this.battle = {
            type: type,
            timer: TIME_LIMITS[type] || 15,
            maxTimer: TIME_LIMITS[type] || 15,
            phase: 'PLAY',
            data: null,
            objects: []
        };

        this.initBattleData(type);
    }

    initBattleData(type) {
        let q;
        switch (type) {
            case 'A': // Slash
                q = randElem(vocabList);
                this.battle.data = { ...q, orbs: [] };
                const wrongs = shuffle(vocabList.filter(v => v.jp !== q.jp)).slice(0, 3).map(v => v.jp);
                const options = shuffle([q.jp, ...wrongs]);
                options.forEach(opt => {
                    this.battle.objects.push({
                        text: opt,
                        x: Math.random() * 200 + 60,
                        y: Math.random() * 200 + 60,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        isCorrect: (opt === q.jp)
                    });
                });
                this.setMessage(`[SLASH] CUT: "${q.en}"`);
                break;
            case 'B': // Shield
                q = randElem(grammarList);
                this.battle.data = q;
                // Timer is set globally
                this.setMessage(`[SHIELD] DEFEND: ${q.q}`);
                break;
            case 'C': // Magic
                q = randElem(syntaxList);
                this.battle.data = { ...q, current: [], pool: shuffle([...q.words]) };
                this.setMessage(`[MAGIC] SPELL: ${q.jp}`);
                break;
            case 'D': // Echo
                q = randElem(listeningList);
                // Shuffle options to prevent answer from always being first
                const shuffledOptions = shuffle([...q.options]);
                this.battle.data = { ...q, options: shuffledOptions, played: false };
                this.setMessage(`[ECHO] LISTEN! (Tap 'A')`);
                break;
            case 'E': // Talk
                q = randElem(conversationList);
                this.battle.data = q;
                this.setMessage(`[TALK] REPLY: "${q.q}"`);
                break;
        }
    }

    updateBattle(dt) {
        if (this.battle.phase === 'WIN' || this.battle.phase === 'LOSE') {
            if (this.input.isJustPressed('a')) {
                if (this.battle.phase === 'WIN') {
                    this.player.exp += 15;
                    // Drop item chance
                    if (Math.random() < 0.3) {
                        this.player.items.potion++;
                        this.setMessage("Found Potion!");
                    }
                    if (this.player.exp >= this.player.nextExp) {
                        this.player.level++;
                        this.player.nextExp = Math.floor(this.player.nextExp * 1.5);
                        this.player.maxHp += 10;
                        this.player.atk += 2;
                        this.player.hp = this.player.maxHp;
                        this.setMessage(`LEVEL UP! LV${this.player.level}`);
                    }
                    this.state = 'EXPLORE';
                    this.toggleControls(true); // Ensure controls are back if hidden (unlikely here)
                    if (this.battle.phase !== 'WIN') this.setMessage("Won the battle!"); // Fallback
                    this.audio.startBgm('dungeon'); // Resume Dungeon BGM
                } else {
                    this.player.hp -= 20;
                    if (this.player.hp <= 0) {
                        this.player.hp = 0; // Clamp
                        this.state = 'GAMEOVER';
                        this.toggleControls(false); // Hide controls
                        this.audio.stopBgm();
                        this.audio.playExplosion();
                        this.setMessage("GAME OVER...");
                    } else {
                        this.state = 'EXPLORE';
                        this.audio.startBgm('dungeon'); // Resume Dungeon BGM
                        this.setMessage(`Escaped... HP:${this.player.hp}`);
                    }
                }
            }
            return;
        }

        // Global Timer Update
        this.battle.timer -= dt / 1000;
        if (this.battle.timer <= 0) {
            this.battle.timer = 0;
            this.battleLose("TIME UP!");
            return;
        }

        switch (this.battle.type) {
            case 'A': this.updateBattleA(); break;
            case 'B': this.updateBattleB(); break;
            case 'C': this.updateBattleC(); break;
            case 'D': this.updateBattleD(); break;
            case 'E': this.updateBattleE(); break;
        }
    }

    updateBattleA() {
        this.battle.objects.forEach(obj => {
            obj.x += obj.vx;
            obj.y += obj.vy;
            if (obj.x < 20 || obj.x > 300) obj.vx *= -1;
            if (obj.y < 20 || obj.y > 220) obj.vy *= -1;
        });

        if (this.input.justTouched) {
            for (let obj of this.battle.objects) {
                const dx = this.input.touchX - obj.x;
                const dy = this.input.touchY - obj.y;
                if (dx * dx + dy * dy < 20 * 20) {
                    if (obj.isCorrect) {
                        this.audio.playAttack();
                        this.battleWin("SLASH!");
                    } else {
                        this.audio.playWrong();
                        this.battle.objects = this.battle.objects.filter(o => o !== obj);
                    }
                    break;
                }
            }
        }
    }

    updateBattleB() {
        // Timer handled globally
        if (this.input.justTouched) {
            this.battle.data.options.forEach((opt, i) => {
                if (this.checkButton(40, 150 + i * 35, 240, 30)) {
                    if (opt === this.battle.data.ans) this.battleWin("DEFENDED!");
                    else this.battleLose("BROKEN!");
                }
            });
        }
    }

    updateBattleC() {
        if (this.input.justTouched) {
            const pool = this.battle.data.pool;
            for (let i = 0; i < pool.length; i++) {
                const x = 20 + (i % 3) * 100;
                const y = 180 + Math.floor(i / 3) * 40;
                if (this.checkButton(x, y, 90, 30)) {
                    const word = pool[i];
                    this.battle.data.current.push(word);
                    this.battle.data.pool.splice(i, 1);
                    this.audio.playCursor();

                    const target = this.battle.data.words;
                    const current = this.battle.data.current;
                    const index = current.length - 1;

                    if (current[index] !== target[index]) {
                        this.audio.playWrong();
                        this.battle.data.pool.push(...this.battle.data.current);
                        this.battle.data.current = [];
                    } else {
                        if (current.length === target.length) {
                            this.audio.playMagic();
                            this.battleWin("MAGIC BURST!");
                        }
                    }
                    break;
                }
            }
        }
    }

    updateBattleD() {
        if (!this.battle.data.played) {
            if (this.input.isJustPressed('a')) {
                this.tts.speak(this.battle.data.text);
                this.battle.data.played = true;
            }
        } else {
            if (this.input.isJustPressed('a')) this.tts.speak(this.battle.data.text);
            if (this.input.justTouched) {
                this.battle.data.options.forEach((opt, i) => {
                    if (this.checkButton(40, 150 + i * 35, 240, 30)) {
                        // Check raw text match
                        if (opt === this.battle.data.text) this.battleWin("HEARD IT!");
                        else this.battleLose("MISHEARD...");
                    }
                });
            }
        }
    }

    updateBattleE() {
        if (this.input.justTouched) {
            this.battle.data.options.forEach((opt, i) => {
                if (this.checkButton(20, 150 + i * 45, 280, 40)) {
                    if (i === this.battle.data.ans) this.battleWin("AGREED!");
                    else this.battleLose("AWKWARD...");
                }
            });
        }
    }

    checkButton(x, y, w, h) {
        const tx = this.input.touchX;
        const ty = this.input.touchY;
        return (tx >= x && tx <= x + w && ty >= y && ty <= y + h);
    }

    battleWin(msg) {
        this.battle.phase = 'WIN';
        this.audio.playWin();
        this.setMessage(msg + " (Win!)");
    }

    battleLose(msg) {
        this.battle.phase = 'LOSE';
        this.audio.playDamage();
        this.setMessage(msg + " (Damage!)");
    }

    draw() {
        this.renderer.clear();
        if (this.state === 'TITLE') {
            this.drawTitle();
        }
        else if (this.state === 'EXPLORE') {
            this.drawMap();
            this.drawPlayer();
            this.renderer.drawText(`LV:${this.player.level} HP:${this.player.hp}`, 10, 20, COLORS.WHITE, 12);
            this.renderer.drawText(`F:${this.floor}`, 280, 20, COLORS.WHITE, 12);

        } else if (this.state === 'CHAR_SELECT') {
            this.drawCharSelect();
        } else if (this.state === 'MENU') {
            this.drawMap(); // BG
            this.drawMenu();
        } else if (this.state === 'BATTLE') {
            this.drawBattle();
        } else if (this.state === 'GAMEOVER') {
            // Draw last state in background?
            // this.drawBattle(); or this.drawMap();
            // Let's just clear for now or draw static
            this.drawGameOver();
        }
    }

    drawMenu() {
        // Overlay
        this.renderer.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.renderer.ctx.fillRect(40, 40, 240, 240);
        this.renderer.strokeRect(40, 40, 240, 240, COLORS.WHITE);

        // Status (Compact)
        this.renderer.drawText("STATUS", 160, 60, COLORS.CYAN, 16, 'center');
        this.renderer.drawText(`LV: ${this.player.level}`, 60, 80, COLORS.WHITE);
        this.renderer.drawText(`HP: ${this.player.hp}/${this.player.maxHp}`, 160, 80, COLORS.WHITE);
        this.renderer.drawText(`EXP: ${this.player.exp}/${this.player.nextExp}`, 60, 100, COLORS.WHITE);
        this.renderer.drawText(`ATK: ${this.player.atk}`, 160, 100, COLORS.WHITE);

        // Items
        this.renderer.drawText("ITEMS", 160, 125, COLORS.CYAN, 16, 'center');
        this.renderer.drawText(`Potion: ${this.player.items.potion}`, 160, 145, COLORS.WHITE, 14, 'center');
        this.renderer.drawText("(Press A to Use)", 160, 165, COLORS.GRAY, 10, 'center');

        // Buttons
        // SAVE
        this.renderer.strokeRect(60, 190, 200, 25, COLORS.GREEN);
        this.renderer.drawText("SAVE GAME", 160, 208, COLORS.WHITE, 14, 'center');

        // EXPORT
        this.renderer.strokeRect(60, 220, 200, 25, COLORS.YELLOW);
        this.renderer.drawText("EXPORT DATA", 160, 238, COLORS.WHITE, 14, 'center');

        // Main Menu Button
        this.renderer.strokeRect(60, 250, 200, 25, COLORS.RED);
        this.renderer.drawText("MAIN MENU", 160, 268, COLORS.WHITE, 14, 'center');
    }

    drawCharSelect() {
        this.renderer.clear();

        // Title
        this.renderer.drawText("CHOOSE YOUR HERO", 160, 60, COLORS.YELLOW, 20, 'center');

        // Characters
        const spacing = 70;
        const startX = (GAME_WIDTH - (this.availableChars.length * spacing)) / 2 + 20;

        this.availableChars.forEach((char, i) => {
            const x = startX + i * spacing;
            const y = 140;
            const size = 50;
            const isSelected = (i === this.charSelectIndex);

            // Draw Selection Box
            if (isSelected) {
                this.renderer.strokeRect(x - 5, y - 5, size + 10, size + 10, COLORS.CYAN);
                // Arrow
                this.renderer.drawText("▼", x + size / 2, y - 15, COLORS.CYAN, 14, 'center');
            }

            // Draw Sprite (Larger)
            const spriteKey = 'PLAYER_' + char;
            this.renderer.drawSprite(SPRITES[spriteKey], x, y, size, size);

            // Name
            this.renderer.drawText(char, x + size / 2, y + 65, isSelected ? COLORS.WHITE : COLORS.GRAY, 10, 'center');
        });

        // Current Description
        // this.renderer.drawText("Tap or Key to Select", 160, 220, COLORS.GRAY, 12, 'center');

        // OK Button
        this.renderer.strokeRect(110, 240, 100, 40, COLORS.GREEN);
        this.renderer.drawText("START", 160, 265, COLORS.WHITE, 20, 'center');
    }

    drawBattle() {
        this.renderer.drawSprite(SPRITES.ENEMY, 130, 45, 60, 60);
        this.renderer.drawText(`Type: ${this.battle.type}`, 160, 112, COLORS.GRAY, 10, 'center');

        // Draw Timer Bar (Enhanced)
        if (this.battle.phase !== 'WIN' && this.battle.phase !== 'LOSE') {
            const barW = 280;
            const barH = 24;
            const barX = (GAME_WIDTH - barW) / 2;
            const barY = 15;

            const pct = Math.max(0, this.battle.timer / this.battle.maxTimer);
            const fillW = barW * pct;

            // Background
            this.renderer.ctx.fillStyle = '#222';
            this.renderer.ctx.fillRect(barX, barY, barW, barH);
            this.renderer.strokeRect(barX, barY, barW, barH, COLORS.WHITE);

            // Foreground Color
            let barColor = COLORS.GREEN;
            if (pct < 0.3) barColor = COLORS.RED;
            else if (pct < 0.6) barColor = COLORS.YELLOW;

            this.renderer.ctx.fillStyle = barColor;
            this.renderer.ctx.fillRect(barX, barY, fillW, barH);

            // Time Text
            this.renderer.ctx.shadowColor = "black";
            this.renderer.ctx.shadowBlur = 4;
            this.renderer.drawText(this.battle.timer.toFixed(1), 160, barY + 19, COLORS.WHITE, 20, 'center');
            this.renderer.ctx.shadowBlur = 0;
        }

        if (this.battle.phase === 'WIN') {
            this.renderer.drawText("VICTORY!", 160, 160, COLORS.YELLOW, 30, 'center');
            return;
        }

        switch (this.battle.type) {
            case 'A': // Slash
                this.renderer.drawText(this.battle.data.en, 160, 130, COLORS.WHITE, 20, 'center');
                this.battle.objects.forEach(obj => {
                    this.renderer.drawSprite(SPRITES.ORB, obj.x - 18, obj.y - 18, 36, 36);
                    this.renderer.drawText(obj.text, obj.x, obj.y + 4, COLORS.BLACK, 10, 'center');
                });
                break;
            case 'B': // Shield
                const qB = this.battle.data.q.replace("___", "___");
                this.renderer.drawText(qB, 20, 135, COLORS.WHITE, 14);
                this.battle.data.options.forEach((opt, i) => {
                    this.renderer.strokeRect(40, 155 + i * 35, 240, 30, COLORS.GREEN);
                    this.renderer.drawText(opt, 160, 175 + i * 35, COLORS.WHITE, 16, 'center');
                });
                break;
            case 'C': // Magic
                this.renderer.drawText(this.battle.data.jp, 160, 130, COLORS.WHITE, 16, 'center');
                this.renderer.drawText(this.battle.data.current.join(" "), 160, 160, COLORS.CYAN, 14, 'center');
                this.battle.data.pool.forEach((word, i) => {
                    const x = 20 + (i % 3) * 100;
                    const y = 190 + Math.floor(i / 3) * 40;
                    this.renderer.strokeRect(x, y, 90, 30, COLORS.PINK);
                    this.renderer.drawText(word, x + 45, y + 20, COLORS.WHITE, 12, 'center');
                });
                break;
            case 'D': // Echo
                if (!this.battle.data.played) {
                    this.renderer.drawText("Press 'A' to Listen", 160, 150, COLORS.WHITE, 16, 'center');
                } else {
                    this.battle.data.options.forEach((opt, i) => {
                        this.renderer.strokeRect(40, 155 + i * 35, 240, 30, COLORS.CYAN);
                        this.renderer.drawText(opt, 160, 175 + i * 35, COLORS.WHITE, 16, 'center');
                    });
                }
                break;
            case 'E': // Talk
                this.renderer.drawText(this.battle.data.q, 20, 130, COLORS.YELLOW, 14);
                this.battle.data.options.forEach((opt, i) => {
                    this.renderer.strokeRect(20, 155 + i * 45, 280, 40, COLORS.GREEN);
                    this.renderer.drawText(opt, 30, 180 + i * 45, COLORS.WHITE, 12, 'left');
                });
                break;
        }
    }

    drawMap() {
        const c = 32;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = this.map[y][x];
                let sprite = SPRITES.FLOOR;

                if (cell === 0) sprite = SPRITES.WALL;
                else if (cell === 2) sprite = SPRITES.STAIRS;

                this.renderer.drawSprite(sprite, x * c, y * c, c, c);
            }
        }
    }

    drawPlayer() {
        // Use selected character sprite
        const spriteKey = 'PLAYER_' + (this.player.char || 'BOY');
        this.renderer.drawSprite(SPRITES[spriteKey] || SPRITES.PLAYER_BOY, this.player.x * 32, this.player.y * 32, 32, 32);
    }

    drawTitle() {
        // 1. Draw Background (Tiled Floor)
        const c = 32;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                this.renderer.drawSprite(SPRITES.FLOOR, x * c, y * c, c, c);
            }
        }

        // 2. Draw Borders (Walls)
        for (let i = 0; i < 10; i++) {
            this.renderer.drawSprite(SPRITES.WALL, i * c, 0, c, c); // Top
            this.renderer.drawSprite(SPRITES.WALL, i * c, 9 * c, c, c); // Bottom
            this.renderer.drawSprite(SPRITES.WALL, 0, i * c, c, c); // Left
            this.renderer.drawSprite(SPRITES.WALL, 9 * c, i * c, c, c); // Right
        }

        // 3. Draw Large Decorative Sprites
        // Player on Left
        this.renderer.drawSprite(SPRITES.PLAYER_BOY, 40, 120, 80, 80);
        // Enemy on Right
        this.renderer.drawSprite(SPRITES.ENEMY, 200, 120, 80, 80);

        // 4. Dark Overlay for Text readability
        this.renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.renderer.ctx.fillRect(20, 40, 280, 240);

        // 5. Title Text
        // Shadow
        this.renderer.drawText("ENGLISH", 163, 93, COLORS.PINK, 40, 'center');
        this.renderer.drawText("DUNGEON", 163, 133, COLORS.CYAN, 40, 'center');
        // Main
        this.renderer.drawText("ENGLISH", 160, 90, COLORS.WHITE, 40, 'center');
        this.renderer.drawText("DUNGEON", 160, 130, COLORS.WHITE, 40, 'center');

        if (!this.audioInitialized) {
            // "TAP TO START"
            if (Math.floor(this.blinkTimer / 500) % 2 === 0) {
                this.renderer.drawText("- TAP TO START -", 160, 220, COLORS.YELLOW, 20, 'center');
            }
        } else {

            // "GAME START" Button
            const bx = 60, bw = 200, bh = 30;

            // START (160)
            this.renderer.strokeRect(bx, 160, bw, bh, COLORS.GREEN);
            this.renderer.drawText("GAME START", 160, 160 + 20, COLORS.WHITE, 16, 'center');

            // LOAD (200)
            this.renderer.strokeRect(bx, 200, bw, bh, COLORS.CYAN);
            this.renderer.drawText("LOAD GAME", 160, 200 + 20, COLORS.WHITE, 16, 'center');

            // IMPORT (240)
            this.renderer.strokeRect(bx, 240, bw, bh, COLORS.YELLOW);
            this.renderer.drawText("IMPORT SAVE", 160, 240 + 20, COLORS.WHITE, 16, 'center');

            // CHARACTERS (280)
            this.renderer.strokeRect(bx, 280, bw, bh, COLORS.PINK);
            this.renderer.drawText("CHARACTERS", 160, 280 + 20, COLORS.WHITE, 16, 'center');
        }

        this.renderer.drawText("© 2026 ENGLISH DUNGEON", 160, 310, COLORS.GRAY, 10, 'center');
    }

    drawGameOver() {
        // Semi-transparent overlay
        this.renderer.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.renderer.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.renderer.drawText("GAME OVER", 160, 120, COLORS.RED, 40, 'center');
        this.renderer.drawText(`Final Level: ${this.player.level}`, 160, 150, COLORS.WHITE, 14, 'center');

        // Retry Button
        const rx = 80, ry = 200, rw = 160, rh = 40;
        this.renderer.strokeRect(rx, ry, rw, rh, COLORS.GREEN);
        this.renderer.drawText("RETRY", 160, 228, COLORS.WHITE, 20, 'center');

        // Menu Button
        const mx = 80, my = 260, mw = 160, mh = 40;
        this.renderer.strokeRect(mx, my, mw, mh, COLORS.GRAY);
        this.renderer.drawText("MAIN MENU", 160, 288, COLORS.WHITE, 20, 'center');
    }

    toggleControls(visible) {
        const el = document.getElementById('controls');
        if (el) el.style.display = visible ? 'flex' : 'none';
    }
}

window.onload = () => { const g = new Game(); g.start(); };
