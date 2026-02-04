// game.js - PARTE 1 DE 3

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainWrapper = document.getElementById('main-wrapper');

// --- CONSTANTES ---
const GRAVITY = 2500; 
const JUMP_FORCE = 1000;
const PLAYER_SPEED = 430;
const COYOTE_TIME_DURATION = 0.1; 
const PLAYER_SLOW_FALL_SPEED = 15;
const PLAYER_INITIAL_HEALTH = 3, PLAYER_MAX_JUMPS = 2;
const INVINCIBILITY_DURATION = 1.8;
const CAPTURE_REACH_DURATION = 0.25; 
const CAPTURE_PULL_DURATION = 0.4;
const FALLING_PLATFORM_CHANCE = 0.30; 
const FALLING_PLATFORM_ACCELERATION = 500; 

const TALL_WALL_CHANCE = 0.3, TALL_WALL_HEIGHT = 180, NORMAL_WALL_HEIGHT = 60;
const WALL_SPIKE_CHANCE = 0.4;
const WALL_WITH_TOP_SPIKES_CHANCE = 0.3;
const ENEMY_SPEED_BASE = 100;
const PATROL_ENEMY_SPAWN_CHANCE = 0.2; 
const ENEMY_SPAWN_CHANCE = 0.01; 
const ENEMY_SPAWN_COOLDOWN = 2.0; 
const ENEMY_SPEED = 200; 
const HOMING_ENEMY_CHANCE = 0.40; 
const CHARGER_ENEMY_CHANCE = 0.25; 
const REBOUND_ENEMY_CHANCE = 0.25; 
const HOMING_ENEMY_ATTRACTION = 60; 
const LONG_PLATFORM_CHANCE = 0.4, LONG_PLATFORM_MIN_WIDTH = 300, LONG_PLATFORM_MAX_WIDTH = 450;
const OBSTACLE_CHANCE = 0.65, WALL_CHANCE = 0.5, BUSH_SPAWN_CHANCE = 0.4; 
const PLATFORM_MAX_JUMP_HEIGHT = 120, PLATFORM_MAX_DROP_HEIGHT = 200;
const PLATFORM_MIN_GAP = 80, PLATFORM_MAX_GAP = 250;
const PLATFORM_MIN_WIDTH = 100, PLATFORM_MAX_WIDTH = 200; 
const COIN_SPAWN_CHANCE = 0.5, COIN_VALUE = 10;
const PLAYER_TRAIL_COLOR = '#a4281b', 
      ENEMY_STRAIGHT_TRAIL_COLOR = '#6a3381', 
      ENEMY_HOMING_TRAIL_COLOR = '#b8930b', 
      ENEMY_CHARGER_TRAIL_COLOR = '#2E8B57',
      REBOUND_PROJECTILE_COLOR = '#5DADE2';
const BOSS_BATTLE_MAX_HEALTH_PACKS = 6; 
const HEALTH_PACK_SPAWN_CHANCE_BOSS = 0.03; 
const BASE_HEALTH_PACK_CHANCE = 0.07; 
const HEALTH_PACK_CHANCE_MULTIPLIER = 1.5; 
const BOSS_MINION_STRAIGHT_SPEED = 580; 
const BOSS_MINION_HOMING_SPEED = 300;
const BOSS_MINION_REBOUND_SPEED = 420;
const BOSS_DAMAGE_FROM_REBOUND = 10;
const BOSS_DASH_SPEED = 1200;
const REBOUND_PROJECTILE_AIMED_SPEED = 850;
const PROJECTILE_INDICATOR_DURATION = 0.7; 
const BOSS_TRIGGER_SCORE = 3000; 
const BOSS_DASH_COOLDOWN = 3; 
const MUSIC_VOLUME_TRANSITION_SPEED = 1.5; 
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 30; 
const CLOUD_PLATFORM_CHANCE = 0.15;
const CLOUD_REPLACES_STONE_CHANCE = 0.5;
const BOTTOM_SPIKE_CHANCE = 0.15; 
const BOTTOM_SPIKE_HEIGHT = 15;
const WINDOW_TRAP_CHANCE = 0.1; 
const MIN_WINDOW_SPACING = 300; 
const WINDOW_REWARD_CHANCE = 0.5;
const WINDOW_REWARD_COIN_COUNT = 10;
const COIN_ANIM_SPAWN_INTERVAL = 0.06; 
const COIN_ANIM_LIFESPAN = 0.7; 
const COIN_ANIM_START_VELOCITY_Y = -600; 
const COIN_ANIM_GRAVITY = 1800; 
const CRACK_CHANCE = 0.03; 
const MOSS_CHANCE = 0.02;
const HILL_DETAIL_CHANCE = 0.9;
const TREE_HAS_BRANCHES_CHANCE = 0.35;
const BRANCH_PROBABILITIES = [0.60, 0.40, 0.20];
const MAX_BRANCHES_PER_SIDE = 3;
const MIN_BRANCH_SPACING = 40;
const CHEST_SPAWN_CHANCE = 0.15;
const CHEST_LUCK_CHANCE = 0.7;
const CHEST_REWARD_COIN_COUNT = 15;
const CHEST_PROMPT_DISTANCE = 100;
const CHEST_PROMPT_Y_OFFSET = 40;
const FALLING_ROCK_GRAVITY = 900;
const FALLING_ROCK_BOUNCE_VELOCITY_Y = -300;
const FALLING_ROCK_BOUNCE_VELOCITY_X = 200;
const FALLING_ROCK_SPAWN_INTERVAL = 2.5; 

const WINDOW_PROMPT_DISTANCE = 150; 
const WINDOW_PROMPT_Y_OFFSET = 40; 
const DEBRIS_PICKUP_PROMPT_Y_OFFSET = 30;

const DAY_TO_AFTERNOON_TRIGGER_SCORE = 1000;
const AFTERNOON_TO_NIGHT_TRIGGER_SCORE = 2000;
const TRANSITION_DURATION_SCROLL = 5000;

const FINAL_BOSS_TRIGGER_SCORE = 4000;
const FINAL_BOSS_HEALTH = 20; 
const FINAL_BOSS_RISE_SPEED = 20;
const FINAL_BOSS_VERTICAL_OFFSET = 50; 
const FINAL_BOSS_SHAKE_ATTACK_COOLDOWN = 5.0;
const FINAL_BOSS_SHAKE_DURATION = 1.0; 
const BOSS_DEBRIS_GRAVITY = 1200;
const SCREEN_SHAKE_MAGNITUDE = 10;
const DEBRIS_PICKUP_DISTANCE = 60;
const FINAL_BOSS_BATTLE_MAX_HEALTH_PACKS = 10;
const DEBRIS_PHASE_CHANCE = 0.3; 

const FINAL_BOSS_SLASH_TELEGRAPH_TIME = 0.5;
const FINAL_BOSS_SLASH_EXTEND_TIME = 0.2;
const FINAL_BOSS_SLASH_RETRACT_TIME = 0.8;
const FINAL_BOSS_SLASH_COOLDOWN = 1.5;

const FINAL_BOSS_COMBO_COOLDOWN = 0.15;
const FINAL_BOSS_POST_COMBO_COOLDOWN = 2.0;

const FINAL_BOSS_LASER_CHARGE_TIME = 1.0;
const FINAL_BOSS_LASER_ACTIVE_TIME = 1.0; 
const FINAL_BOSS_LASER_ROTATION_SPEED = 1.5;
const FINAL_BOSS_LASER_WIDTH_TELEGRAPH = 4;
const FINAL_BOSS_LASER_WIDTH_ACTIVE = 18;

const TRIPLE_JUMP_FORCE = 1300; 
const JUMP_COMBO_WINDOW = 0.15;

const PAUSE_BTN_SIZE = 44; 
const PAUSE_BTN_MARGIN = 20;
const PAUSE_BTN_X = canvas.width - PAUSE_BTN_SIZE - PAUSE_BTN_MARGIN;
const PAUSE_BTN_Y = PAUSE_BTN_MARGIN;
const PAUSE_BTN_ANIM_SPEED = 15; 
const BUTTON_HOVER_SCALE = 1.15; 

// AUMENTO DO LIMITE MÁXIMO DE PARTÍCULAS
const MAX_PARTICLES = 800; 

const SKY_PALETTES = {
    day:       ['#80d0ff', '#4da6ff', '#1a5fab'],
    afternoon: ['#ffaf40', '#ff7e5f', '#c74b50'],
    night:     ['#0c0a1a', '#2a0f4a', '#4a1c6b']
};

// --- SISTEMA DE ÁUDIO ---
const sounds = { music: { audio: new Audio('music.mp3'), loop: true, baseVolume: 0.4 }, jump: { audio: new Audio('jump.mp3'), baseVolume: 0.05 }, coin: { audio: new Audio('coin.mp3'), baseVolume: 0.15 }, land: { audio: new Audio('falling.mp3'), baseVolume: 0.15 }, damage: { audio: new Audio('damage.mp3'), baseVolume: 0.5 }, gameOver: { audio: new Audio('gameOver.mp3'), baseVolume: 0.5 }, victory: { audio: new Audio('victory.mp3'), baseVolume: 0.5 } };
const sfxSoundKeys = ['jump', 'coin', 'land', 'damage', 'gameOver', 'victory'];

// CORREÇÃO: Recuperação robusta do volume (aceita 0 como valor válido)
const savedMusicVol = localStorage.getItem('musicVolume');
const savedSfxVol = localStorage.getItem('sfxVolume');

let musicVolume = (savedMusicVol !== null) ? parseFloat(savedMusicVol) : 0.4;
let sfxVolume = (savedSfxVol !== null) ? parseFloat(savedSfxVol) : 0.5;

let currentMusicVolumeFactor = 1.0; 
let targetMusicVolumeFactor = 1.0; 

function applyVolumes() { 
    sfxSoundKeys.forEach(key => { 
        if(sounds[key].audio) sounds[key].audio.volume = sounds[key].baseVolume * sfxVolume; 
    }); 
    if(sounds.music.audio) {
        sounds.music.audio.volume = sounds.music.baseVolume * musicVolume * currentMusicVolumeFactor;
    }
}

function playSound(soundObj) { 
    if (soundObj && soundObj.audio && soundObj.audio.src) { 
        if (soundObj.audio.loop || soundObj === sounds.gameOver || soundObj === sounds.victory) { 
            soundObj.audio.currentTime = 0; 
            soundObj.audio.play().catch(e => {}); 
        } else { 
            const tempAudio = soundObj.audio.cloneNode(); 
            tempAudio.volume = soundObj.audio.volume; 
            tempAudio.play().catch(e => {}); 
        } 
    } 
}

function setTargetMusicVolumeFactor(gameState) { 
    if (musicStarted && gameState !== 'start') { 
        sounds.music.audio.loop = true; 
        sounds.music.audio.play().catch(e => {}); 
    }
    
    // CASO 1: Jogo Ativo (Volume Máximo)
    if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss' || gameState === 'start') {
        targetMusicVolumeFactor = 1.0;
    }
    // CASO 2: Menu de Opções
    else if (gameState === 'options') {
        if (optionsState === 'audio') {
            targetMusicVolumeFactor = 1.0;
        } else {
            targetMusicVolumeFactor = (musicVolume <= 0.2) ? 1.0 : 0.2;
        }
    }
    // CASO 3: Pause, GameOver, Vitória (Volume Baixo)
    else {
        if (musicVolume <= 0.2) {
            targetMusicVolumeFactor = 1.0;
        } else {
            targetMusicVolumeFactor = 0.2;
        }
    }
}

// --- CANVAS OFFSREEN ---
let offscreenCanvas;
let offscreenCtx;

// --- VARIÁVEIS GLOBAIS ---
let player, platforms, keys, scrollOffset, gameOver, gameWon, enemies, coins, particles, musicStarted, lastWindowY; 
let verticalScrollOffset = 0;
let sceneryManager;
let boss, finalBoss, healthPacks;
let projectileIndicators;
let bossDebris;
let screenShakeTimer = 0;
let gameState;
let phaseOneComplete = false;
let selectedPauseOption = 0;

// --- VARIÁVEIS DE OPÇÕES & CONTROLES ---
let optionsState = 'main'; 
let selectedOptionMain = 0;
let selectedAudioSetting = 0;
let reduceParticles = false;

// Estado de Animação dos Menus (Escalas Individuais)
let menuAnimStates = {
    main: [1, 1, 1, 1],       
    audio: [1, 1, 1],         
    controls: [1, 1, 1, 1, 1, 1, 1, 1],
    pause: [1, 1]             
};

// Mapa de Teclas Padrão
const defaultKeyMap = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    up: 'ArrowUp',     
    down: 'ArrowDown', 
    interact: 'Space', 
    pause: 'KeyP',
    restart: 'KeyR'
};

let keyMap = JSON.parse(localStorage.getItem('superAIKeyMap')) || { ...defaultKeyMap };
let bindingAction = null; 

let lastTime = 0;
let screenMessage = null;
let draggingSlider = null;
let currentTransitionState;
let dayTransitionStartOffset;
let nightTransitionStartOffset;
let phaseTwoStartScrollY = 0;
let phaseTwoHealthPacks;
let fallingRockSpawnTimer;

// --- VARIÁVEIS DE CONTROLE DE GERAÇÃO ---
let pixelsSinceLastHP = 0;
let platformsSinceLastPatrolF2 = 0;
let platformsSinceLastHPF2 = 0;

let coinAnimations = []; 
let coinRewardState = { active: false, toSpawn: 0, spawnTimer: 0, spawnPosition: null };
let interactionPrompts = [];
let hasBeatenGame = false;
let chestToOpen = null;
let enemySpawnCooldown = 0;
let score = 0;

let isHoveringPause = false; 
let previousStateForPause = 'playing';
let currentPauseButtonScale = 1.0;

let lastScoreTier = 0;
let scoreBlinkTimer = 0;

// --- VARIÁVEIS DE CHEAT (ATUALIZADO) ---
let cheatsEnabled = false;
const cheatCode = 'gubed'; 
let cheatCodeProgress = 0;
let debugMode = false;
let infiniteInvincibilityCheat = false;
let scoreLockCheat = false;

// VARIÁVEIS DO DEBUG PANEL
let debugPanelOpen = false;
let activeDebugTab = 'tab-general';
let selectedSpawnType = null; 

// Variáveis de Arraste do Menu
let isDraggingDebug = false;
let dragStartX = 0;
let dragStartLeft = 0;

// --- FUNÇÕES AUXILIARES ---
function drawGradientText(text, x, y, size, align = 'center', shadow = true, targetCtx = ctx) { targetCtx.font = `${size}px "Press Start 2P", cursive`; targetCtx.textAlign = align; const shadowOffset = Math.ceil(size / 16); if (shadow) { targetCtx.fillStyle = 'rgba(0, 0, 0, 0.25)'; targetCtx.fillText(text, x + shadowOffset, y + shadowOffset); } const gradient = targetCtx.createLinearGradient(0, y - size, 0, y); gradient.addColorStop(0, '#ffffff'); gradient.addColorStop(1, '#d0d0d0'); targetCtx.fillStyle = gradient; targetCtx.fillText(text, x, y); }
function getMousePos(canvas, event) { const rect = canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
function isMouseOverRect(mousePos, x, y, width, height) { return mousePos.x >= x && mousePos.x <= x + width && mousePos.y >= y && mousePos.y <= y + height; }
function isCollidingWithDiamond(rect, diamond) { if (!rect || !diamond || typeof rect.x === 'undefined' || typeof diamond.x === 'undefined' || isNaN(rect.x) || isNaN(rect.y) || isNaN(rect.width) || isNaN(rect.height) || isNaN(diamond.x) || isNaN(diamond.y) || isNaN(diamond.width) || isNaN(diamond.height) ) { return false; } const diamondCenterX = diamond.x + diamond.width / 2; const diamondCenterY = diamond.y + diamond.height / 2; const diamondHalfWidth = diamond.width / 2; const diamondHalfHeight = diamond.height / 2; const rectCorners = [ { x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x, y: rect.y + rect.height }, { x: rect.x + rect.width, y: rect.y + rect.height } ]; for (const corner of rectCorners) { const dx = Math.abs(corner.x - diamondCenterX); const dy = Math.abs(corner.y - diamondCenterY); if (dx / diamondHalfWidth + dy / diamondHalfHeight <= 1) { return true; } } return false; }
function isColliding(rect1, rect2) {
    if (!rect1 || !rect2) return false;
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}
function isCollidingCircleRect(circle, rect) {
    if (!circle || !rect) return false;
    const circleX = circle.x;
    const circleY = circle.y;
    
    const closestX = Math.max(rect.x, Math.min(circleX, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circleY, rect.y + rect.height));

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    return distanceSquared < (circle.radius * circle.radius);
}
function isCollidingLineRect(line, rect) {
    const left = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x, rect.y + rect.height);
    const right = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height);
    const top = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x + rect.width, rect.y);
    const bottom = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height);
    if (left || right || top || bottom) return true;
    const cx = line.x1;
    const cy = line.y1;
    if (cx > rect.x && cx < rect.x + rect.width && cy > rect.y && cy < rect.y + rect.height) {
        return true;
    }
    return false;
}
function isCollidingLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}
function isCollidingRectPolygon(rect, polygon) {
    const rectPoly = [
        {x: rect.x, y: rect.y},
        {x: rect.x + rect.width, y: rect.y},
        {x: rect.x + rect.width, y: rect.y + rect.height},
        {x: rect.x, y: rect.y + rect.height}
    ];

    const polygons = [rectPoly, polygon];
    for (let i = 0; i < polygons.length; i++) {
        const poly = polygons[i];
        for (let j1 = 0; j1 < poly.length; j1++) {
            const j2 = (j1 + 1) % poly.length;
            const p1 = poly[j1];
            const p2 = poly[j2];

            const normal = { x: p2.y - p1.y, y: p1.x - p2.x };
            let minA = null, maxA = null;
            for (const p of rectPoly) {
                const projected = normal.x * p.x + normal.y * p.y;
                if (minA === null || projected < minA) minA = projected;
                if (maxA === null || projected > maxA) maxA = projected;
            }

            let minB = null, maxB = null;
            for (const p of polygon) {
                const projected = normal.x * p.x + normal.y * p.y;
                if (minB === null || projected < minB) minB = projected;
                if (maxB === null || projected > maxB) maxB = projected;
            }

            if (maxA < minB || maxB < minA) {
                return false; 
            }
        }
    }
    return true; 
}


