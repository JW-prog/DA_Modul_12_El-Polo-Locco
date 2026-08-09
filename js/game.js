
let canvas;
let world;
let keyboard = new Keyboard();

function initGame() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame, { once: true });
    initTouchControls();
    updateSoundButton();
}

function initTouchControls() {
    document.querySelectorAll('.touch-button').forEach(button => {
        button.addEventListener('pointerdown', event => pressTouchButton(event, button));
        button.addEventListener('pointerup', event => releaseTouchButton(event, button));
        button.addEventListener('pointercancel', event => releaseTouchButton(event, button));
        button.addEventListener('contextmenu', event => event.preventDefault());
    });
}

function pressTouchButton(event, button) {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    button.classList.add('is-pressed');
    const key = button.dataset.key;
    if (key === 'THROW') {
        keyboard.THROW = true;
    } else {
        keyboard[key] = true;
    }
}

function releaseTouchButton(event, button) {
    event.preventDefault();
    button.classList.remove('is-pressed');
    const key = button.dataset.key;
    if (key !== 'THROW') {
        keyboard[key] = false;
    }
}

async function startGame() {
    const startButton = document.getElementById('startButton');
    const startLabel = startButton.querySelector('.start-button-label');
    startButton.disabled = true;
    startLabel.textContent = 'Spiel wird geladen ...';
    canvas = document.getElementById('gameCanvas');
    configureCanvas(canvas);
    initLevel1();
    world = new World(canvas, keyboard);
    await waitForInitialGameImages();
    await waitForNextFrame();
    audioManager.start();
    startButton.classList.add('is-hidden');
    document.getElementById('startOptions').classList.add('is-hidden');
    updateSoundButton();
    document.getElementById('fullscreen').classList.add('game-running');

    console.log('My character is:', world.character);
  
}

function waitForInitialGameImages() {
    const drawableObjects = [
        world.character,
        world.statusBar,
        world.statusBarEnemy,
        world.statusBarBottle,
        world.statusBarCoin,
        ...world.level.backgroundObjects,
        ...world.level.clouds,
        ...world.level.bottles,
        ...world.level.coins,
        ...world.level.enemies
    ];
    const images = new Set();

    drawableObjects.forEach(object => {
        if (object.img) images.add(object.img);
        Object.values(object.imageCache || {}).forEach(image => images.add(image));
    });

    return Promise.all([...images].map(waitForImage));
}

function waitForImage(image) {
    if (image.complete) {
        return Promise.resolve();
    }
    return new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
    });
}

function waitForNextFrame() {
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function openOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    overlay.classList.remove('is-hidden');
    overlay.querySelector('.overlay-close').focus();
}

function closeOverlay(overlayId) {
    document.getElementById(overlayId).classList.add('is-hidden');
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        document.querySelectorAll('.game-overlay').forEach(overlay => overlay.classList.add('is-hidden'));
    }
});

function toggleSound() {
    audioManager.toggleMute();
    updateSoundButton();
}

function updateSoundButton() {
    const soundButton = document.getElementById('soundButton');
    const muted = audioManager.isMuted;
    soundButton.querySelector('span').textContent = muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
    soundButton.setAttribute('aria-label', muted ? 'Ton einschalten' : 'Ton ausschalten');
    soundButton.title = muted ? 'Ton einschalten' : 'Ton ausschalten';
}

function configureCanvas(canvasElement) {
    const logicalWidth = 720;
    const logicalHeight = 480;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvasElement.logicalWidth = logicalWidth;
    canvasElement.logicalHeight = logicalHeight;
    canvasElement.pixelRatio = pixelRatio;
    canvasElement.width = logicalWidth * pixelRatio;
    canvasElement.height = logicalHeight * pixelRatio;
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function reloadGame() {
    window.location.reload();
}

window.addEventListener('keydown', (event) => {
    preventGameKeyScrolling(event);
    if (event.code === 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (event.code === 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (event.code === 'ArrowUp') {
        keyboard.UP = true;
    }
    if (event.code === 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (event.code === 'Space') {
        keyboard.SPACE = true;
    }
    if (event.code === 'KeyD') {
        if (!keyboard.D && !event.repeat) {
            keyboard.THROW = true;
        }
        keyboard.D = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') {
        keyboard.LEFT = false;
    }
    if (event.code === 'ArrowRight') {
        keyboard.RIGHT = false;
    }
    if (event.code === 'ArrowUp') {
        keyboard.UP = false;
    }
    if (event.code === 'ArrowDown') {
        keyboard.DOWN = false;
    }
    if (event.code === 'Space') {
        keyboard.SPACE = false;
    }
    if (event.code === 'KeyD') {
        keyboard.D = false;
    }
});

function preventGameKeyScrolling(event) {
    const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'];
    if (world && !world.gameOver && gameKeys.includes(event.code)) {
        event.preventDefault();
    }
}
