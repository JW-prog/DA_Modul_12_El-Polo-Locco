let canvas;
let world;
let keyboard = new Keyboard();
let gamePaused = false;
let gameIntervalIds = [];
let isRestarting = false;

/** Creates a recurring game timer that can be cleared on restart. @param {Function} callback - Timer callback. @param {number} delay - Delay in milliseconds. @returns {number} Timer ID. */
function registerGameInterval(callback, delay) {
    const id = setInterval(callback, delay);
    gameIntervalIds.push(id);
    return id;
}

/** Stops every recurring timer belonging to the current game. @returns {void} */
function clearGameIntervals() {
    gameIntervalIds.forEach((id) => clearInterval(id));
    gameIntervalIds = [];
}

/** Returns whether gameplay updates are currently paused. @returns {boolean} */
function isGamePaused() {
    return gamePaused;
}

/** Initializes the start screen and controls. @returns {void} */
function initGame() {
    armStartButton();
    initTouchControls();
    updateSoundButton();
}


/** Arms the start button for one game start. @returns {void} */
function armStartButton() {
    const button = document.getElementById('startButton');
    button.removeEventListener('click', startGame);
    button.addEventListener('click', startGame, { once: true });
}


/** Registers pointer listeners for every touch button. @returns {void} */
function initTouchControls() {
    document.querySelectorAll('.touch-button').forEach(registerTouchButton);
}


/** Registers all listeners of one touch button. @param {HTMLElement} button - Touch button. @returns {void} */
function registerTouchButton(button) {
    button.addEventListener('pointerdown', (event) => pressTouchButton(event, button));
    button.addEventListener('pointerup', (event) => releaseTouchButton(event, button));
    button.addEventListener('pointercancel', (event) => releaseTouchButton(event, button));
    button.addEventListener('contextmenu', (event) => event.preventDefault());
}


/** Activates a touch control. @param {PointerEvent} event - Pointer event. @param {HTMLElement} button - Touch button. @returns {void} */
function pressTouchButton(event, button) {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    button.classList.add('is-pressed');
    keyboard[button.dataset.key] = true;
}


/** Releases a touch control. @param {PointerEvent} event - Pointer event. @param {HTMLElement} button - Touch button. @returns {void} */
function releaseTouchButton(event, button) {
    event.preventDefault();
    button.classList.remove('is-pressed');
    if (button.dataset.key !== 'THROW') keyboard[button.dataset.key] = false;
}


/** Creates and starts the game after its images load. @returns {Promise<void>} */
async function startGame() {
    showLoadingState();
    createGameWorld();
    await waitForNextFrame();
    showRunningState();
    audioManager.start();
}


/** Shows feedback while the game loads. @returns {void} */
function showLoadingState() {
    const button = document.getElementById('startButton');
    button.disabled = true;
    button.querySelector('.start-button-label').textContent = 'Spiel wird geladen ...';
}


/** Initializes canvas, level, and world. @returns {void} */
function createGameWorld() {
    canvas = document.getElementById('gameCanvas');
    configureCanvas(canvas);
    initLevel1();
    world = new World(canvas, keyboard);
}


/** Switches the page to its running-game state. @returns {void} */
function showRunningState() {
    document.querySelector('.start-screen-image').classList.add('is-hidden');
    document.getElementById('startButton').classList.add('is-hidden');
    document.getElementById('startOptions').classList.add('is-hidden');
    document.getElementById('fullscreen').classList.add('game-running');
    document.getElementById('pauseButton').classList.remove('is-hidden');
    updateSoundButton();
}


/** Pauses or resumes the running game. @returns {void} */
function togglePause() {
    if (!world || world.gameOver) return;
    gamePaused = !gamePaused;
    clearGameInput();
    document.getElementById('pauseOverlay').classList.toggle('is-hidden', !gamePaused);
    updatePauseButton();
    if (gamePaused) audioManager.pauseGameAudio();
    else audioManager.resumeGameAudio();
}