function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}
function rgbToString(rgb) { return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`; }
function lerpColor(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 'rgb(0,0,0)';
    const result = { r: rgb1.r + factor * (rgb2.r - rgb1.r), g: rgb1.g + factor * (rgb2.g - rgb1.g), b: rgb1.b + factor * (rgb2.b - rgb1.b) };
    return result;
}

function isVerticalPhase() {
    return gameState === 'phaseTwo' || gameState === 'finalBoss';
}

// --- FUNÇÕES DE INICIALIZAÇÃO E CONTROLE ---
function init(keepCheckpoint = false, startDirectly = false) { 
    offscreenCanvas = document.createElement('canvas'); offscreenCanvas.width = canvas.width; offscreenCanvas.height = canvas.height; offscreenCtx = offscreenCanvas.getContext('2d'); 
    platforms = [new Platform(0, 550, 600, 'stable', 'grass')]; 
    player = new Player(100, platforms[0].y - 40); 
    enemies = []; coins = []; particles = []; healthPacks = []; 
    projectileIndicators = [];
    coinAnimations = [];
    interactionPrompts = [];
    bossDebris = []; 
    coinRewardState = { active: false, toSpawn: 0, spawnTimer: 0, spawnPosition: null };
    keys = { right: false, left: false, down: false, up: false, space: false };
    scrollOffset = 0; 
    verticalScrollOffset = 0;
    gameOver = false; gameWon = false; enemySpawnCooldown = 0; score = 0;
    boss = null;
    finalBoss = null;
    if (!keepCheckpoint) {
        phaseOneComplete = false;
    }
    phaseTwoHealthPacks = {};
    musicStarted = false; 
    sceneryManager = new SceneryManager(canvas.width, canvas.height); 
    
    if (startDirectly) {
        gameState = 'playing';
        musicStarted = true; 
    } else {
        gameState = 'start';
        if (sounds.music.audio) {
            sounds.music.audio.pause();
            sounds.music.audio.currentTime = 0;
        }
    }
    
    currentTransitionState = 'day';
    dayTransitionStartOffset = null;
    nightTransitionStartOffset = null;
    selectedPauseOption = 0;
    
    // Configurações de Opções
    optionsState = 'main';
    selectedOptionMain = 0;
    selectedAudioSetting = 0;
    reduceParticles = false;

    currentMusicVolumeFactor = 1.0;
    targetMusicVolumeFactor = 1.0; 
    
    // Reset Debug ao reiniciar - MAS MANTÉM OS CHEATS ATIVOS SE JÁ ESTAVAM
    debugPanelOpen = false;
    selectedSpawnType = null;
    
    lastWindowY = Infinity; 
    phaseTwoStartScrollY = 0;
    fallingRockSpawnTimer = 2.0;
    lastScoreTier = 0;
    scoreBlinkTimer = 0;
    
    // Resetar estados de animação ao iniciar
    menuAnimStates = {
        main: [1, 1, 1, 1],
        audio: [1, 1, 1],
        controls: [1, 1, 1, 1, 1, 1, 1, 1],
        pause: [1, 1]
    };

    if(sounds.music.audio) sounds.music.audio.volume = sounds.music.baseVolume * musicVolume * currentMusicVolumeFactor;
    if(sounds.gameOver.audio && sounds.gameOver.audio.src) { sounds.gameOver.audio.currentTime = 0; sounds.gameOver.audio.pause(); }
    if(sounds.victory.audio && sounds.victory.audio.src) { sounds.victory.audio.currentTime = 0; sounds.victory.audio.pause(); }
    applyVolumes(); 
    setTargetMusicVolumeFactor(gameState); 
    gerenciarPlataformas(); 
    showPointingArrow();
    hasBeatenGame = localStorage.getItem('gameBeaten') === 'true';
    
    if(typeof updateDebugPanelUI === 'function') updateDebugPanelUI();
    
    if (infiniteInvincibilityCheat && player) {
        player.isInvincible = true;
    }
}

function initBossBattle() { 
    platforms.forEach(platform => { 
        if (platform.x > scrollOffset - platform.width) { 
            platform.obstacles = []; 
            platform.hasChest = false; 
        } 
    }); 
    enemies = []; 
    coins = []; 
    healthPacks = []; 
    projectileIndicators = []; 
    boss = new Boss(); 
    if (boss) boss.lastScrollOffsetForDash = scrollOffset; 
    setTargetMusicVolumeFactor('bossBattle'); 
}

function initPhaseTwo() {
    init(true, true); 
    
    coins = [];
    enemies = [];
    healthPacks = [];
    
    phaseOneComplete = true;
    gameState = 'phaseTwo';
    boss = null;
    finalBoss = null; 
    
    player = new Player(canvas.width / 2, canvas.height - 100);
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 100;
    player.velocityX = 0;
    player.velocityY = 0;
    
    if (infiniteInvincibilityCheat) player.isInvincible = true;
    
    verticalScrollOffset = player.y - canvas.height * 0.7; 
    phaseTwoStartScrollY = verticalScrollOffset;
    
    const towerWidth = canvas.width * 0.6;
    const towerX = (canvas.width - towerWidth) / 2;
    
    const baseWidth = (towerWidth * 0.5) + (Math.random() * towerWidth * 0.3);
    const baseX = towerX + (towerWidth - baseWidth) / 2;
    platforms = [new Platform(baseX, canvas.height - 40, baseWidth, 'stable', 'stone')];
    
    lastWindowY = canvas.height;
    fallingRockSpawnTimer = 2.0;
    gerenciarPlataformasFase2();

    currentTransitionState = 'night';
    setTargetMusicVolumeFactor(gameState);
}

function initFinalBoss() {
    gameState = 'finalBoss';

    enemies = []; 
    coins = [];
    healthPacks = [];
    bossDebris = []; 
    platforms.forEach(p => {
        p.obstacles = [];
        p.terrestrialSpawnPoint = null;
        p.hasWindowTrap = false;
    });
    
    const startY = verticalScrollOffset + canvas.height + 150;
    
    finalBoss = new FinalBoss(startY);
    setTargetMusicVolumeFactor(gameState); 
    screenMessage = { text: "A BATALHA FINAL!", lifespan: 4 };
}


function triggerCoinReward(player, spawnPosition, coinCount) {
    if (coinRewardState.active) return;

    coinRewardState.active = true;
    coinRewardState.toSpawn = coinCount;
    coinRewardState.spawnTimer = 0;
    coinRewardState.spawnPosition = spawnPosition;

    player.rewardCooldown = COIN_ANIM_SPAWN_INTERVAL * coinRewardState.toSpawn + 0.2;
    player.velocityX = 0;
    player.velocityY = 0;
}

// game.js - PARTE 2 DE 4

// Variável global para controlar a animação dos prompts de interação
let promptAnimFrame = 0;
// Variável para rastrear especificamente o CTRL DIREITO (RCTRL)
let isRightCtrlPressed = false;
let isLeftCtrlPressed = false;
// Flag para garantir que listeners só sejam adicionados uma vez
let debugListenersAdded = false;

// --- HELPER PARA FORMATAR NOME DAS TECLAS ---
function formatKeyName(code) {
    if (!code) return '...';
    if (code.startsWith('Arrow')) return ''; 
    if (code.startsWith('Numpad')) {
        const suffix = code.replace('Numpad', '');
        if (suffix === 'Enter') return 'ENT';
        if (suffix === 'Add') return '+';
        if (suffix === 'Subtract') return '-';
        if (suffix === 'Multiply') return '*';
        if (suffix === 'Divide') return '/';
        if (suffix === 'Decimal') return '.';
        return 'NP' + suffix; 
    }
    const specialKeys = { 'Backspace': 'BAC', 'Pause': 'PAU', 'Insert': 'INS', 'Home': 'HOM', 'PageUp': 'PUP', 'PageDown': 'PDW', 'Delete': 'DEL', 'End': 'END', 'Tab': 'TAB', 'CapsLock': 'CAP', 'Space': 'SPC', 'Enter': 'ENT', 'Escape': 'ESC', 'ControlLeft': 'CTRL', 'ControlRight': 'CTRL', 'ShiftLeft': 'SHFT', 'ShiftRight': 'SHFT', 'AltLeft': 'ALT', 'AltRight': 'ALT', 'Minus': '-', 'Equal': '=', 'BracketLeft': '[', 'BracketRight': ']', 'Semicolon': ';', 'Quote': "'", 'Backquote': '`', 'Backslash': '\\', 'Comma': ',', 'Period': '.', 'Slash': '/' };
    if (specialKeys[code]) return specialKeys[code];
    return code.replace('Key', '').replace('Digit', '').toUpperCase().substring(0, 4);
}

// --- HELPERS DE LAYOUT (UI) ---
function getControlsLayout(cx, cy) {
    const s = 50; const g = 10; const mx = cx - 180; const my = cy + 20; const ax = cx + 120; const ay = cy - 40; const ayGap = 70; 
    return [ { action: 'up', x: mx, y: my - s - g, w: s, h: s, label: 'PULAR' }, { action: 'left', x: mx - s - g, y: my, w: s, h: s, label: 'ESQUERDA' }, { action: 'down', x: mx, y: my, w: s, h: s, label: 'DESCER' }, { action: 'right', x: mx + s + g, y: my, w: s, h: s, label: 'DIREITA' }, { action: 'interact', x: ax, y: ay, w: s, h: s, label: 'INTERAGIR' }, { action: 'pause', x: ax, y: ay + ayGap, w: s, h: s, label: 'PAUSAR' }, { action: 'restart', x: ax, y: ay + ayGap*2, w: s, h: s, label: 'REINICIAR' } ];
}
function getBackButtonRect(canvasWidth, canvasHeight) { return { x: canvasWidth / 2 - 60, y: canvasHeight - 60, w: 120, h: 30 }; }

// --- LÓGICA DO DEBUG PANEL ---
function toggleDebugPanel(forceState = null) {
    const panel = document.getElementById('debugPanel');
    const newState = (forceState !== null) ? forceState : !debugPanelOpen;
    debugPanelOpen = newState;
    
    if (debugPanelOpen) {
        panel.style.left = '0px'; 
        updateDebugPanelUI();
    } else {
        panel.style.left = '-300px'; 
        selectedSpawnType = null;
        canvas.style.cursor = 'default';
        updateDebugPanelUI();
    }
}

function updateDebugPanelUI() {
    const setToggle = (id, state) => {
        const btn = document.getElementById(id);
        if(!btn) return;
        if (state) {
            btn.classList.add('active-toggle');
            btn.innerText = 'ON';
        } else {
            btn.classList.remove('active-toggle');
            btn.innerText = 'OFF';
        }
    };

    setToggle('btn-godmode', infiniteInvincibilityCheat);
    setToggle('btn-lock-score', scoreLockCheat);
    setToggle('btn-hitbox', debugMode);

    document.querySelectorAll('.spawn-select').forEach(btn => {
        if (btn.dataset.type === selectedSpawnType) {
            btn.classList.add('active-toggle');
            btn.classList.add('spawn-selected');
            btn.innerText = 'ON';
        } else {
            btn.classList.remove('active-toggle');
            btn.classList.remove('spawn-selected');
            btn.innerText = 'OFF';
        }
    });
}

function handleDebugSpawn(mousePos) {
    if (!selectedSpawnType) return;

    const isVertical = isVerticalPhase();
    const worldX = mousePos.x + (isVertical ? 0 : scrollOffset);
    const worldY = mousePos.y + (isVertical ? verticalScrollOffset : 0);

    for(let i=0; i<8; i++) {
        particles.push({
            x: worldX, y: worldY, size: Math.random()*3+2, color: '#fff',
            lifespan: 0.5, initialLifespan: 0.5,
            vx: (Math.random()-0.5)*200, vy: (Math.random()-0.5)*200,
            isScreenSpace: isVertical ? false : false 
        });
    }

    const addIsolatedPlatform = (p) => {
        p.isDebug = true; 
        if (platforms.length > 0) {
            platforms.splice(platforms.length - 1, 0, p);
        } else {
            platforms.push(p);
        }
    };

    if (selectedSpawnType.startsWith('enemy-')) {
        const type = selectedSpawnType.replace('enemy-', '');
        
        if (type === 'patrol') {
            const plat = new Platform(worldX - 50, worldY + 20, 100, 'stable', isVertical ? 'stone' : 'grass');
            addIsolatedPlatform(plat);
            
            const enemy = new Enemy(worldX - 17, worldY - 15, 'patrol', ENEMY_SPEED_BASE, false, plat);
            enemy.platform = plat; 
            enemies.push(enemy);
        } else if (type === 'rock') {
            projectileIndicators.push({
                x: worldX, y: 40, 
                lifespan: 0.1, initialLifespan: 0.1, 
                projectileType: 'falling_rock', projectileSpeed: 0
            });
        } else {
            let speed = ENEMY_SPEED;
            if (type === 'charger') speed = 0; 
            const enemy = new Enemy(worldX, worldY, type, speed, false);
            enemy.x -= enemy.width / 2;
            enemy.y -= enemy.height / 2;
            enemies.push(enemy);
        }
        
    } else if (selectedSpawnType === 'item-coin') {
        coins.push(new Coin(worldX, worldY));
    } else if (selectedSpawnType === 'item-health') {
        healthPacks.push(new HealthPack(worldX, worldY));
    } else if (selectedSpawnType.startsWith('obj-')) {
        const objType = selectedSpawnType.replace('obj-', '');
        const pWidth = 150;
        
        if (objType === 'chest') {
            const p = new Platform(worldX - pWidth/2, worldY + 20, pWidth, 'stable', isVertical ? 'stone' : 'grass');
            p.hasChest = true; p.chestType = 'reward'; 
            addIsolatedPlatform(p);
        } else if (objType === 'window') {
            const p = new Platform(worldX - pWidth/2, worldY + 20, pWidth, 'stable', isVertical ? 'stone' : 'grass');
            p.hasWindowTrap = true; p.windowType = 'reward'; 
            addIsolatedPlatform(p);
        } else if (objType === 'falling') {
             const p = new Platform(worldX - pWidth/2, worldY + 20, pWidth, 'falling', isVertical ? 'stone' : 'grass');
             addIsolatedPlatform(p);
        }
    }
}

function startDebugDrag(e) {
    isDraggingDebug = true;
    dragStartX = e.clientX;
    const panel = document.getElementById('debugPanel');
    panel.style.transition = 'none';
    dragStartLeft = parseInt(window.getComputedStyle(panel).left, 10);
}

function handleDebugDrag(e) {
    if (!isDraggingDebug) return;
    const deltaX = e.clientX - dragStartX;
    let newLeft = dragStartLeft + deltaX;
    newLeft = Math.max(-300, Math.min(0, newLeft));
    const panel = document.getElementById('debugPanel');
    panel.style.left = newLeft + 'px';
}

function stopDebugDrag(e) {
    if (!isDraggingDebug) return;
    isDraggingDebug = false;
    const panel = document.getElementById('debugPanel');
    panel.style.transition = 'left 0.3s ease-out';
    const currentLeft = parseInt(panel.style.left, 10);
    const threshold = -150; 
    
    const dragDistance = Math.abs(e.clientX - dragStartX);
    
    if (dragDistance < 5) {
        toggleDebugPanel(); 
    } else {
        if (currentLeft > threshold) { toggleDebugPanel(true); } else { toggleDebugPanel(false); }
    }
}

