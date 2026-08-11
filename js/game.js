let canvas;
let world;
let keyboard = new Keyboard();

/** Initializes the start screen and controls. @returns {void} */
function initGame() {
    document.getElementById('startButton').addEventListener('click', startGame, { once: true });
    initTouchControls();
    updateSoundButton();
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
    await waitForInitialGameImages();
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
    document.getElementById('startButton').classList.add('is-hidden');
    document.getElementById('startOptions').classList.add('is-hidden');
    document.getElementById('fullscreen').classList.add('game-running');
    updateSoundButton();
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
    element.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    element.width = element.logicalWidth * element.pixelRatio;
    element.height = element.logicalHeight * element.pixelRatio;
}


/** Exits browser fullscreen mode. @returns {void} */
function exitFullScreen() {
    const exit = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
    if (exit) exit.call(document);
}


/** Reloads the page to restart the game. @returns {void} */
function reloadGame() {
    window.location.reload();
}


/** Handles pressed game keys. @param {KeyboardEvent} event - Key event. @returns {void} */
function handleKeyDown(event) {
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