/** Releases all controls so no input remains active after pausing. @returns {void} */
function clearGameInput() {
    ['LEFT', 'RIGHT', 'UP', 'DOWN', 'SPACE', 'D', 'THROW'].forEach((key) => keyboard[key] = false);
    document.querySelectorAll('.touch-button').forEach((button) => button.classList.remove('is-pressed'));
}


/** Updates icon and accessible text of the pause control. @returns {void} */
function updatePauseButton() {
    const button = document.getElementById('pauseButton');
    const label = gamePaused ? 'Spiel fortsetzen' : 'Spiel pausieren';
    button.querySelector('span').textContent = gamePaused ? '\u25B6' : '\u275A\u275A';
    button.setAttribute('aria-label', label);
    button.title = label;
}


/** Waits for all initially used game images. @returns {Promise<void[]>} */
function waitForInitialGameImages() {
    const images = collectInitialGameImages();
    return Promise.all([...images].map(waitForImage));
}


/** Collects unique images from initial drawable objects. @returns {Set<HTMLImageElement>} */
function collectInitialGameImages() {
    const images = new Set();
    getInitialDrawableObjects().forEach((object) => collectObjectImages(object, images));
    return images;
}


/** Returns all objects visible when the game starts. @returns {DrawableObject[]} */
function getInitialDrawableObjects() {
    return [world.character, world.statusBar, world.statusBarEnemy,
        world.statusBarBottle, world.statusBarCoin, ...world.level.backgroundObjects,
        ...world.level.clouds, ...world.level.bottles, ...world.level.coins,
        ...world.level.enemies];
}


/** Adds one object's images to a set. @param {DrawableObject} object - Source object. @param {Set<HTMLImageElement>} images - Target set. @returns {void} */
function collectObjectImages(object, images) {
    if (object.img) images.add(object.img);
    Object.values(object.imageCache || {}).forEach((image) => images.add(image));
}


/** Waits until an image is ready or failed. @param {HTMLImageElement} image - Image. @returns {Promise<void>} */
function waitForImage(image) {
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => registerImageCompletion(image, resolve));
}


/** Registers image completion listeners. @param {HTMLImageElement} image - Image. @param {Function} resolve - Promise resolver. @returns {void} */
function registerImageCompletion(image, resolve) {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
}


/** Waits for two animation frames. @returns {Promise<void>} */
function waitForNextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}


/** Opens an information overlay. @param {string} overlayId - Overlay element ID. @returns {void} */
function openOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    overlay.classList.remove('is-hidden');
    overlay.querySelector('.overlay-close').focus();
}


/** Closes an information overlay. @param {string} overlayId - Overlay element ID. @returns {void} */
function closeOverlay(overlayId) {
    document.getElementById(overlayId).classList.add('is-hidden');
}


/** Closes every overlay when Escape is pressed. @param {KeyboardEvent} event - Key event. @returns {void} */
function closeOverlaysOnEscape(event) {
    if (event.code !== 'Escape') return;
    document.querySelectorAll('.game-overlay').forEach((overlay) => overlay.classList.add('is-hidden'));
}


/** Toggles all game audio. @returns {void} */
function toggleSound() {
    audioManager.toggleMute();
    updateSoundButton();
}


/** Updates the sound button's accessible state. @returns {void} */
function updateSoundButton() {
    const button = document.getElementById('soundButton');
    const label = audioManager.isMuted ? 'Ton einschalten' : 'Ton ausschalten';
    button.querySelector('span').textContent = audioManager.isMuted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
    button.setAttribute('aria-label', label);
    button.title = label;
}


/** Configures logical and physical canvas dimensions. @param {HTMLCanvasElement} element - Game canvas. @returns {void} */
function configureCanvas(element) {
    element.logicalWidth = 720;
    element.logicalHeight = 480;
    element.pixelRatio = getCanvasPixelRatio();
    element.width = element.logicalWidth * element.pixelRatio;
    element.height = element.logicalHeight * element.pixelRatio;
}