function setupDebugListeners() {
    if (debugListenersAdded) return; 
    debugListenersAdded = true;

    const unwantedText = document.querySelector('.debug-info-text');
    if(unwantedText) unwantedText.style.display = 'none';

    document.getElementById('closeDebugPanel').addEventListener('click', function() {
        this.blur();
        toggleDebugPanel(false);
    });
    
    const handle = document.getElementById('debugDragHandle');
    handle.addEventListener('mousedown', startDebugDrag);
    window.addEventListener('mousemove', handleDebugDrag);
    window.addEventListener('mouseup', stopDebugDrag);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.blur();
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const contentId = btn.dataset.tab;
            document.getElementById(contentId).classList.add('active');
            activeDebugTab = contentId;
        });
    });

    document.getElementById('btn-godmode').addEventListener('click', function() {
        this.blur();
        infiniteInvincibilityCheat = !infiniteInvincibilityCheat;
        if(!infiniteInvincibilityCheat && player) player.isInvincible = false;
        updateDebugPanelUI();
    });
    document.getElementById('btn-add-life').addEventListener('click', function() {
        this.blur();
        if(player && player.health < player.maxHealth) { player.health++; playSound(sounds.coin); }
    });
    document.getElementById('btn-sub-life').addEventListener('click', function() {
        this.blur();
        if(player && player.health > 1) { player.health--; } 
    });

    document.getElementById('btn-add-score').addEventListener('click', function() {
        this.blur();
        score += 100;
    });
    document.getElementById('btn-sub-score').addEventListener('click', function() {
        this.blur();
        score = Math.max(0, score - 100);
    });
    document.getElementById('btn-lock-score').addEventListener('click', function() {
        this.blur();
        scoreLockCheat = !scoreLockCheat;
        updateDebugPanelUI();
    });

    document.getElementById('btn-hitbox').addEventListener('click', function() {
        this.blur();
        debugMode = !debugMode;
        updateDebugPanelUI();
    });

    document.getElementById('btn-phase-1').addEventListener('click', function() {
        this.blur();
        init(false, true); 
    });
    document.getElementById('btn-phase-2').addEventListener('click', function() {
        this.blur();
        phaseOneComplete = true; initPhaseTwo(); 
    });
    
    document.getElementById('btn-dmg-boss').addEventListener('click', function() {
        this.blur();
        if(boss) { boss.health -= 10; playSound(sounds.damage); }
        if(finalBoss) { finalBoss.takeDamage(2); }
    });

    document.querySelectorAll('.spawn-select').forEach(btn => {
        btn.addEventListener('click', function() {
            this.blur();
            const type = btn.dataset.type;
            if (selectedSpawnType === type) {
                selectedSpawnType = null; 
                canvas.style.cursor = 'default';
            } else {
                selectedSpawnType = type;
                canvas.style.cursor = 'crosshair'; 
            }
            updateDebugPanelUI();
        });
    });
}

// --- FUNÇÕES AUXILIARES DE SISTEMA ---
function togglePauseGame() {
    if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { previousStateForPause = gameState; gameState = 'paused'; setTargetMusicVolumeFactor(gameState); keys.left = false; keys.right = false; } 
    else if (gameState === 'paused') { gameState = previousStateForPause || 'playing'; setTargetMusicVolumeFactor(gameState); }
}

function applyAndSaveVolumes(){ 
    applyVolumes(); 
    localStorage.setItem('musicVolume', musicVolume); 
    localStorage.setItem('sfxVolume', sfxVolume); 
}

function handleBodyClick(event) { 
    if (event.target.closest('#debugPanel') || event.target.closest('#debugDragHandle')) return;
    if (event.target === document.body || event.target === mainWrapper) { if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { togglePauseGame(); } } 
}

// --- FUNÇÕES DE INPUT (EVENT HANDLING) ---
function handleStartInput(event) { 
    // CORREÇÃO: Removemos 'Space' e mantemos apenas Interact (seja ele qual for) e Enter (sistema)
    if (event.code === keyMap.interact || event.code === 'Enter') {
        gameState = 'playing'; 
        musicStarted = true; 
        if (sounds.music.audio) {
            sounds.music.audio.currentTime = 0;
            sounds.music.audio.play().catch(e => {});
        }
        setTargetMusicVolumeFactor(gameState); 
    }
}

function handlePlayingInput(event) { 
    if (patchNotesContainer.classList.contains('visible')) return; 

    if (cheatsEnabled) { 
        if (event.code === 'KeyC') { toggleDebugPanel(); return; } 
        if (isRightCtrlPressed) { 
            switch(event.code) { 
                case 'Numpad1': if (player.health < player.maxHealth) { player.health++; playSound(sounds.coin); } return;
                case 'Numpad2': if (player.health > 1) { player.health--; } return;
                case 'Numpad3': infiniteInvincibilityCheat = !infiniteInvincibilityCheat; if(!infiniteInvincibilityCheat && player) player.isInvincible=false; updateDebugPanelUI(); return;
                case 'Numpad4': score += 100; return;
                case 'Numpad5': score = Math.max(0, score - 100); return;
                case 'Numpad6': scoreLockCheat = !scoreLockCheat; updateDebugPanelUI(); return;
                case 'Numpad7': debugMode = !debugMode; updateDebugPanelUI(); return;
                case 'Numpad8': init(false, true); return; 
                case 'Numpad9': phaseOneComplete = true; initPhaseTwo(); return; 
                case 'Numpad0': if(boss) { boss.health-=10; playSound(sounds.damage); } if(finalBoss) { finalBoss.takeDamage(2); } return;
                case 'Delete': localStorage.removeItem('gameBeaten'); alert('Save Game Resetado!'); location.reload(); return;
            }
        }
        if (isLeftCtrlPressed) {
            let typeToSelect = null;
            switch(event.code) {
                case 'Digit1': typeToSelect = 'enemy-straight'; break;
                case 'Digit2': typeToSelect = 'enemy-homing'; break;
                case 'Digit3': typeToSelect = 'enemy-charger'; break;
                case 'Digit4': typeToSelect = 'enemy-rebound'; break;
                case 'Digit5': typeToSelect = 'enemy-patrol'; break;
                case 'Digit6': typeToSelect = 'enemy-rock'; break;
                case 'Digit7': typeToSelect = 'item-coin'; break;
                case 'Digit8': typeToSelect = 'item-health'; break;
                case 'Digit9': typeToSelect = 'obj-chest'; break;
                case 'Digit0': typeToSelect = 'obj-window'; break;
                case 'Minus': typeToSelect = 'obj-falling'; break;
            }
            if (typeToSelect) {
                if (selectedSpawnType === typeToSelect) { selectedSpawnType = null; canvas.style.cursor = 'default'; screenMessage = { text: "SPAWN CANCELADO", lifespan: 1 }; } 
                else { selectedSpawnType = typeToSelect; canvas.style.cursor = 'crosshair'; let prettyName = typeToSelect.replace('enemy-', '').replace('item-', '').replace('obj-', '').toUpperCase(); screenMessage = { text: `SPAWN: ${prettyName}`, lifespan: 1.5 }; }
                updateDebugPanelUI();
            }
        }
    } 
    
    if (event.code === keyMap.pause) { togglePauseGame(); return; } 
    if (event.code === keyMap.left) keys.left = true; 
    if (event.code === keyMap.right) keys.right = true; 
    if (event.code === keyMap.down && player.onPassableSurface) { player.y += 10; player.velocityY = 180; player.onPassableSurface = false; } 
    
    if (event.code === keyMap.up) {
        if (event.repeat) return;
        keys.space = true; 
        if (player.canJump()) { player.jump(); }
    }

    if (event.code === keyMap.interact) {
        if (!player.isJumping) {
            if ((gameState === 'playing' || gameState === 'bossBattle') && player.canInteractWithChest) {
                chestToOpen = player.canInteractWithChest; player.canInteractWithChest = null;
            }
            if (isVerticalPhase()) {
                const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
                for (const platform of platforms) {
                    if (platform.hasWindowTrap) {
                        const wW = 60; const wH = 90;
                        const wX = platform.x + (platform.width/2) - (wW/2); const wY = platform.y - wH;
                        if (isColliding(playerRect, {x: wX, y: wY, width: wW, height: wH})) { 
                            player.getCaptured(platform, { x: wX + wW/2, y: wY + wH/2 }); break; 
                        }
                    }
                }
            }
            if (gameState === 'finalBoss' && player.captureState === 'none') {
                if (player.heldDebris) {
                    const weakPoints = finalBoss.getBodyHitboxes(verticalScrollOffset);
                    const head = weakPoints.find(h => h.type === 'circle');
                    if (head) { player.heldDebris.throwAt(head.x, head.y + verticalScrollOffset); bossDebris.push(player.heldDebris); player.heldDebris = null; playSound(sounds.jump); }
                } else if (player.canPickUpDebris) { 
                    player.heldDebris = player.canPickUpDebris; const idx = bossDebris.indexOf(player.canPickUpDebris); if (idx > -1) bossDebris.splice(idx, 1); player.canPickUpDebris = null; playSound(sounds.coin);
                }
            }
        }
    }

    if (event.code === keyMap.restart) { init(false, true); return; } 
}

function handlePausedInput(event) { 
    if (event.code === 'ArrowUp') { selectedPauseOption = Math.max(0, selectedPauseOption - 1); } 
    else if (event.code === 'ArrowDown') { selectedPauseOption = Math.min(2, selectedPauseOption + 1); } 
    // CORREÇÃO: Removemos || 'Space'
    else if (event.code === 'Enter' || event.code === keyMap.interact) { 
        if (selectedPauseOption === 0) { gameState = previousStateForPause || 'playing'; setTargetMusicVolumeFactor(gameState); } 
        else if (selectedPauseOption === 1) { 
            gameState = 'options'; optionsState = 'main'; selectedOptionMain = 0; 
            setTargetMusicVolumeFactor(gameState); 
        } 
        else if (selectedPauseOption === 2) { init(); } 
    } 
    else if (event.code === keyMap.pause) { gameState = previousStateForPause || 'playing'; setTargetMusicVolumeFactor(gameState); } 
}

function handleOptionsInput(event) {
    if (bindingAction) {
        event.preventDefault(); 
        if (event.code === 'Escape') { bindingAction = null; } 
        else {
            const isDuplicate = Object.values(keyMap).includes(event.code);
            if (isDuplicate && keyMap[bindingAction] !== event.code) {
                const existingAction = Object.keys(keyMap).find(key => keyMap[key] === event.code);
                keyMap[existingAction] = keyMap[bindingAction]; 
            }
            keyMap[bindingAction] = event.code; 
            localStorage.setItem('superAIKeyMap', JSON.stringify(keyMap)); 
            bindingAction = null; playSound(sounds.coin);
        }
        return;
    }

    if (optionsState === 'main') {
        if (event.code === 'Escape') { gameState = 'paused'; setTargetMusicVolumeFactor(gameState); return; }
        if (event.code === 'ArrowUp') { selectedOptionMain = Math.max(0, selectedOptionMain - 1); }
        else if (event.code === 'ArrowDown') { selectedOptionMain = Math.min(3, selectedOptionMain + 1); } 
        // CORREÇÃO: Removemos || 'Space'
        else if (event.code === 'Enter' || event.code === keyMap.interact) {
            if (selectedOptionMain === 0) { optionsState = 'audio'; selectedAudioSetting = 0; setTargetMusicVolumeFactor(gameState); } 
            else if (selectedOptionMain === 1) { optionsState = 'controls'; selectedAudioSetting = 0; setTargetMusicVolumeFactor(gameState); } 
            else if (selectedOptionMain === 2) { reduceParticles = !reduceParticles; playSound(sounds.coin); }
            else if (selectedOptionMain === 3) { gameState = 'paused'; setTargetMusicVolumeFactor(gameState); playSound(sounds.coin); }
        }
    } else if (optionsState === 'audio') {
        if (event.code === 'Escape') { optionsState = 'main'; setTargetMusicVolumeFactor(gameState); return; }
        let sfxVolumeChanged = false;
        if (event.code === 'ArrowUp') { selectedAudioSetting = Math.max(0, selectedAudioSetting - 1); } 
        else if (event.code === 'ArrowDown') { selectedAudioSetting = Math.min(2, selectedAudioSetting + 1); } 
        else if (event.code === 'Enter' || event.code === keyMap.interact) { if (selectedAudioSetting === 2) { optionsState = 'main'; playSound(sounds.coin); setTargetMusicVolumeFactor(gameState); } }
        else if (event.code === 'ArrowLeft') { 
            if (selectedAudioSetting === 0) { musicVolume = Math.max(0, musicVolume - 0.05); } 
            else if (selectedAudioSetting === 1) { let old = sfxVolume; sfxVolume = Math.max(0, sfxVolume - 0.05); if (sfxVolume !== old) sfxVolumeChanged = true; } 
            applyAndSaveVolumes(); if (sfxVolumeChanged) playSound(sounds.coin); 
        } 
        else if (event.code === 'ArrowRight') { 
            if (selectedAudioSetting === 0) { musicVolume = Math.min(1, musicVolume + 0.05); } 
            else if (selectedAudioSetting === 1) { let old = sfxVolume; sfxVolume = Math.min(1, sfxVolume + 0.05); if (sfxVolume !== old) sfxVolumeChanged = true; } 
            applyAndSaveVolumes(); if (sfxVolumeChanged) playSound(sounds.coin); 
        }
    } else if (optionsState === 'controls') {
        const actions = Object.keys(keyMap);
        const maxIndex = actions.length;
        if (event.code === 'Escape') { optionsState = 'main'; setTargetMusicVolumeFactor(gameState); return; }
        if (event.code === 'ArrowUp') { selectedAudioSetting = Math.max(0, selectedAudioSetting - 1); }
        else if (event.code === 'ArrowDown') { selectedAudioSetting = Math.min(maxIndex, selectedAudioSetting + 1); }
        else if (event.code === 'Enter' || event.code === keyMap.interact) {
            if (selectedAudioSetting === maxIndex) { optionsState = 'main'; playSound(sounds.coin); setTargetMusicVolumeFactor(gameState); } 
            else { bindingAction = actions[selectedAudioSetting]; playSound(sounds.jump); }
        }
    }
}

function handleEndScreenInput(event) {
    // CORREÇÃO: Removemos || 'Space'
    if (event.code === 'Enter' || event.code === keyMap.interact) {
        sounds.music.audio.currentTime = 0;
        
        if (gameWon) {
            if (finalBoss) {
                init();
            } else {
                initPhaseTwo();
            }
        } else {
            if (phaseOneComplete) {
                initPhaseTwo();
            } else {
                init(false, true); 
            }
        }
    }
}

function handleKeyDown(event) { 
    if (event.code === 'ControlRight') isRightCtrlPressed = true;
    if (event.code === 'ControlLeft') isLeftCtrlPressed = true;

    if (event.key === cheatCode[cheatCodeProgress]) {
        cheatCodeProgress++;
        if (cheatCodeProgress === cheatCode.length) {
            cheatsEnabled = !cheatsEnabled;
            const panel = document.getElementById('debugPanel');
            if (cheatsEnabled) {
                screenMessage = { text: "DEBUG MODE ATIVADO!", lifespan: 2 };
                panel.classList.add('active'); 
                toggleDebugPanel(false); 
                setupDebugListeners(); 
            } else {
                screenMessage = { text: "DEBUG MODE DESATIVADO!", lifespan: 2 };
                panel.classList.remove('active'); 
                toggleDebugPanel(false); 
                debugMode = false;
                infiniteInvincibilityCheat = false;
                if (player) player.isInvincible = false;
                scoreLockCheat = false;
                updateDebugPanelUI();
            }
            cheatCodeProgress = 0;
        }
    } else {
        cheatCodeProgress = 0;
    }

    switch (gameState) { 
        case 'start': handleStartInput(event); break; 
        case 'playing': case 'bossBattle': case 'phaseTwo': case 'finalBoss': handlePlayingInput(event); break; 
        case 'paused': handlePausedInput(event); break; 
        case 'options': handleOptionsInput(event); break; 
        case 'gameOver': case 'gameWon': handleEndScreenInput(event); break; 
    } 
}

function handleKeyUp(event) { 
    if (event.code === 'ControlRight') isRightCtrlPressed = false;
    if (event.code === 'ControlLeft') isLeftCtrlPressed = false;

    if (event.code === keyMap.up) keys.up = false;
    if (event.code === keyMap.up) keys.space = false;
    if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { 
        if (event.code === keyMap.left) keys.left = false; 
        if (event.code === keyMap.right) keys.right = false; 
    } 
}

function handleMouseDown(event) { 
    const mousePos = getMousePos(canvas, event); 
    if (gameState === 'options') { 
        if (optionsState === 'audio') {
            const sliderWidth = 300; const sliderHeight = 20; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10; const musicSliderY = canvas.height / 2 - 30; const sfxSliderY = canvas.height / 2 + 20; 
            if (isMouseOverRect(mousePos, sliderStartX, musicSliderY - 10, sliderWidth, sliderHeight + 20)) { draggingSlider = 'music'; handleMouseMove(event); } 
            else if (isMouseOverRect(mousePos, sliderStartX, sfxSliderY - 10, sliderWidth, sliderHeight + 20)) { draggingSlider = 'sfx'; handleMouseMove(event); } 
        }
    } 
}

function handleMouseUp(event) { 
    if (draggingSlider === 'sfx') playSound(sounds.coin); 
    draggingSlider = null; 
}

// game.js - PARTE 3 DE 4

