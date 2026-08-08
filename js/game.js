
let canvas;
let world;
let keyboard = new Keyboard();

function initGame() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame, { once: true });
}

function startGame() {
    canvas = document.getElementById('gameCanvas');
    configureCanvas(canvas);
    initLevel1();
    world = new World(canvas, keyboard);
    document.getElementById('startButton').classList.add('is-hidden');
    document.getElementById('fullscreen').classList.add('game-running');

    console.log('My character is:', world.character);
  
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