/** Uses a lighter canvas resolution on touch devices to keep movement smooth. @returns {number} Pixel ratio. */
function getCanvasPixelRatio() {
    const usesTouchControls = window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(max-width: 1024px)').matches;
    return usesTouchControls ? 1 : Math.min(window.devicePixelRatio || 1, 2);
}


/** Opens the game container in browser fullscreen mode. @returns {void} */
function enterfullScreen() {
    const element = document.getElementById('fullscreen');
    const enter = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
    if (enter) enter.call(element);
}


/** Exits browser fullscreen mode. @returns {void} */
function exitFullScreen() {
    const exit = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
    if (exit) exit.call(document);
}


/** Rebuilds and starts the game without reloading the page. @returns {Promise<void>} */
async function restartGame() {
    if (isRestarting) return;
    isRestarting = true;
    if (world) world.dispose();
    clearGameIntervals();
    clearGameInput();
    gamePaused = false;
    audioManager.reset();
    hideRestartOverlays();
    createGameWorld();
    await waitForInitialGameImages();
    await waitForNextFrame();
    showRunningState();
    audioManager.start();
    isRestarting = false;
}


/** Returns to the start screen without reloading the document. @returns {void} */
function goHome() {
    if (world) world.dispose();
    clearGameIntervals();
    clearGameInput();
    gamePaused = false;
    isRestarting = false;
    audioManager.reset();
    world = null;
    resetCanvas();
    showHomeState();
    armStartButton();
}


/** Clears the last rendered game frame. @returns {void} */
function resetCanvas() {
    if (!canvas) return;
    const context = canvas.getContext('2d');
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}


/** Restores all start-screen controls. @returns {void} */
function showHomeState() {
    document.querySelector('.start-screen-image').classList.remove('is-hidden');
    const startButton = document.getElementById('startButton');
    startButton.classList.remove('is-hidden');
    startButton.disabled = false;
    startButton.querySelector('.start-button-label').textContent = 'Spiel starten';
    document.getElementById('startOptions').classList.remove('is-hidden');
    document.getElementById('fullscreen').classList.remove('game-running');
    document.getElementById('pauseButton').classList.add('is-hidden');
    document.getElementById('pauseOverlay').classList.add('is-hidden');
    document.getElementById('resultActions').classList.add('is-hidden');
    updatePauseButton();
    updateSoundButton();
}


/** Restores game controls before a new round. @returns {void} */
function hideRestartOverlays() {
    document.getElementById('pauseOverlay').classList.add('is-hidden');
    document.getElementById('resultActions').classList.add('is-hidden');
    updatePauseButton();
}


/** Handles pressed game keys. @param {KeyboardEvent} event - Key event. @returns {void} */
function handleKeyDown(event) {
    if (gamePaused) return;
    preventGameKeyScrolling(event);
    const key = mapGameKey(event.code);
    if (!key) return;
    if (key === 'D' && !keyboard.D && !event.repeat) keyboard.THROW = true;
    keyboard[key] = true;
}


/** Handles released game keys. @param {KeyboardEvent} event - Key event. @returns {void} */
function handleKeyUp(event) {
    const key = mapGameKey(event.code);
    if (key) keyboard[key] = false;
}


/** Maps browser key codes to keyboard properties. @param {string} code - Browser key code. @returns {string|undefined} Game key. */
function mapGameKey(code) {
    return { ArrowLeft: 'LEFT', ArrowRight: 'RIGHT', ArrowUp: 'UP',
        ArrowDown: 'DOWN', Space: 'SPACE', KeyD: 'D' }[code];
}


/** Prevents page scrolling while game keys are active. @param {KeyboardEvent} event - Key event. @returns {void} */
function preventGameKeyScrolling(event) {
    const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'];
    if (world && !world.gameOver && gameKeys.includes(event.code)) event.preventDefault();
}


window.addEventListener('keydown', closeOverlaysOnEscape);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