function handleMouseMove(event) { 
    const mousePos = getMousePos(canvas, event); 
    const isGameActive = gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss';
    
    if (isGameActive) {
        if (selectedSpawnType) {
            if (mousePos.x > 300 || !debugPanelOpen) { 
                canvas.style.cursor = 'crosshair';
                isHoveringPause = false; 
            } else {
                canvas.style.cursor = 'default';
            }
        } else {
            if (isMouseOverRect(mousePos, PAUSE_BTN_X, PAUSE_BTN_Y, PAUSE_BTN_SIZE, PAUSE_BTN_SIZE)) {
                isHoveringPause = true; canvas.style.cursor = 'pointer';
            } else { 
                isHoveringPause = false; canvas.style.cursor = 'default'; 
            }
        }
    } else if (gameState !== 'options') { canvas.style.cursor = 'default'; isHoveringPause = false; }

    if (gameState === 'paused') { 
        const menuXCenter = canvas.width / 2; const optionYStart = canvas.height / 2; const lineHeight = 50; const hoverWidth = 250; const hoverHeight = 40; const textBaselineOffset = 25; 
        selectedPauseOption = -1;
        if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optionYStart - textBaselineOffset, hoverWidth, hoverHeight)) { selectedPauseOption = 0; } 
        if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optionYStart + lineHeight - textBaselineOffset, hoverWidth, hoverHeight)) { selectedPauseOption = 1; } 
        if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optionYStart + lineHeight * 2 - textBaselineOffset, hoverWidth, hoverHeight)) { selectedPauseOption = 2; } 
    } 
    else if (gameState === 'options') { 
        if (optionsState === 'main') {
            const menuXCenter = canvas.width / 2; const optionYStart = canvas.height / 2 - 30; const lineHeight = 50; const hoverWidth = 350; const hoverHeight = 40; const textBaselineOffset = 25; 
            selectedOptionMain = -1;
            for(let i=0; i<4; i++) { if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optionYStart + (i * lineHeight) - textBaselineOffset, hoverWidth, hoverHeight)) { selectedOptionMain = i; } }
        } else if (optionsState === 'audio') {
            const sliderWidth = 300; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10;
            if (!draggingSlider) {
                selectedAudioSetting = -1;
                const musicSliderY = canvas.height / 2 - 30; const sfxSliderY = canvas.height / 2 + 20; 
                if (isMouseOverRect(mousePos, sliderStartX, musicSliderY - 10, sliderWidth, 40)) { selectedAudioSetting = 0; } 
                if (isMouseOverRect(mousePos, sliderStartX, sfxSliderY - 10, sliderWidth, 40)) { selectedAudioSetting = 1; } 
                const backBtn = getBackButtonRect(canvas.width, canvas.height);
                if (isMouseOverRect(mousePos, backBtn.x, backBtn.y, backBtn.w, backBtn.h)) { selectedAudioSetting = 2; }
            } else {
                let newValue = (mousePos.x - sliderStartX) / sliderWidth; newValue = Math.max(0, Math.min(1, newValue));
                if (draggingSlider === 'music') { musicVolume = newValue; } else if (draggingSlider === 'sfx') { sfxVolume = newValue; }
                applyAndSaveVolumes();
            }
        } else if (optionsState === 'controls') {
            const layout = getControlsLayout(canvas.width / 2, canvas.height / 2 + 20); const backBtn = getBackButtonRect(canvas.width, canvas.height);
            selectedAudioSetting = -1;
            if (isMouseOverRect(mousePos, backBtn.x, backBtn.y, backBtn.w, backBtn.h)) { selectedAudioSetting = Object.keys(keyMap).length; } 
            else { for(let i=0; i<layout.length; i++) { const btn = layout[i]; if (isMouseOverRect(mousePos, btn.x, btn.y, btn.w, btn.h)) { selectedAudioSetting = i; } } }
        }
    } 
}

function handleClick(event) { 
    const mousePos = getMousePos(canvas, event);
    if (bindingAction) return; 

    const isGameActive = gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss';
    
    if (isGameActive) {
        if (selectedSpawnType) {
            if (mousePos.x > 300 || !debugPanelOpen) { 
               handleDebugSpawn(mousePos);
               return; 
            }
        }
        if (isMouseOverRect(mousePos, PAUSE_BTN_X, PAUSE_BTN_Y, PAUSE_BTN_SIZE, PAUSE_BTN_SIZE)) { togglePauseGame(); return; }
    }

    if (gameState === 'start') { 
        return; 
    } 
    
    if (gameState === 'options') {
        if (optionsState !== 'main') {
            const backBtn = getBackButtonRect(canvas.width, canvas.height);
            if (isMouseOverRect(mousePos, backBtn.x, backBtn.y, backBtn.w, backBtn.h)) { optionsState = 'main'; playSound(sounds.coin); setTargetMusicVolumeFactor(gameState); return; }
        }
        if (optionsState === 'main') {
            const menuXCenter = canvas.width / 2; const optionYStart = canvas.height / 2 - 30; const lineHeight = 50; const hoverWidth = 350; const hoverHeight = 40; const textBaselineOffset = 25; let optY = optionYStart - textBaselineOffset;
            if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optY, hoverWidth, hoverHeight)) { optionsState = 'audio'; selectedAudioSetting = 0; setTargetMusicVolumeFactor(gameState); return; } optY += lineHeight;
            if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optY, hoverWidth, hoverHeight)) { optionsState = 'controls'; selectedAudioSetting = -1; setTargetMusicVolumeFactor(gameState); return; } optY += lineHeight;
            if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optY, hoverWidth, hoverHeight)) { reduceParticles = !reduceParticles; playSound(sounds.coin); return; } optY += lineHeight; 
            if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optY, hoverWidth, hoverHeight)) { gameState = 'paused'; setTargetMusicVolumeFactor(gameState); playSound(sounds.coin); return; }
        } else if (optionsState === 'audio' && !draggingSlider) {
            const sliderWidth = 300; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10; const musicSliderY = canvas.height / 2 - 30; const sfxSliderY = canvas.height / 2 + 20; 
            if (isMouseOverRect(mousePos, sliderStartX, musicSliderY - 10, sliderWidth, 40)) { musicVolume = (mousePos.x - sliderStartX) / sliderWidth; musicVolume = Math.max(0, Math.min(1, musicVolume)); applyAndSaveVolumes(); } 
            else if (isMouseOverRect(mousePos, sliderStartX, sfxSliderY - 10, sliderWidth, 40)) { let old = sfxVolume; sfxVolume = (mousePos.x - sliderStartX) / sliderWidth; sfxVolume = Math.max(0, Math.min(1, sfxVolume)); if (sfxVolume !== old) playSound(sounds.coin); applyAndSaveVolumes(); } 
        } else if (optionsState === 'controls') {
            const layout = getControlsLayout(canvas.width / 2, canvas.height / 2 + 20);
            for(let i=0; i<layout.length; i++) { const btn = layout[i]; if (isMouseOverRect(mousePos, btn.x, btn.y, btn.w, btn.h)) { bindingAction = btn.action; playSound(sounds.jump); return; } }
        }
    } else if (gameState === 'paused') { 
        const menuXCenter = canvas.width / 2; const optionYStart = canvas.height / 2; const lineHeight = 50; const hoverWidth = 250; const hoverHeight = 40; const textBaselineOffset = 25; 
        if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optionYStart - textBaselineOffset, hoverWidth, hoverHeight)) { gameState = previousStateForPause || 'playing'; setTargetMusicVolumeFactor(gameState); } 
        else if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optionYStart + lineHeight - textBaselineOffset, hoverWidth, hoverHeight)) { gameState = 'options'; optionsState = 'main'; selectedOptionMain = 0; setTargetMusicVolumeFactor(gameState); } 
        else if (isMouseOverRect(mousePos, menuXCenter - hoverWidth/2, optionYStart + lineHeight * 2 - textBaselineOffset, hoverWidth, hoverHeight)) { 
            init(); 
        } 
    } 
}
function applyAndSaveVolumes(){ applyVolumes(); localStorage.setItem('musicVolume', musicVolume); localStorage.setItem('sfxVolume', sfxVolume); }

function togglePauseGame() {
    if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { previousStateForPause = gameState; gameState = 'paused'; setTargetMusicVolumeFactor(gameState); keys.left = false; keys.right = false; } 
    else if (gameState === 'paused') { gameState = previousStateForPause || 'playing'; setTargetMusicVolumeFactor(gameState); }
}

function handleBodyClick(event) { if (event.target === document.body || event.target === mainWrapper) { if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { togglePauseGame(); } } }

// --- FUNÇÕES DE DESENHO (DRAW) ---
function drawParticles(ctx, isVertical = false, layer = 'front') { 
    ctx.save(); 
    for (let i = particles.length - 1; i >= 0; i--) { 
        const p = particles[i]; 
        if (p.layer !== layer && !(layer === 'front' && !p.layer)) continue;
        if (!p || isNaN(p.x)) continue; 
        let px = Math.floor(p.isScreenSpace ? p.x : p.x - (isVertical ? 0 : scrollOffset));
        let py = Math.floor(p.isScreenSpace ? p.y : p.y - (isVertical ? verticalScrollOffset : 0));
        ctx.globalAlpha = p.lifespan / p.initialLifespan; 
        ctx.fillStyle = p.color; 
        ctx.fillRect(px, py, p.size, p.size); 
    } 
    ctx.restore(); 
}

// CORREÇÃO: Efeito de Tensão Lateral para Fase 1
function drawPhaseOneDarkness(ctx) {
    if (!boss || boss.darknessAlpha <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = boss.darknessAlpha * 0.9; 

    // Gradiente Esquerdo (Esquerda para Direita)
    const gradL = ctx.createLinearGradient(0, 0, 200, 0); // 200px de largura
    gradL.addColorStop(0, 'black');
    gradL.addColorStop(1, 'transparent');
    ctx.fillStyle = gradL;
    ctx.fillRect(0, 0, 200, ctx.canvas.height);

    // Gradiente Direito (Direita para Esquerda)
    const gradR = ctx.createLinearGradient(ctx.canvas.width - 200, 0, ctx.canvas.width, 0);
    gradR.addColorStop(0, 'transparent');
    gradR.addColorStop(1, 'black');
    ctx.fillStyle = gradR;
    ctx.fillRect(ctx.canvas.width - 200, 0, 200, ctx.canvas.height);

    ctx.restore();
}

function drawTowerLightingOverlay(targetCtx) {
    if (!finalBoss || !finalBoss.isInRageMode) return;
    targetCtx.globalAlpha = finalBoss.rageLightingAlpha;
    const lightingOverlay = targetCtx.createLinearGradient(0, 0, targetCtx.canvas.width, 0);
    lightingOverlay.addColorStop(0.2, 'rgba(0, 0, 0, 0.5)'); lightingOverlay.addColorStop(0.5, 'rgba(0, 0, 0, 0)'); lightingOverlay.addColorStop(0.8, 'rgba(0, 0, 0, 0.5)');
    targetCtx.fillStyle = lightingOverlay; targetCtx.fillRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height); targetCtx.globalAlpha = 1.0;
}

function drawFogOverlay(isVertical = false) {
    platforms.forEach(p => {
        if (p.visualType === 'cloud') {
            const px = p.x - (isVertical ? 0 : scrollOffset); const py = p.y - (isVertical ? verticalScrollOffset : 0);
            if (px + p.width > 0 && px < canvas.width && py + p.height > 0 && py < canvas.height) { p.drawFog(offscreenCtx, px, py); }
        }
    });
}

function drawProjectileIndicators() { 
    projectileIndicators.forEach(p => { 
        if (!p || isNaN(p.lifespan)) return; 
        let indicatorColor = 'rgba(106, 51, 129, 0.7)';
        if (p.projectileType === 'homing') indicatorColor = 'rgba(184, 147, 11, 0.7)'; 
        else if (p.projectileType === 'rebound') indicatorColor = 'rgba(93, 173, 226, 0.7)'; 
        else if (p.projectileType === 'charger') indicatorColor = 'rgba(46, 139, 87, 0.7)'; 
        else if (p.projectileType === 'falling_rock') indicatorColor = 'rgba(128, 128, 128, 0.7)'; 
        
        const progress = Math.max(0, 1 - (p.lifespan / p.initialLifespan)); 
        const radius = 25 * progress; 
        const alpha = Math.max(0, 1 - progress); 
        offscreenCtx.save(); offscreenCtx.globalAlpha = alpha; offscreenCtx.beginPath(); offscreenCtx.arc(p.x + 17.5, p.y + 17.5, radius, 0, Math.PI * 2); offscreenCtx.fillStyle = indicatorColor; offscreenCtx.fill(); offscreenCtx.restore(); 
    }); 
}

function drawCoinAnimations(isVertical = false) {
    for (const coin of coinAnimations) {
        const cx = coin.x - (isVertical ? 0 : scrollOffset); const cy = coin.y - (isVertical ? verticalScrollOffset : 0); const radius = 8;
        const grad = offscreenCtx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
        grad.addColorStop(0, '#feca57'); grad.addColorStop(1, '#f39c12');
        offscreenCtx.fillStyle = grad; offscreenCtx.beginPath(); offscreenCtx.arc(cx, cy, radius, 0, Math.PI * 2); offscreenCtx.fill();
        offscreenCtx.strokeStyle = '#b8930b'; ctx.lineWidth = 2; ctx.stroke();
    }
}

function drawInteractionPrompts(ctx, isVertical = false) {
    ctx.save();
    
    // Atualiza o frame da animação apenas se o jogo não estiver pausado
    if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') {
        promptAnimFrame += 0.15;
    }
    
    const pulse = Math.sin(promptAnimFrame); 
    const alpha = 0.7 + pulse * 0.3; 
    ctx.globalAlpha = alpha;
    
    interactionPrompts.forEach(prompt => {
        const px = prompt.x - (isVertical ? 0 : scrollOffset); const py = prompt.y - (isVertical ? verticalScrollOffset : 0);
        
        // 1. Quadrado Branco (Background)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; 
        ctx.strokeStyle = 'rgba(50, 50, 50, 0.9)'; 
        ctx.lineWidth = 2;
        
        ctx.beginPath(); ctx.roundRect(px - 14, py - 14, 28, 28, [4]); ctx.fill(); ctx.stroke();
        
        // 2. Rabinho do Balão (Agora desenhado EMBAIXO do quadrado, para não criar "seta fantasma")
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Mesma cor do background
        ctx.beginPath(); 
        ctx.moveTo(px - 4, py + 14); // Canto inferior esquerdo (ajustado)
        ctx.lineTo(px + 4, py + 14); // Canto inferior direito (ajustado)
        ctx.lineTo(px, py + 20);     // Ponta para baixo
        ctx.closePath(); 
        ctx.fill();
        ctx.stroke(); // Opcional: contorno no rabinho também
        
        // 3. Conteúdo (Seta ou Texto)
        ctx.fillStyle = '#2c3e50'; 
        
        const key = keyMap.interact;
        const isArrow = key.startsWith('Arrow');
        
        if (isArrow) {
            ctx.save();
            ctx.translate(px, py);
            let rotation = 0;
            if (key === 'ArrowRight') rotation = Math.PI / 2;
            if (key === 'ArrowDown') rotation = Math.PI;
            if (key === 'ArrowLeft') rotation = -Math.PI / 2;
            ctx.rotate(rotation);
            
            // Desenho Vetorial da Seta (igual ao menu)
            ctx.beginPath();
            ctx.moveTo(0, -10); ctx.lineTo(8, 3); ctx.lineTo(3, 3); ctx.lineTo(3, 9);
            ctx.lineTo(-3, 9); ctx.lineTo(-3, 3); ctx.lineTo(-8, 3);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else {
            const label = formatKeyName(key);
            ctx.font = label.length > 3 ? '8px "Press Start 2P"' : '10px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Leve ajuste vertical para centralizar visualmente a fonte pixelada
            ctx.fillText(label, px, py + 1);
        }
    });
    ctx.restore();
}

function drawCanvasPauseButton(targetCtx) {
    targetCtx.save();
    const cx = PAUSE_BTN_X + PAUSE_BTN_SIZE / 2; const cy = PAUSE_BTN_Y + PAUSE_BTN_SIZE / 2;
    targetCtx.translate(cx, cy); targetCtx.scale(currentPauseButtonScale, currentPauseButtonScale); targetCtx.translate(-cx, -cy);
    const grad = targetCtx.createLinearGradient(cx, cy - 12.5, cx, cy + 12.5); grad.addColorStop(0, '#ffffff'); grad.addColorStop(1, '#dddddd'); targetCtx.fillStyle = grad;
    targetCtx.beginPath(); targetCtx.roundRect(cx - 5 - 8, cy - 12.5, 8, 25, 2); targetCtx.fill();
    targetCtx.beginPath(); targetCtx.roundRect(cx + 5, cy - 12.5, 8, 25, 2); targetCtx.fill();
    targetCtx.restore();
}

function drawGameStats() { 
    // CORREÇÃO: Ritmo de piscar mais lento (*6 em vez de *15)
    let isGold = false;
    if (scoreBlinkTimer > 0) {
         if (Math.floor(scoreBlinkTimer * 6) % 2 === 0) isGold = true;
    }

    ctx.save();
    ctx.font = '24px "Press Start 2P", cursive';
    ctx.textAlign = 'left';
    
    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillText(`Pontos: ${score}`, 22, 42);

    let grad;
    if (isGold) {
        grad = ctx.createLinearGradient(0, 40 - 24, 0, 40);
        grad.addColorStop(0, '#feca57'); // Amarelo Claro
        grad.addColorStop(1, '#f39c12'); // Laranja Dourado
    } else {
        grad = ctx.createLinearGradient(0, 40 - 24, 0, 40);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, '#d0d0d0');
    }

    ctx.fillStyle = grad;
    ctx.fillText(`Pontos: ${score}`, 20, 40);
    ctx.restore();

    let distanceText = isVerticalPhase() ? `Altura: ${Math.max(0, Math.floor((phaseTwoStartScrollY - verticalScrollOffset) / 10))}m` : `Distancia: ${Math.floor(scrollOffset / 50)}m`;
    drawGradientText(distanceText, 20, 65, 18, 'left', true, ctx);
    const startX = 20; const startY = 85; 
    for (let i = 0; i < player.maxHealth; i++) { const x = startX + i * 38; ctx.fillStyle = '#555'; ctx.beginPath(); ctx.moveTo(x + 14, startY + 11.2); ctx.bezierCurveTo(x, startY, x, startY + 19.6, x + 14, startY + 28); ctx.bezierCurveTo(x + 28, startY + 19.6, x + 28, startY, x + 14, startY + 11.2); ctx.closePath(); ctx.fill(); } 
    for (let i = 0; i < player.health; i++) { const x = startX + i * 38; const grad = ctx.createLinearGradient(x, startY, x, startY + 28); grad.addColorStop(0, '#ff8b8b'); grad.addColorStop(1, '#d13423'); ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(x + 14, startY + 11.2); ctx.bezierCurveTo(x, startY, x, startY + 19.6, x + 14, startY + 28); ctx.bezierCurveTo(x + 28, startY + 19.6, x + 28, startY, x + 14, startY + 11.2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#a4281b'; ctx.lineWidth = 2; ctx.stroke(); } 
}

function drawFinalBossUI() {
    if (!finalBoss) return;
    const bw = canvas.width * 0.6; const bx = canvas.width / 2 - bw / 2; const by = canvas.height - 60; 
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(bx, by, bw, 30);
    const hpPct = finalBoss.health / finalBoss.maxHealth;
    const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0); grad.addColorStop(0, '#e67e22'); grad.addColorStop(1, '#f1c40f'); ctx.fillStyle = grad; ctx.fillRect(bx, by, bw * hpPct, 30);
    ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 4; ctx.strokeRect(bx, by, bw, 30);
    drawGradientText('MÁQUINA ASCENDENTE', canvas.width / 2, by - 15, 18, 'center', true, ctx);
}

