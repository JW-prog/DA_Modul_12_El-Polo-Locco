
let canvas;
let world;
let keyboard = new Keyboard();

function initGame() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame, { once: true });
    updateSoundButton();
}

function startGame() {
    canvas = document.getElementById('gameCanvas');
    configureCanvas(canvas);
    initLevel1();
    world = new World(canvas, keyboard);
    audioManager.start();
    document.getElementById('startButton').classList.add('is-hidden');
    document.getElementById('startOptions').classList.add('is-hidden');
    updateSoundButton();
    document.getElementById('fullscreen').classList.add('game-running');

    console.log('My character is:', world.character);
  
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