function drawBossUI() { 
    if (!boss) return; const bw = canvas.width / 2; const bx = canvas.width / 2 - bw / 2; const by = canvas.height - 50; 
    ctx.fillStyle = '#555'; ctx.fillRect(bx, by, bw, 25);
    const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0); grad.addColorStop(0, '#ff6b6b'); grad.addColorStop(1, '#e74c3c'); ctx.fillStyle = grad; ctx.fillRect(bx, by, bw * (boss.health / boss.maxHealth), 25);
    ctx.strokeStyle = 'white'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, 25); drawGradientText('SUPER AI BOSS', canvas.width / 2, by - 15, 18, 'center', true, ctx);
}

function drawPauseMenu(deltaTime) { 
    const targetScales = [ 
        (selectedPauseOption === 0) ? BUTTON_HOVER_SCALE : 1.0, 
        (selectedPauseOption === 1) ? BUTTON_HOVER_SCALE : 1.0,
        (selectedPauseOption === 2) ? BUTTON_HOVER_SCALE : 1.0 
    ];
    
    // Safety check
    while(menuAnimStates.pause.length < 3) menuAnimStates.pause.push(1.0);

    for (let i = 0; i < 3; i++) { menuAnimStates.pause[i] += (targetScales[i] - menuAnimStates.pause[i]) * 15 * deltaTime; }
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height); 
    drawGradientText('PAUSADO', canvas.width / 2, canvas.height / 2 - 80, 40, 'center', true, ctx); 
    
    const opts = ['Continuar', 'Opções', 'Voltar Para o Menu']; 
    
    for (let i = 0; i < opts.length; i++) { 
        const isSel = (selectedPauseOption === i); 
        const scale = menuAnimStates.pause[i];
        const size = 24 * scale; 
        const grad = ctx.createLinearGradient(0, (canvas.height/2 + i*50) - size, 0, canvas.height/2 + i*50); 
        grad.addColorStop(0, isSel ? '#ffffff' : '#e0e0e0'); grad.addColorStop(1, isSel ? '#dddddd' : '#b0b0b0'); 
        ctx.fillStyle = grad; ctx.font = `${size}px "Press Start 2P"`; ctx.textAlign = 'center'; ctx.fillText(opts[i], canvas.width / 2, canvas.height/2 + i*50); 
    } 
}

function drawOptionsMenu(deltaTime) { 
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height); 
    let titleText = 'OPÇÕES';
    if (optionsState === 'audio') titleText = 'SOM'; if (optionsState === 'controls') titleText = 'CONTROLES';
    drawGradientText(titleText, canvas.width / 2, canvas.height / 2 - 130, 40, 'center', true, ctx); 

    if (optionsState === 'main') {
        const options = ['Som', 'Controle', `Reduzir Partículas: ${reduceParticles ? 'ON' : 'OFF'}`, 'Voltar'];
        const startY = canvas.height / 2 - 30;
        for (let i = 0; i < options.length; i++) {
            const isSelected = (selectedOptionMain === i);
            const target = isSelected ? BUTTON_HOVER_SCALE : 1.0;
            menuAnimStates.main[i] += (target - menuAnimStates.main[i]) * 15 * deltaTime;
            const scale = menuAnimStates.main[i]; const size = 24 * scale; const yPos = startY + i * 50;
            const grad = ctx.createLinearGradient(0, yPos - size, 0, yPos);
            grad.addColorStop(0, isSelected ? '#ffffff' : '#e0e0e0'); grad.addColorStop(1, isSelected ? '#dddddd' : '#b0b0b0');
            ctx.fillStyle = grad; ctx.font = `${size}px "Press Start 2P"`; ctx.textAlign = 'center'; ctx.fillText(options[i], canvas.width / 2, yPos);
        }
    } else if (optionsState === 'audio') {
        const backTarget = (selectedAudioSetting === 2) ? BUTTON_HOVER_SCALE : 1.0;
        menuAnimStates.audio[2] += (backTarget - menuAnimStates.audio[2]) * 15 * deltaTime;
        const sliderWidth = 300; const sliderHeight = 20; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10; const labelXPosition = sliderStartX - 20; 
        const musicSliderY = canvas.height / 2 - 30; 
        ctx.font = '24px "Press Start 2P"'; ctx.textAlign = 'right'; ctx.fillStyle = '#d0d0d0'; ctx.fillText('Música', labelXPosition, musicSliderY + sliderHeight / 2 + 5);
        ctx.fillStyle = '#555'; ctx.fillRect(sliderStartX, musicSliderY, sliderWidth, sliderHeight); 
        const musicGrad = ctx.createLinearGradient(sliderStartX, 0, sliderStartX + sliderWidth, 0); musicGrad.addColorStop(0, '#f1c40f'); musicGrad.addColorStop(1, '#f39c12'); 
        ctx.fillStyle = musicGrad; ctx.fillRect(sliderStartX, musicSliderY, sliderWidth * musicVolume, sliderHeight); 
        const sfxSliderY = canvas.height / 2 + 20; 
        ctx.font = '24px "Press Start 2P"'; ctx.textAlign = 'right'; ctx.fillStyle = '#d0d0d0'; ctx.fillText('Efeitos', labelXPosition, sfxSliderY + sliderHeight / 2 + 5);
        ctx.fillStyle = '#555'; ctx.fillRect(sliderStartX, sfxSliderY, sliderWidth, sliderHeight); 
        const sfxGrad = ctx.createLinearGradient(sliderStartX, 0, sliderStartX + sliderWidth, 0); sfxGrad.addColorStop(0, '#f1c40f'); sfxGrad.addColorStop(1, '#f39c12'); 
        ctx.fillStyle = sfxGrad; ctx.fillRect(sliderStartX, sfxSliderY, sliderWidth * sfxVolume, sliderHeight); 
        const knobGrad = ctx.createLinearGradient(0, -14, 0, 14); knobGrad.addColorStop(0, '#fff'); knobGrad.addColorStop(1, '#ccc'); 
        ctx.fillStyle = knobGrad; ctx.strokeStyle = '#333'; ctx.lineWidth = 2; 
        ctx.beginPath(); ctx.roundRect(sliderStartX + sliderWidth * musicVolume - 6, musicSliderY + 10 - 14, 12, 28, [3]); ctx.fill(); ctx.stroke(); 
        ctx.beginPath(); ctx.roundRect(sliderStartX + sliderWidth * sfxVolume - 6, sfxSliderY + 10 - 14, 12, 28, [3]); ctx.fill(); ctx.stroke(); 
        const isSelected = (selectedAudioSetting === 2); const backBtn = getBackButtonRect(canvas.width, canvas.height); const textY = backBtn.y + 25; 
        const scale = menuAnimStates.audio[2]; const size = 24 * scale;
        const gradT = ctx.createLinearGradient(0, textY - size, 0, textY);
        gradT.addColorStop(0, isSelected ? '#ffffff' : '#e0e0e0'); gradT.addColorStop(1, isSelected ? '#dddddd' : '#b0b0b0');
        ctx.fillStyle = gradT; ctx.font = `${size}px "Press Start 2P"`; ctx.textAlign = 'center'; ctx.fillText("VOLTAR", canvas.width / 2, textY);
    } else if (optionsState === 'controls') {
        const layout = getControlsLayout(canvas.width / 2, canvas.height / 2 + 20); 
        const backBtn = getBackButtonRect(canvas.width, canvas.height);
        
        const maxIndex = Object.keys(keyMap).length;
        if (typeof menuAnimStates.controls[maxIndex] === 'undefined') { menuAnimStates.controls[maxIndex] = 1.0; }
        const backTarget = (selectedAudioSetting === maxIndex) ? BUTTON_HOVER_SCALE : 1.0;
        menuAnimStates.controls[maxIndex] += (backTarget - menuAnimStates.controls[maxIndex]) * 15 * deltaTime;
        for (let i = 0; i < layout.length; i++) {
            const btn = layout[i]; const isSelected = (selectedAudioSetting === i); const isBinding = (bindingAction === btn.action);
            const target = (isSelected || isBinding) ? BUTTON_HOVER_SCALE : 1.0;
            menuAnimStates.controls[i] += (target - menuAnimStates.controls[i]) * 15 * deltaTime;
            const scale = menuAnimStates.controls[i];
            let drawW = btn.w * scale; let drawH = btn.h * scale; let drawX = btn.x - (drawW - btn.w) / 2; let drawY = btn.y - (drawH - btn.h) / 2;
            const btnGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + drawH);
            if (isBinding) { btnGrad.addColorStop(0, '#e74c3c'); btnGrad.addColorStop(1, '#c0392b'); } else { btnGrad.addColorStop(0, '#ecf0f1'); btnGrad.addColorStop(1, '#bdc3c7'); }
            ctx.fillStyle = btnGrad; ctx.strokeStyle = isSelected ? '#ffffff' : '#7f8c8d'; ctx.lineWidth = isSelected ? 3 : 2;
            ctx.beginPath(); ctx.roundRect(drawX, drawY, drawW, drawH, 6); ctx.fill(); ctx.stroke();
            
            const code = keyMap[btn.action] || ''; 
            const isArrow = code.startsWith('Arrow');
            
            if (isArrow) {
                ctx.save();
                ctx.translate(drawX + drawW/2, drawY + drawH/2);
                let rotation = 0;
                if (code === 'ArrowDown') rotation = Math.PI;
                else if (code === 'ArrowRight') rotation = Math.PI / 2;
                else if (code === 'ArrowLeft') rotation = -Math.PI / 2;
                ctx.rotate(rotation);
                ctx.scale(scale, scale);
                ctx.fillStyle = '#2c3e50';
                ctx.beginPath();
                ctx.moveTo(0, -10); ctx.lineTo(8, 3); ctx.lineTo(3, 3); ctx.lineTo(3, 9);
                ctx.lineTo(-3, 9); ctx.lineTo(-3, 3); ctx.lineTo(-8, 3);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else {
                let keyName = isBinding ? '...' : formatKeyName(code);
                ctx.save(); ctx.translate(drawX + drawW/2, drawY + drawH/2); ctx.scale(scale, scale); ctx.fillStyle = '#2c3e50'; ctx.font = '12px "Press Start 2P"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(keyName, 0, 2); ctx.restore();
            }
            if (['up', 'interact', 'pause', 'restart'].includes(btn.action)) {
                ctx.fillStyle = '#d0d0d0'; ctx.font = '10px "Press Start 2P"'; ctx.textBaseline = 'alphabetic';
                if (btn.action === 'up') { ctx.textAlign = 'center'; ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y - 10); } else { ctx.textAlign = 'right'; ctx.fillText(btn.label, btn.x - 15, btn.y + btn.h / 2 + 5); }
            }
        }
        
        const textY = backBtn.y + 25; const backScale = menuAnimStates.controls[maxIndex]; const backSize = 24 * backScale; const isSelected = (selectedAudioSetting === maxIndex);
        const grad = ctx.createLinearGradient(0, textY - backSize, 0, textY); grad.addColorStop(0, isSelected ? '#ffffff' : '#e0e0e0'); grad.addColorStop(1, isSelected ? '#dddddd' : '#b0b0b0');
        ctx.fillStyle = grad; ctx.font = `${backSize}px "Press Start 2P"`; ctx.textAlign = 'center'; ctx.fillText("VOLTAR", canvas.width / 2, textY);
    }
}

function drawStartScreen() { 
    drawGradientText('Super AI Bros.', canvas.width / 2, canvas.height / 2 - 40, 48, 'center', true, ctx);
    
    const interactCode = keyMap.interact || 'Space';
    let interactKeyFull = interactCode.replace('Key', '').replace('Digit', '').toUpperCase();
    if (interactCode === 'Space') interactKeyFull = 'BARRA DE ESPAÇO';
    if (interactCode === 'Enter') interactKeyFull = 'ENTER';
    if (interactCode.startsWith('Arrow')) interactKeyFull = interactCode.replace('Arrow', 'SETA ').toUpperCase();

    drawGradientText(`Pressione ${interactKeyFull} para iniciar!`, canvas.width / 2, canvas.height / 2 + 30, 20, 'center', true, ctx);

    if (hasBeatenGame) {
        drawGradientText('Código Secreto: gubed', canvas.width / 2, canvas.height / 2 + 80, 20, 'center', true, ctx);
    }
}

function drawEndScreen(isVictory) {
    const overlayColor = isVictory ? 'rgba(12, 10, 26, 0.85)' : 'rgba(40, 10, 10, 0.85)';
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (isVictory) { 
        drawGradientText('VOCÊ VENCEU!', canvas.width / 2, canvas.height / 2 - 50, 48, 'center', true, ctx); 
    } else { 
        drawGradientText('FIM DE JOGO', canvas.width / 2, canvas.height / 2 - 50, 48, 'center', true, ctx); 
    }

    let endMetricLabel = (finalBoss || (phaseOneComplete && !isVictory)) ? 'Altura Final' : 'Distância Final';
    let endMetricValue = (finalBoss || (phaseOneComplete && !isVictory)) ? Math.max(0, Math.floor((phaseTwoStartScrollY - verticalScrollOffset) / 10)) : Math.floor(scrollOffset / 50);
    
    if (!isVictory) {
        drawGradientText(`Pontuação Final: ${score}`, canvas.width / 2, canvas.height / 2 - 10, 20, 'center', true, ctx);
        drawGradientText(`${endMetricLabel}: ${endMetricValue}m`, canvas.width / 2, canvas.height / 2 + 20, 20, 'center', true, ctx);
    } else {
        drawGradientText(`${endMetricLabel}: ${endMetricValue}m`, canvas.width / 2, canvas.height / 2 + 20, 24, 'center', true, ctx);
    }

    const interactCode = keyMap.interact || 'Space';
    let interactKeyFull = interactCode.replace('Key', '').replace('Digit', '').toUpperCase();
    if (interactCode === 'Space') interactKeyFull = 'BARRA DE ESPAÇO';
    if (interactCode === 'Enter') interactKeyFull = 'ENTER';
    if (interactCode.startsWith('Arrow')) interactKeyFull = interactCode.replace('Arrow', 'SETA ').toUpperCase();

    const continueY = isVictory ? 130 : 100;
    
    if (isVictory && finalBoss) { 
         drawGradientText('DEBUG MODE DESBLOQUEADO!', canvas.width / 2, canvas.height / 2 + 60, 14, 'center', true, ctx);
         drawGradientText('Código: gubed', canvas.width / 2, canvas.height / 2 + 85, 14, 'center', true, ctx);
         drawGradientText(`Pressione ${interactKeyFull} para continuar`, canvas.width / 2, canvas.height / 2 + 130, 20, 'center', true, ctx);
    } else {
         drawGradientText(`Pressione ${interactKeyFull} para continuar`, canvas.width / 2, canvas.height / 2 + continueY, 20, 'center', true, ctx);
    }
}

function drawScreenMessages() {
    return;
}

// game.js - PARTE 4 DE 4 (LÓGICA DE JOGO, LOOP E DRAW PRINCIPAL)

// Variáveis para cálculo de FPS e Debug Info
let fpsTimer = 0;
let frameCount = 0;
let currentFps = 60;

function updateCoinAnimations(deltaTime) {
    if (coinRewardState.active && coinRewardState.toSpawn > 0) {
        coinRewardState.spawnTimer -= deltaTime;
        if (coinRewardState.spawnTimer <= 0) {
            coinRewardState.spawnTimer = COIN_ANIM_SPAWN_INTERVAL;
            coinRewardState.toSpawn--;

            coinAnimations.push({
                x: coinRewardState.spawnPosition.x,
                y: coinRewardState.spawnPosition.y,
                vx: (Math.random() - 0.5) * 80,
                vy: COIN_ANIM_START_VELOCITY_Y,
                lifespan: COIN_ANIM_LIFESPAN
            });
        }
    }
    if (coinRewardState.toSpawn === 0 && coinAnimations.length === 0) {
        coinRewardState.active = false;
    }

    for (let i = coinAnimations.length - 1; i >= 0; i--) {
        const coin = coinAnimations[i];
        coin.x += coin.vx * deltaTime;
        coin.y += coin.vy * deltaTime;
        coin.vy += COIN_ANIM_GRAVITY * deltaTime;
        coin.lifespan -= deltaTime;

        if (coin.lifespan <= 0) {
            if (!scoreLockCheat) {
                score += COIN_VALUE;
            }
            playSound(sounds.coin);
            
            if (!reduceParticles) {
                for (let k = 0; k < 8; k++) {
                    particles.push({
                        x: coin.x, y: coin.y, 
                        size: Math.random() * 4 + 2, 
                        color: '#feca57', 
                        lifespan: 0.5, initialLifespan: 0.5,
                        vx: (Math.random() - 0.5) * 200, 
                        vy: (Math.random() - 0.5) * 200, 
                        isScreenSpace: isVerticalPhase() ? false : true,
                        priority: 'high', 
                        layer: 'front',
                        ignoreFreeze: true
                    });
                }
            }
            coinAnimations.splice(i, 1);
        }
    }
}

function updateEnemies(deltaTime) { 
    enemies.forEach(enemy => { if (enemy instanceof Enemy) { const particleDataArray = enemy.update(deltaTime, player, scrollOffset, boss, platforms); if (Array.isArray(particleDataArray) && particleDataArray.length > 0) { particles.push(...particleDataArray); } } }); 
    enemies = enemies.filter(enemy => { if (!(enemy instanceof Enemy)) return false; 
        if(enemy.type === 'falling_rock') { return enemy.y < verticalScrollOffset + canvas.height + 100; }
        if (enemy.isScreenSpaceEntity) { return enemy.x + enemy.width > -50 && enemy.x < canvas.width + 50 && enemy.y > -enemy.height && enemy.y < canvas.height + enemy.height; } return enemy.x + enemy.width > scrollOffset && enemy.x < scrollOffset + canvas.width + enemy.width + 50; }); 
    if (gameState === 'playing' && (keys.left || keys.right) && enemySpawnCooldown <= 0 && Math.random() < ENEMY_SPAWN_CHANCE) { 
        let type = null; 
        const enemySpawnRoll = Math.random(); 
        let enemyXPos; 
        let enemySpeedToSet; 
        let isScreenEntityForThisSpawn = false; 
        
        if (score > 2000 && score < BOSS_TRIGGER_SCORE) {
            if (enemySpawnRoll < CHARGER_ENEMY_CHANCE) {
                type = 'charger';
                isScreenEntityForThisSpawn = true;
            } else if (enemySpawnRoll < CHARGER_ENEMY_CHANCE + HOMING_ENEMY_CHANCE) {
                type = 'homing';
                isScreenEntityForThisSpawn = false;
            } else {
                type = 'straight';
                isScreenEntityForThisSpawn = false;
            }
        } else if (score >= 1501 && score <= 2000) {
            type = Math.random() < HOMING_ENEMY_CHANCE ? 'homing' : 'straight';
            isScreenEntityForThisSpawn = false;
        } else if (score >= 1001 && score <= 1500) {
            type = 'straight';
            isScreenEntityForThisSpawn = false;
        }

        if (type) { 
            if (type !== 'charger') {
                const spawnX = canvas.width - 50; 
                const spawnY = Math.random() * (canvas.height - 200) + 50;
                let speed = ENEMY_SPEED;
                
                projectileIndicators.push({
                    x: spawnX,
                    y: spawnY,
                    lifespan: PROJECTILE_INDICATOR_DURATION,
                    initialLifespan: PROJECTILE_INDICATOR_DURATION,
                    projectileType: type,
                    projectileSpeed: speed
                });
            } else {
                if (isScreenEntityForThisSpawn) { 
                    enemyXPos = canvas.width - 50; 
                    enemySpeedToSet = BOSS_MINION_STRAIGHT_SPEED; 
                } else { 
                    enemyXPos = scrollOffset + canvas.width + Math.random() * 100 + 50; 
                    enemySpeedToSet = ENEMY_SPEED;
                } 
                enemies.push(new Enemy( enemyXPos, Math.random() * (canvas.height - 200) + 50, type, enemySpeedToSet, isScreenEntityForThisSpawn )); 
            }
            enemySpawnCooldown = ENEMY_SPAWN_COOLDOWN; 
        } 
    } 
}

function handleCollisions() { 
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    for (let i = coins.length - 1; i >= 0; i--) { 
        const coin = coins[i]; 
        if (!(coin instanceof Coin)) { coins.splice(i,1); continue; } 
        const dx = playerCenterX - coin.x; 
        const dy = playerCenterY - coin.y; 
        if (Math.sqrt(dx * dx + dy * dy) < player.width / 2 + coin.radius) { 
            if (!scoreLockCheat) { 
                score += COIN_VALUE; 
            } 
            playSound(sounds.coin); 
            if (!reduceParticles) {
                for (let k = 0; k < 6; k++) {
                    particles.push({
                        x: coin.x, y: coin.y, 
                        size: Math.random() * 4 + 2, color: '#feca57', 
                        lifespan: 0.5, initialLifespan: 0.5,
                        vx: (Math.random() - 0.5) * 250, vy: (Math.random() - 0.5) * 250,
                        isScreenSpace: false, priority: 'low', layer: 'front'
                    });
                }
            }
            coins.splice(i, 1); 
        } 
    } 
    for (let i = healthPacks.length - 1; i >= 0; i--) { 
        const pack = healthPacks[i]; 
        if (!(pack instanceof HealthPack)) { healthPacks.splice(i,1); continue; } 
        const dx = playerCenterX - pack.x; 
        const dy = playerCenterY - pack.y; 
        if (Math.sqrt(dx * dx + dy * dy) < player.width / 2 + pack.radius) { 
            player.health = Math.min(player.maxHealth, player.health + 1); 
            playSound(sounds.coin); 
            if (!reduceParticles) {
                for (let k = 0; k < 10; k++) { 
                    particles.push({
                        x: pack.x, y: pack.y, 
                        size: Math.random() * 5 + 3, color: '#e74c3c', 
                        lifespan: 0.6, initialLifespan: 0.6,
                        vx: (Math.random() - 0.5) * 300, vy: (Math.random() - 0.5) * 300,
                        isScreenSpace: false, priority: 'low', layer: 'front'
                    });
                }
            }
            healthPacks.splice(i, 1); 
        } 
    } 
}

function updateGameLogic(deltaTime) { 
    let milestones = [];
    
    if (gameState === 'playing' || gameState === 'bossBattle') {
        milestones = [1000, 2000, 3000];
    } 
    else if (gameState === 'phaseTwo' || gameState === 'finalBoss') {
        milestones = [500, 1500, 2500, 4000];
    }

    for (const m of milestones) {
        if (score >= m && lastScoreTier < m) {
            scoreBlinkTimer = 3.0; 
            lastScoreTier = m;    
        }
    }
    
    if (scoreBlinkTimer > 0) {
        scoreBlinkTimer -= deltaTime;
    }

    if (boss && boss.health <= 0 && gameState !== 'gameWon') { 
        phaseOneComplete = true;
        gameWon = true; 
        gameState = 'gameWon'; 
        playSound(sounds.victory); 
        setTargetMusicVolumeFactor(gameState); 
    } 
    if ((finalBoss && finalBoss.health <= 0) && gameState !== 'gameWon') {
        gameWon = true; 
        localStorage.setItem('gameBeaten', 'true');
        gameState = 'gameWon';
        playSound(sounds.victory);
        setTargetMusicVolumeFactor(gameState);
    }
    if (player.health <= 0 && gameState !== 'gameOver' && player.captureState === 'none') { 
        gameWon = false; 
        gameState = 'gameOver'; 
        playSound(sounds.gameOver); 
        setTargetMusicVolumeFactor(gameState); 
    } 
}

function gerenciarPlataformas() {
    platforms = platforms.filter(p => p.y < canvas.height + 100 && (p.x + p.width - scrollOffset) > 0);
    if (platforms.length === 0) {
        platforms.push(new Platform(scrollOffset, 550, 600, 'stable', 'grass'));
    }
    let last = platforms[platforms.length - 1];
    
    if (last.isDebug) {
        for(let i = platforms.length - 1; i >= 0; i--) {
            if (!platforms[i].isDebug) {
                last = platforms[i];
                break;
            }
        }
    }
    
    if (last.width) {
        pixelsSinceLastHP += last.width;
    }

    while (last.x < scrollOffset + canvas.width + 200) {
        const gap = Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP) + PLATFORM_MIN_GAP;
        const newX = last.x + last.width + gap;
        const isLongPlatform = Math.random() < LONG_PLATFORM_CHANCE;
        const newWidth = isLongPlatform ? Math.random() * (LONG_PLATFORM_MAX_WIDTH - LONG_PLATFORM_MIN_WIDTH) + LONG_PLATFORM_MIN_WIDTH : Math.random() * (PLATFORM_MAX_WIDTH - PLATFORM_MIN_WIDTH) + PLATFORM_MIN_WIDTH;
        const deltaY = (Math.random() - 0.5) * (PLATFORM_MAX_JUMP_HEIGHT + PLATFORM_MAX_DROP_HEIGHT);
        const newY = Math.max(250, Math.min(last.y + deltaY, 550));
        const newPlatform = new Platform(newX, newY, newWidth, 'stable', 'grass');
        
        pixelsSinceLastHP += gap;

        if (gameState === 'playing') {
            let canHaveItems = true;
            let hasCoinsOnPlatform = false;
            let hasBushOnPlatform = false;
            let itemPlacedOnPlatform = false;

            if (isLongPlatform && Math.random() < OBSTACLE_CHANCE) {
                canHaveItems = false;
                let generatedWallData = null;
                let generatedWallWithTopSpikesThisTime = false;
                if (score >= 501) {
                    if (Math.random() < WALL_CHANCE) {
                        const isTallWall = Math.random() < TALL_WALL_CHANCE;
                        const wallHeight = isTallWall ? TALL_WALL_HEIGHT : NORMAL_WALL_HEIGHT;
                        const wallX = Math.random() * (newWidth - 30 - 20) + 10;
                        if (wallHeight === NORMAL_WALL_HEIGHT && score > 2000 && Math.random() < WALL_WITH_TOP_SPIKES_CHANCE) {
                            newPlatform.addObstacle({ type: 'wallWithTopSpikes', x: wallX, width: 30, wallHeight: NORMAL_WALL_HEIGHT, spikeHeight: 20 });
                            generatedWallWithTopSpikesThisTime = true;
                        } else {
                            generatedWallData = { type: 'wall', x: wallX, width: 30, height: wallHeight };
                            newPlatform.addObstacle(generatedWallData);
                        }
                        if (!generatedWallWithTopSpikesThisTime && generatedWallData && Math.random() < WALL_SPIKE_CHANCE) {
                            const numLateralSpikes = Math.random() < 0.6 ? 1 : 2;
                            const singleSpikeVisualHeight = 20;
                            const totalLateralSpikeHeight = numLateralSpikes * singleSpikeVisualHeight;
                            let yOffsetForLateralSpike = 5 + Math.random() * ((generatedWallData.height * 0.15) - 5);
                            yOffsetForLateralSpike = Math.max(5, yOffsetForLateralSpike);
                            if (yOffsetForLateralSpike + totalLateralSpikeHeight > generatedWallData.height - 5) { yOffsetForLateralSpike = Math.max(5, generatedWallData.height - totalLateralSpikeHeight - 5); }
                            generatedWallData.lateralSpikes = { yOffset: yOffsetForLateralSpike, height: totalLateralSpikeHeight, protrusion: 15, numSpikes: numLateralSpikes };
                        }
                    } else {
                        const numSpikes = Math.floor(Math.random() * 5) + 1;
                        const spikeWidth = numSpikes * 20;
                        newPlatform.addObstacle({ type: 'spike', x: Math.random() * (newWidth - spikeWidth), width: spikeWidth, height: 20 });
                    }
                } else { 
                    if (Math.random() < 0.5) {
                        const wallX = Math.random() * (newWidth - 30 - 20) + 10;
                        const wallHeight = NORMAL_WALL_HEIGHT;
                        generatedWallData = { type: 'wall', x: wallX, width: 30, height: wallHeight };
                        newPlatform.addObstacle(generatedWallData);
                        if (Math.random() < WALL_SPIKE_CHANCE * 0.7) {
                            const numLateralSpikes = 1;
                            const singleSpikeVisualHeight = 20;
                            const totalSpikeSetHeight = numLateralSpikes * singleSpikeVisualHeight;
                            let yOffsetForLateralSpike = 5 + Math.random() * ((wallHeight * 0.15) - 5);
                            yOffsetForLateralSpike = Math.max(5, yOffsetForLateralSpike);
                            if (yOffsetForLateralSpike + totalSpikeSetHeight > wallHeight - 5) { yOffsetForLateralSpike = Math.max(5, wallHeight - totalSpikeSetHeight - 5); }
                            generatedWallData.lateralSpikes = { yOffset: yOffsetForLateralSpike, height: totalSpikeSetHeight, protrusion: 15, numSpikes: numLateralSpikes };
                        }
                    } else {
                        const numSpikes = Math.floor(Math.random() * 3) + 1;
                        const spikeWidth = numSpikes * 20;
                        newPlatform.addObstacle({ type: 'spike', x: Math.random() * (newWidth - spikeWidth), width: spikeWidth, height: 20 });
                    }
                }
            }
            const hasDangerousObstacles = newPlatform.obstacles.some(obs => obs.type !== 'bush');
            
            if (!isLongPlatform && !hasDangerousObstacles) {
                if (score >= 1001 && score <= 1500) { if (Math.random() < FALLING_PLATFORM_CHANCE * 0.5) newPlatform.type = 'falling'; }
                else if (score > 1500) { if (Math.random() < FALLING_PLATFORM_CHANCE) newPlatform.type = 'falling'; }
            }

            if (canHaveItems) {
                if (isLongPlatform && !hasDangerousObstacles && Math.random() < CHEST_SPAWN_CHANCE) {
                    newPlatform.hasChest = true;
                    newPlatform.chestType = (Math.random() < CHEST_LUCK_CHANCE) ? 'reward' : 'trap';
                    itemPlacedOnPlatform = true;
                }
                
                if (!itemPlacedOnPlatform && Math.random() < COIN_SPAWN_CHANCE) {
                    hasCoinsOnPlatform = true;
                    itemPlacedOnPlatform = true;
                    const numCoins = 3 + Math.floor(Math.random() * 3);
                    const coinSpacing = 30;
                    const totalCoinWidth = (numCoins - 1) * coinSpacing;
                    const startX = newPlatform.x + (newPlatform.width / 2) - (totalCoinWidth / 2);
                    for (let i = 0; i < numCoins; i++) {
                        coins.push(new Coin(startX + (i * coinSpacing), newPlatform.y - 25));
                    }
                }
                
                if (!itemPlacedOnPlatform && newPlatform.width > 150 && Math.random() < BUSH_SPAWN_CHANCE && !hasDangerousObstacles) {
                    hasBushOnPlatform = true;
                    const numBushes = 1 + Math.floor(Math.random() * 2);
                    for(let i = 0; i < numBushes; i++) {
                        const bushWidth = Math.random() * 20 + 25;
                        const bushHeight = bushWidth * (0.6 + Math.random() * 0.2);
                        const bushX = Math.random() * (newPlatform.width - bushWidth);
                        newPlatform.addObstacle({ type: 'bush', x: bushX, width: bushWidth, height: bushHeight });
                    }
                }
            }
            
            const canSpawnHealth = canHaveItems && !itemPlacedOnPlatform && !hasCoinsOnPlatform && !hasBushOnPlatform && !hasDangerousObstacles;
            
            if (player.health < player.maxHealth && canSpawnHealth) {
                if (pixelsSinceLastHP > 1500) {
                    const missingHealth = player.maxHealth - player.health;
                    const dynamicChance = BASE_HEALTH_PACK_CHANCE * (1 + missingHealth * HEALTH_PACK_CHANCE_MULTIPLIER);
                    
                    if (Math.random() < dynamicChance) {
                        healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
                        pixelsSinceLastHP = 0; 
                    }
                }
            }
        } else if (gameState === 'bossBattle') {
            if (boss && boss.health <= boss.maxHealth / 2) { newPlatform.type = 'falling'; }
            if (newPlatform.width > 150 && Math.random() < BUSH_SPAWN_CHANCE) {
                const bushWidth = Math.random() * 20 + 25;
                const bushHeight = bushWidth * (0.6 + Math.random() * 0.2);
                const bushX = Math.random() * (newWidth - bushWidth);
                newPlatform.addObstacle({ type: 'bush', x: bushX, width: bushWidth, height: bushHeight });
            }
            if (boss && player.health < player.maxHealth && boss.healthPacksSpawnedInBattle < BOSS_BATTLE_MAX_HEALTH_PACKS && Math.random() < HEALTH_PACK_SPAWN_CHANCE_BOSS) {
                boss.healthPacksSpawnedInBattle++;
                healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
            }
        }
        platforms.push(newPlatform);
        last = newPlatform;
    }
}

function gerenciarPlataformasFase2() {
    platforms = platforms.filter(p => p.y < verticalScrollOffset + canvas.height + 200);

    const requiredTopY = verticalScrollOffset - 200; 
    const towerWidth = canvas.width * 0.6;
    const towerX = (canvas.width - towerWidth) / 2;

    let lastStonePlatform = platforms.filter(p => (p.visualType === 'stone' || p.visualType === 'grass') && !p.isDebug).sort((a,b) => a.y - b.y)[0];
    if (!lastStonePlatform) {
        lastStonePlatform = new Platform(0, canvas.height, 0);
    }
    
    let currentStoneY = lastStonePlatform.y;
    while (currentStoneY > requiredTopY) {
        const gapY = Math.random() * 130 + 120;
        currentStoneY -= gapY;

        const platformWidth = (Math.floor(Math.random() * 2) + 2) * BRICK_WIDTH;
        const platformX = towerX + Math.random() * (towerWidth - platformWidth);
        const newPlatform = new Platform(platformX, currentStoneY, platformWidth, 'stable', 'stone');

        platformsSinceLastPatrolF2++;
        platformsSinceLastHPF2++;

        let hasSpecialFeature = false;
        
        if (gameState !== 'finalBoss') {
            if (score >= 1501 && newPlatform.width >= BRICK_WIDTH * 3 && Math.random() < WINDOW_TRAP_CHANCE && Math.abs(newPlatform.y - lastWindowY) > MIN_WINDOW_SPACING) {
                newPlatform.hasWindowTrap = true;
                newPlatform.windowType = (Math.random() < WINDOW_REWARD_CHANCE) ? 'reward' : 'trap';
                lastWindowY = newPlatform.y;
                hasSpecialFeature = true;
            }

            if (!hasSpecialFeature && score >= 501 && newPlatform.width >= BRICK_WIDTH * 2 && platformsSinceLastPatrolF2 >= 2) {
                if (Math.random() < PATROL_ENEMY_SPAWN_CHANCE) {
                    const enemyY = newPlatform.y - 35;
                    const enemyX = newPlatform.x + (newPlatform.width / 2) - (35 / 2); 
                    enemies.push(new Enemy(enemyX, enemyY, 'patrol', ENEMY_SPEED_BASE, false, newPlatform));
                    newPlatform.hasPatrolEnemy = true;
                    hasSpecialFeature = true;
                    platformsSinceLastPatrolF2 = 0; 
                }
            }
            
            if (!hasSpecialFeature && Math.random() < BOTTOM_SPIKE_CHANCE) {
                const numSpikesInSet = (newPlatform.width / BRICK_WIDTH > 2) ? (Math.random() < 0.5 ? 2 : 1) : 1;
                const spikeSetWidth = numSpikesInSet * 20; 
                const startX = Math.random() * (newPlatform.width - spikeSetWidth);
                newPlatform.addObstacle({ type: 'spike-down', x: startX, width: spikeSetWidth, height: BOTTOM_SPIKE_HEIGHT });
                hasSpecialFeature = true;
            }
        }
        
        const isSafeForItems = !newPlatform.hasPatrolEnemy && !newPlatform.hasWindowTrap && !newPlatform.obstacles.some(obs => obs.type === 'spike-down');
        let hasCoinsOnPlatform = false;

        if (gameState !== 'finalBoss' && isSafeForItems) {
            if (Math.random() < COIN_SPAWN_CHANCE) {
                hasCoinsOnPlatform = true;
                
                // CORREÇÃO: Clamping de moedas
                const coinSpacing = 30;
                const maxCoinsPossible = Math.max(1, Math.floor((newPlatform.width - 20) / coinSpacing));
                let numCoins = 3 + Math.floor(Math.random() * 3); 
                numCoins = Math.min(numCoins, maxCoinsPossible);
                
                const totalCoinWidth = (numCoins - 1) * coinSpacing;
                const startX = newPlatform.x + (newPlatform.width / 2) - (totalCoinWidth / 2);
                for (let i = 0; i < numCoins; i++) {
                    coins.push(new Coin(startX + (i * coinSpacing), newPlatform.y - 25));
                }
            }
            
            if (player.health < player.maxHealth && !hasCoinsOnPlatform && platformsSinceLastHPF2 >= 3) {
                const missingHealth = player.maxHealth - player.health;
                const dynamicChance = BASE_HEALTH_PACK_CHANCE * (1 + missingHealth * HEALTH_PACK_CHANCE_MULTIPLIER);
                if (Math.random() < dynamicChance) {
                    healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
                    platformsSinceLastHPF2 = 0; 
                }
            }
        } else if (gameState === 'finalBoss' && isSafeForItems) {
            if (finalBoss && player.health < player.maxHealth && finalBoss.healthPacksSpawnedInBattle < FINAL_BOSS_BATTLE_MAX_HEALTH_PACKS && Math.random() < HEALTH_PACK_SPAWN_CHANCE_BOSS) {
                finalBoss.healthPacksSpawnedInBattle++;
                healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
            }
        }
        
        platforms.push(newPlatform);
    }
    
    let lastCloudPlatform = platforms.filter(p => p.visualType === 'cloud' && !p.isDebug).sort((a,b) => a.y - b.y)[0];
    if (!lastCloudPlatform) {
         lastCloudPlatform = new Platform(0, canvas.height - 150, 0);
    }
    
    let currentCloudY = lastCloudPlatform.y;
    while (currentCloudY > requiredTopY) {
        const gapY = Math.random() * 220 + 180;
        currentCloudY -= gapY;

        if (Math.random() > CLOUD_PLATFORM_CHANCE) continue;
        
        const cloudWidth = 100 + Math.random() * 50;
        const spawnSide = Math.random() < 0.5 ? 'left' : 'right';
        let cloudX;
        
        if (spawnSide === 'left') {
            cloudX = Math.random() * (towerX - cloudWidth - 20);
        } else {
            cloudX = towerX + towerWidth + 20 + (Math.random() * (canvas.width - (towerX + towerWidth) - cloudWidth - 20));
        }
        
        const newCloud = new Platform(cloudX, currentCloudY, cloudWidth, 'pass-through-slow', 'cloud');
        platforms.push(newCloud);
    }
}

function update(deltaTime) { 
    let timeScale = 1.0;
    const isChestOpening = platforms.some(p => p.chestState === 'opening');
    if (isChestOpening || coinRewardState.active || player.rewardCooldown > 0 || player.captureState !== 'none') {
        timeScale = 0.0;
    }
    const physicsDelta = deltaTime * timeScale;
    
    if (player.rewardCooldown > 0) player.rewardCooldown -= deltaTime;

    const activeMaxParticles = reduceParticles ? MAX_PARTICLES / 2 : MAX_PARTICLES;
    if (particles.length > activeMaxParticles) {
        let toRemove = particles.length - activeMaxParticles;
        for (let i = 0; i < particles.length && toRemove > 0; i++) {
            if (particles[i].priority === 'low' || !particles[i].priority) {
                particles.splice(i, 1); i--; toRemove--;
            }
        }
        if (toRemove > 0) particles.splice(0, toRemove);
    }

    if (enemySpawnCooldown > 0) enemySpawnCooldown -= physicsDelta; 
    
    for (let i = particles.length - 1; i >= 0; i--) { 
        const p = particles[i]; 
        if (!p || isNaN(p.x) || isNaN(p.y)) { particles.splice(i,1); continue; }
        const delta = p.ignoreFreeze ? deltaTime : physicsDelta; 
        p.x += p.vx * delta; p.y += p.vy * delta; p.lifespan -= delta; 
        if (p.lifespan <= 0) particles.splice(i, 1); 
    } 
    
    platforms.forEach(p => {
        if (p.chestState === 'opening') {
            p.chestAnimTimer -= deltaTime; 
            if (p.chestAnimTimer <= 0) p.chestState = 'open';
        }
        p.update(physicsDelta);
    }); 
    
    for (let i = projectileIndicators.length - 1; i >= 0; i--) { 
        const p = projectileIndicators[i]; 
        if(!p || isNaN(p.lifespan)) { projectileIndicators.splice(i,1); continue; } 
        p.lifespan -= physicsDelta; 
        if(p.lifespan <= 0) { 
            let spawnX, spawnY, isScreenSpace;
            if (p.projectileType === 'falling_rock') { spawnX = p.x; spawnY = verticalScrollOffset - 40; isScreenSpace = false; } 
            else if (gameState === 'bossBattle' || gameState === 'finalBoss' || gameState === 'phaseTwo') { spawnX = p.x; spawnY = p.y; isScreenSpace = true; } 
            else { spawnX = p.x + scrollOffset; spawnY = p.y; isScreenSpace = false; }
            const newMinion = new Enemy(spawnX, spawnY, p.projectileType, p.projectileSpeed, isScreenSpace); 
            enemies.push(newMinion); 
            projectileIndicators.splice(i, 1); 
        } 
    } 
    
    const playerDelta = (player.captureState !== 'none') ? deltaTime : physicsDelta;
    const playerResult = player.update(playerDelta, keys, platforms, scrollOffset, infiniteInvincibilityCheat, enemies, sceneryManager, verticalScrollOffset, bossDebris, reduceParticles); 
    
    if (playerResult.particles.length > 0) { 
        playerResult.particles.forEach(p => {
            if (p.color === '#a4281b' || p.color === '#e67e22' || p.color === '#c0392b') p.priority = 'high'; else p.priority = 'low'; 
            p.layer = 'front'; p.ignoreFreeze = false; 
            if (!reduceParticles || p.priority === 'high') particles.push(p);
        });
    } 
    
    if (player.x - scrollOffset > canvas.width / 2) { scrollOffset = player.x - canvas.width / 2; }
    if (player.y > canvas.height + 100 && player.health > 0) { player.respawn(platforms, scrollOffset); }

    interactionPrompts = [];
    if (player.canInteractWithChest && !player.isJumping) {
        const platformWithChest = player.canInteractWithChest;
        const chestCenterX = platformWithChest.x + platformWithChest.width / 2;
        const chestTopY = platformWithChest.y - 40;
        interactionPrompts.push({ x: chestCenterX, y: chestTopY - CHEST_PROMPT_Y_OFFSET });
    }

    if (chestToOpen) {
        if (chestToOpen.chestState === 'closed') {
            chestToOpen.chestState = 'opening';
            chestToOpen.chestAnimTimer = 0.5;
            playSound(sounds.jump); 
            if (chestToOpen.chestType === 'reward') {
                player.rewardSource = 'chest';
                const chestX = chestToOpen.x + (chestToOpen.width / 2) - 25;
                triggerCoinReward(player, { x: chestX + 25, y: chestToOpen.y - 40 }, CHEST_REWARD_COIN_COUNT);
            } else { 
                playSound(sounds.land);
                player.rewardCooldown = 1.0; 
                const chestCenterX = chestToOpen.x + (chestToOpen.width / 2);
                for (let k = 0; k < 15; k++) {
                    particles.push({
                        x: chestCenterX + (Math.random() - 0.5) * 20, y: chestToOpen.y - 50, size: Math.random() * 4 + 2, color: '#d3d3d3',
                        lifespan: 0.5 + Math.random() * 0.3, initialLifespan: 0.8, vx: (Math.random() - 0.5) * 80, vy: (Math.random() * -120) - 20, 
                        isScreenSpace: false, priority: 'low', layer: 'back', ignoreFreeze: true
                    });
                }
            }
        }
        chestToOpen = null;
    }
    
    updateCoinAnimations(deltaTime);
    handleCollisions(); 
    sceneryManager.update(scrollOffset, canvas.width, gameState, verticalScrollOffset, platforms); 
    gerenciarPlataformas(); 
    updateEnemies(physicsDelta); 
    if(gameState === 'bossBattle' && boss) { boss.update(physicsDelta, scrollOffset, player); const playerScreenRect = {x: player.x - scrollOffset, y: player.y, width: player.width, height: player.height}; if (isCollidingWithDiamond(playerScreenRect, boss)) { player.takeDamage(); } for (let i = enemies.length - 1; i >= 0; i--) { const enemy = enemies[i]; if (!(enemy instanceof Enemy)) continue; if (enemy.isRebounded) { const enemyScreenRect = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height}; if (isCollidingWithDiamond(enemyScreenRect, boss)) { boss.health -= BOSS_DAMAGE_FROM_REBOUND; playSound(sounds.damage); for (let j = 0; j < 20; j++) { particles.push({ x: boss.x + (boss.width / 2), y: boss.y + boss.height / 2, size: Math.random() * 4 + 2, color: '#f1c40f', lifespan: 1, initialLifespan: 1, vx: (Math.random() - 0.5) * 500, vy: (Math.random() - 0.5) * 500, isScreenSpace: true, priority: 'low' }); } enemies.splice(i, 1); } } } } 
    updateGameLogic(deltaTime); 
    
    if (gameState === 'playing' && score >= BOSS_TRIGGER_SCORE && !boss) { gameState = 'bossBattle'; initBossBattle(); }
    if (currentTransitionState === 'day' && score >= DAY_TO_AFTERNOON_TRIGGER_SCORE) { currentTransitionState = 'dayToAfternoon'; dayTransitionStartOffset = scrollOffset; } 
    else if (currentTransitionState === 'afternoon' && score >= AFTERNOON_TO_NIGHT_TRIGGER_SCORE) { currentTransitionState = 'afternoonToNight'; nightTransitionStartOffset = scrollOffset; }
}

function updateVerticalPhase(deltaTime) {
    if (screenShakeTimer > 0) screenShakeTimer -= deltaTime;
    let timeScale = 1.0;
    const isChestOpening = platforms.some(p => p.chestState === 'opening');
    if (isChestOpening || coinRewardState.active || player.rewardCooldown > 0 || player.captureState !== 'none') { timeScale = 0.0; }
    const physicsDelta = deltaTime * timeScale;
    
    if (player.rewardCooldown > 0) player.rewardCooldown -= deltaTime;

    const activeMaxParticles = reduceParticles ? MAX_PARTICLES / 2 : MAX_PARTICLES;
    if (particles.length > activeMaxParticles) {
        let toRemove = particles.length - activeMaxParticles;
        for (let i = 0; i < particles.length && toRemove > 0; i++) { if (particles[i].priority === 'low' || !particles[i].priority) { particles.splice(i, 1); i--; toRemove--; } }
        if (toRemove > 0) particles.splice(0, toRemove);
    }
    
    interactionPrompts = []; 
    platforms.forEach(p => {
        if (p.hasWindowTrap && p.windowState === 'active') {
            const windowWidth = 60; const windowHeight = 90;
            const windowX = p.x + (p.width / 2) - (windowWidth / 2);
            const windowY = p.y - windowHeight;
            const dx = (player.x + player.width / 2) - (windowX + windowWidth / 2);
            const dy = (player.y + player.height / 2) - (windowY + windowHeight / 2);
            if (Math.sqrt(dx * dx + dy * dy) < WINDOW_PROMPT_DISTANCE && !player.isJumping) { interactionPrompts.push({ x: windowX + windowWidth / 2, y: windowY - WINDOW_PROMPT_Y_OFFSET }); }
        }
    });
    
    if (player.y > verticalScrollOffset + canvas.height && player.health > 0) { player.triggerFallRespawn(platforms, verticalScrollOffset); return; }

    if (player.captureState === 'none') {
        const playerDelta = (player.captureState !== 'none') ? deltaTime : physicsDelta;
        const playerResult = player.update(playerDelta, keys, platforms, 0, infiniteInvincibilityCheat, enemies, sceneryManager, verticalScrollOffset, bossDebris, reduceParticles);
        if (playerResult.particles.length > 0) { 
            playerResult.particles.forEach(p => { 
                if (p.color === '#a4281b' || p.color === '#e67e22' || p.color === '#c0392b') { p.priority = 'high'; } else { p.priority = 'low'; } 
                p.layer = 'front'; p.ignoreFreeze = false; 
                if (!reduceParticles || p.priority === 'high') particles.push(p); 
            });
        }
        if (player.canPickUpDebris && !player.isJumping) { const debris = player.canPickUpDebris; interactionPrompts.push({ x: debris.x + debris.width / 2, y: debris.y - DEBRIS_PICKUP_PROMPT_Y_OFFSET }); }
        let cameraFocusPointY = canvas.height * (gameState === 'finalBoss' ? 0.3 : 0.5);
        const targetScrollY = player.y - cameraFocusPointY;
        if (targetScrollY < verticalScrollOffset) { verticalScrollOffset = targetScrollY; }
    } else {
        const playerDelta = (player.captureState !== 'none') ? deltaTime : physicsDelta;
        player.update(playerDelta, keys, platforms, 0, infiniteInvincibilityCheat, enemies, sceneryManager, verticalScrollOffset, bossDebris, reduceParticles);
        if (player.captureState === 'pulling' && player.captureAnimProgress >= 1) { player.respawnInTower(platforms); player.takeDamage(false); }
    }
    
    if (gameState === 'phaseTwo' && score >= 2501 && score < FINAL_BOSS_TRIGGER_SCORE) {
        if (fallingRockSpawnTimer > 0) fallingRockSpawnTimer -= physicsDelta;
        if (fallingRockSpawnTimer <= 0) {
            const spawnX = Math.random() * canvas.width;
            projectileIndicators.push({ x: spawnX, y: 40, lifespan: PROJECTILE_INDICATOR_DURATION, initialLifespan: PROJECTILE_INDICATOR_DURATION, projectileType: 'falling_rock', projectileSpeed: 0 });
            fallingRockSpawnTimer = FALLING_ROCK_SPAWN_INTERVAL + (Math.random() - 0.5); 
        }
    }
    
    for (let i = projectileIndicators.length - 1; i >= 0; i--) { 
        const p = projectileIndicators[i]; 
        if(!p || isNaN(p.lifespan)) { projectileIndicators.splice(i,1); continue; } 
        p.lifespan -= physicsDelta; 
        if(p.lifespan <= 0) { 
            let spawnX, spawnY, isScreenSpace;
            if (p.projectileType === 'falling_rock') { spawnX = p.x; spawnY = verticalScrollOffset; isScreenSpace = false; } 
            else { spawnX = p.x; spawnY = p.y; isScreenSpace = true; }
            const newMinion = new Enemy(spawnX, spawnY, p.projectileType, p.projectileSpeed, isScreenSpace); 
            enemies.push(newMinion); 
            const particleDataArray = newMinion.update(0, player, scrollOffset, boss); 
            if (Array.isArray(particleDataArray) && particleDataArray.length > 0) { particles.push(...particleDataArray); } 
            projectileIndicators.splice(i, 1); 
        } 
    } 
    
    updateCoinAnimations(deltaTime);
    platforms.forEach(p => { if (p.chestState === 'opening') { p.chestAnimTimer -= deltaTime; if (p.chestAnimTimer <= 0) p.chestState = 'open'; } p.update(physicsDelta); });
    gerenciarPlataformasFase2();
    updateEnemies(physicsDelta);
    handleCollisions();
    
    if (finalBoss) {
        const bossEvents = finalBoss.update(physicsDelta, player, verticalScrollOffset);
        if (bossEvents.particles && bossEvents.particles.length > 0) { particles.push(...bossEvents.particles); }
        if (bossEvents.shake) {
            screenShakeTimer = FINAL_BOSS_SHAKE_DURATION; 
            const towerWidth = canvas.width * 0.6; const towerX = (canvas.width - towerWidth) / 2; const numDebris = 5 + Math.floor(Math.random() * 3); const laneWidth = towerWidth / numDebris;
            for (let i = 0; i < numDebris; i++) {
                const laneStart = towerX + i * laneWidth; const spawnX = laneStart + (Math.random() * (laneWidth - 30)); const spawnY = verticalScrollOffset - (50 + Math.random() * 50);
                const spawnDelay = Math.random() * 0.5; const canPhase = Math.random() < DEBRIS_PHASE_CHANCE;
                if (!bossDebris) bossDebris = []; // Safety check
                bossDebris.push(new BossDebris(spawnX, spawnY, spawnDelay, canPhase));
            }
        }
        const playerScreenRect = { x: player.x, y: player.y - verticalScrollOffset, width: player.width, height: player.height };
        let tookContactDamage = false;
        if (!player.isInvincible) {
            const bodyHitboxes = finalBoss.getBodyHitboxes(verticalScrollOffset);
            for (const hitbox of bodyHitboxes) {
                let collision = false;
                if (hitbox.type === 'rect') { collision = isColliding(playerScreenRect, hitbox); } else if (hitbox.type === 'circle') { collision = isCollidingCircleRect(hitbox, playerScreenRect); }
                if (collision) { player.takeDamage(true); tookContactDamage = true; break; }
            }
            if (!tookContactDamage) {
                const armHitboxes = finalBoss.getArmHitboxes(verticalScrollOffset);
                for (const arm of armHitboxes) { if (isCollidingRectPolygon(playerScreenRect, arm.upperArm) || isCollidingRectPolygon(playerScreenRect, arm.forearm)) { player.takeDamage(true); tookContactDamage = true; break; } }
            }
            if (finalBoss.attackState === 'laser_active') { const laserHitbox = finalBoss.getLaserHitbox(verticalScrollOffset); if (laserHitbox && isCollidingLineRect(laserHitbox, playerScreenRect)) { player.takeDamage(true); } }
        }
        
        // CORREÇÃO: Loop de atualização de detritos (Estava faltando na atualização)
        if (bossDebris && bossDebris.length > 0) {
            for(let i = bossDebris.length - 1; i >= 0; i--) {
                const d = bossDebris[i]; 
                d.update(physicsDelta, platforms);
                if (d.state === 'thrown') {
                    const weakPoints = finalBoss.getBodyHitboxes(verticalScrollOffset).filter(h => h.type === 'circle');
                    for (const point of weakPoints) {
                        const weakPointWorldRect = { x: point.x - point.radius, y: point.y - point.radius + verticalScrollOffset, width: point.radius * 2, height: point.radius * 2 };
                        const debrisWorldRect = { x: d.x, y: d.y, width: d.width, height: d.height };
                        if (isColliding(debrisWorldRect, weakPointWorldRect)) {
                            finalBoss.takeDamage(1); bossDebris.splice(i, 1);
                            for (let k = 0; k < 30; k++) { particles.push({ x: point.x, y: point.y, size: Math.random() * 5 + 2, color: '#f1c40f', lifespan: 0.8 + Math.random() * 0.5, initialLifespan: 1.3, vx: (Math.random() - 0.5) * 600, vy: (Math.random() - 0.5) * 600, isScreenSpace: true }); }
                            break; 
                        }
                    }
                }
                if (d.y > verticalScrollOffset + canvas.height + 50) { bossDebris.splice(i, 1); }
            }
        }
    }

    sceneryManager.update(0, canvas.width, gameState, verticalScrollOffset, platforms);
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; if (!p || isNaN(p.x) || isNaN(p.y) || isNaN(p.vx) || isNaN(p.vy) || isNaN(p.lifespan)) { particles.splice(i,1); continue; } p.x += p.vx * deltaTime; p.y += p.vy * deltaTime; p.lifespan -= deltaTime; if (p.lifespan <= 0) particles.splice(i, 1); }
    updateGameLogic(deltaTime);

    if (gameState === 'phaseTwo' && score >= FINAL_BOSS_TRIGGER_SCORE && !finalBoss) { initFinalBoss(); }
}

function handleBodyClick(event) { 
    if (event.target.closest('#debugPanel') || event.target.closest('#debugDragHandle')) return;
    if (event.target === document.body || event.target === mainWrapper) { if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { togglePauseGame(); } } 
}

function drawDebugInfo(ctx) {
    if (!cheatsEnabled) return; 

    ctx.save();
    ctx.font = '10px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#00ff00';
    
    const boxWidth = 200;
    const boxHeight = 90;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - boxWidth - 10, canvas.height - boxHeight - 10, boxWidth, boxHeight);

    ctx.fillStyle = '#00ff00';
    let lineY = canvas.height - boxHeight + 5;
    const lineHeight = 12;
    const rightX = canvas.width - 15;

    ctx.fillText(`FPS: ${currentFps}`, rightX, lineY); lineY += lineHeight;
    ctx.fillText(`ENTITIES: E:${enemies.length} P:${particles.length}`, rightX, lineY); lineY += lineHeight;
    ctx.fillText(`PLAYER: X:${Math.floor(player.x)} Y:${Math.floor(player.y)}`, rightX, lineY); lineY += lineHeight;
    ctx.fillText(`VEL: VX:${Math.floor(player.velocityX)} VY:${Math.floor(player.velocityY)}`, rightX, lineY); lineY += lineHeight;
    
    let stateText = "AIR";
    if (player.onPassableSurface) stateText = "GROUND";
    if (player.isJumping) stateText = "JUMP";
    ctx.fillText(`STATE: ${stateText} | ${gameState}`, rightX, lineY); lineY += lineHeight;
    
    const camY = isVerticalPhase() ? verticalScrollOffset : 0;
    const camX = isVerticalPhase() ? 0 : scrollOffset;
    ctx.fillText(`CAM: X:${Math.floor(camX)} Y:${Math.floor(camY)}`, rightX, lineY);

    ctx.restore();
}

function draw(deltaTime) {
    const isGameActive = gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'start') {
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, SKY_PALETTES.day[0]); bgGradient.addColorStop(0.6, SKY_PALETTES.day[1]); bgGradient.addColorStop(1, SKY_PALETTES.day[2]);
        ctx.fillStyle = bgGradient; ctx.fillRect(0, 0, canvas.width, canvas.height); drawStartScreen();
    } else {
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offscreenCtx.save();
        if (screenShakeTimer > 0 && isGameActive) { const shakeX = (Math.random() - 0.5) * SCREEN_SHAKE_MAGNITUDE; const shakeY = 0; offscreenCtx.translate(shakeX, shakeY); }

        const activeState = (gameState === 'paused' || gameState === 'options') ? previousStateForPause || 'playing' : gameState;
        
        let isCurrentlyVertical = false;
        if (activeState === 'phaseTwo' || activeState === 'finalBoss') {
            isCurrentlyVertical = true;
        } else if (activeState === 'gameOver') {
            isCurrentlyVertical = phaseOneComplete;
        } else if (activeState === 'gameWon') {
            isCurrentlyVertical = (finalBoss !== null);
        }
        
        // Definição da flag `visualState` (para o sceneryManager)
        let visualState = activeState;
        if (activeState === 'gameOver') {
            if (phaseOneComplete) visualState = (finalBoss !== null) ? 'finalBoss' : 'phaseTwo';
            else visualState = (boss !== null) ? 'bossBattle' : 'playing';
        } else if (activeState === 'gameWon') {
            visualState = (finalBoss !== null) ? 'finalBoss' : 'bossBattle';
        }

        if (isCurrentlyVertical) {
            const bgGradient = offscreenCtx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, SKY_PALETTES.night[0]); bgGradient.addColorStop(0.6, SKY_PALETTES.night[1]); bgGradient.addColorStop(1, SKY_PALETTES.night[2]);
            offscreenCtx.fillStyle = bgGradient; offscreenCtx.fillRect(0,0, canvas.width, canvas.height);
            
            // CORREÇÃO: Usando visualState para manter o fundo correto no Game Over
            sceneryManager.draw(offscreenCtx, 0, visualState, verticalScrollOffset, deltaTime, platforms, player);
            drawParticles(offscreenCtx, true, 'back');
            platforms.forEach(p => p.drawBase(offscreenCtx, 0, verticalScrollOffset, true, player));
            drawParticles(offscreenCtx, true, 'front');
            if (finalBoss) { finalBoss.draw(offscreenCtx, verticalScrollOffset); }
            
            if (bossDebris && bossDebris.length > 0) {
                bossDebris.forEach(d => d.draw(offscreenCtx, verticalScrollOffset));
            }
            
            enemies.forEach(e => { if (e instanceof Enemy) { e.draw(offscreenCtx, 0, verticalScrollOffset, true); } });
            player.draw(offscreenCtx, 0, verticalScrollOffset, true);
            coins.forEach(c => c.draw(offscreenCtx, 0, verticalScrollOffset, true));
            healthPacks.forEach(hp => hp.draw(offscreenCtx, 0, verticalScrollOffset, true));
            drawCoinAnimations(true); drawFogOverlay(true);
            
            if (visualState === 'finalBoss') { drawTowerLightingOverlay(offscreenCtx); }
            
            drawInteractionPrompts(offscreenCtx, true); drawProjectileIndicators();
        } else {
            let fromPalette, toPalette, progress = 0;
            switch (currentTransitionState) {
                case 'day': fromPalette = SKY_PALETTES.day; toPalette = SKY_PALETTES.day; break;
                case 'dayToAfternoon': fromPalette = SKY_PALETTES.day; toPalette = SKY_PALETTES.afternoon; progress = (scrollOffset - dayTransitionStartOffset) / TRANSITION_DURATION_SCROLL; if (progress >= 1) { currentTransitionState = 'afternoon'; } break;
                case 'afternoon': fromPalette = SKY_PALETTES.afternoon; toPalette = SKY_PALETTES.afternoon; break;
                case 'afternoonToNight': fromPalette = SKY_PALETTES.afternoon; toPalette = SKY_PALETTES.night; progress = (scrollOffset - nightTransitionStartOffset) / TRANSITION_DURATION_SCROLL; if (progress >= 1) { currentTransitionState = 'night'; } break;
                case 'night': fromPalette = SKY_PALETTES.night; toPalette = SKY_PALETTES.night; break;
            }
            progress = Math.max(0, Math.min(1, progress));
            const currentColors = fromPalette.map((from, i) => rgbToString(lerpColor(from, toPalette[i], progress)));
            const bgGradient = offscreenCtx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, currentColors[0]); bgGradient.addColorStop(0.6, currentColors[1]); bgGradient.addColorStop(1, currentColors[2]);
            offscreenCtx.fillStyle = bgGradient; offscreenCtx.fillRect(0,0, canvas.width, canvas.height);
    
            sceneryManager.draw(offscreenCtx, scrollOffset, visualState);
            drawParticles(offscreenCtx, false, 'back');
            platforms.forEach(p => p.draw(offscreenCtx, scrollOffset, 0, false, player));
            coins.forEach(c => c.draw(offscreenCtx, scrollOffset, 0, false));
            healthPacks.forEach(hp => hp.draw(offscreenCtx, scrollOffset, 0, false));
            drawParticles(offscreenCtx, false, 'front');
            if (boss) { boss.draw(offscreenCtx); }
            
            enemies.forEach(e => { if (e instanceof Enemy) { e.draw(offscreenCtx, scrollOffset); } });
            player.draw(offscreenCtx, scrollOffset, 0, false);
            drawProjectileIndicators(); drawCoinAnimations(false); 
            
            if (visualState === 'bossBattle') {
                drawPhaseOneDarkness(offscreenCtx);
            }
            
            drawInteractionPrompts(offscreenCtx, false);
        }
        offscreenCtx.restore();
    
        const isOverlayState = gameState === 'paused' || gameState === 'options' || gameState === 'gameOver' || gameState === 'gameWon' || patchNotesContainer.classList.contains('visible');
        ctx.filter = isOverlayState ? 'blur(4px)' : 'none';
        ctx.drawImage(offscreenCanvas, 0, 0);
        ctx.filter = 'none';
    
        if (isGameActive) {
            drawGameStats(); 
            if (gameState === 'bossBattle') drawBossUI();
            if (gameState === 'finalBoss') drawFinalBossUI();
            if (!isOverlayState) { drawCanvasPauseButton(ctx); }
            
            drawDebugInfo(ctx);
        }

        switch (gameState) {
            case 'paused': drawPauseMenu(deltaTime); break; 
            case 'options': drawOptionsMenu(deltaTime); break; 
            case 'gameOver': drawEndScreen(false); break;
            case 'gameWon': drawEndScreen(true); break;
        }
    }
    
    drawScreenMessages();
}

function animate(timestamp) {
    requestAnimationFrame(animate);
    const deltaTime = Math.min((timestamp - lastTime) / 1000 || 0, 0.1);
    
    // Cálculo de FPS
    if (timestamp > fpsTimer + 1000) {
        currentFps = frameCount;
        frameCount = 0;
        fpsTimer = timestamp;
    }
    frameCount++;

    lastTime = timestamp;

    const isGameActive = gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss';
    
    if (sounds.music.audio && sounds.music.audio.src) {
        const baseMusicVol = sounds.music.baseVolume * musicVolume;
        if (currentMusicVolumeFactor !== targetMusicVolumeFactor) {
            const transitionSpeed = MUSIC_VOLUME_TRANSITION_SPEED * deltaTime;
            if (currentMusicVolumeFactor < targetMusicVolumeFactor) { currentMusicVolumeFactor = Math.min(targetMusicVolumeFactor, currentMusicVolumeFactor + transitionSpeed); } 
            else if (currentMusicVolumeFactor > targetMusicVolumeFactor) { currentMusicVolumeFactor = Math.max(targetMusicVolumeFactor, currentMusicVolumeFactor - transitionSpeed); }
            sounds.music.audio.volume = baseMusicVol * currentMusicVolumeFactor;
        } else { sounds.music.audio.volume = baseMusicVol * targetMusicVolumeFactor; }
        sounds.music.audio.volume = Math.max(0, Math.min(1, sounds.music.audio.volume));
    }

    if (isGameActive) {
        if (screenMessage && screenMessage.lifespan > 0) { screenMessage.lifespan -= deltaTime; if (screenMessage.lifespan <= 0) screenMessage = null; }
        const targetScale = isHoveringPause ? 1.1 : 1.0; currentPauseButtonScale += (targetScale - currentPauseButtonScale) * PAUSE_BTN_ANIM_SPEED * deltaTime;
        if (isVerticalPhase()) { updateVerticalPhase(deltaTime); } else { update(deltaTime); }
    }
    
    draw(deltaTime);
}

// Event Listeners no final do arquivo
const versionLabel = document.getElementById('versionLabel'); const patchNotesContainer = document.getElementById('patchNotesContainer'); const modalOverlay = document.getElementById('modalOverlay'); const closePatchNotesBtn = document.getElementById('closePatchNotes'); const pointingArrow = document.getElementById('pointingArrow'); 
function openPatchNotes() { modalOverlay.classList.add('visible'); patchNotesContainer.classList.add('visible'); pointingArrow.classList.remove('visible'); localStorage.setItem('lastSeenGameVersion', versionLabel.textContent); }
function closePatchNotes() { modalOverlay.classList.remove('visible'); patchNotesContainer.classList.remove('visible'); }
function showPointingArrow() { const lastSeenVersion = localStorage.getItem('lastSeenGameVersion'); const currentGameVersion = versionLabel.textContent; if (lastSeenVersion === currentGameVersion) { pointingArrow.style.display = 'none'; return; } pointingArrow.classList.add('visible'); }

versionLabel.addEventListener('click', openPatchNotes); closePatchNotesBtn.addEventListener('click', closePatchNotes); modalOverlay.addEventListener('click', closePatchNotes); 
document.addEventListener('keydown', handleKeyDown); document.addEventListener('keyup', handleKeyUp); canvas.addEventListener('mousedown', handleMouseDown); document.addEventListener('mouseup', handleMouseUp); document.addEventListener('mousemove', handleMouseMove); canvas.addEventListener('click', handleClick); document.body.addEventListener('click', handleBodyClick);

init(); 
animate(0);