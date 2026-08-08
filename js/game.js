
let canvas;
let world;
let keyboard = new Keyboard();

function initGame() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame, { once: true });
}

function startGame() {
    canvas = document.getElementById('gameCanvas');
    initLevel1();
    world = new World(canvas, keyboard);
    document.getElementById('startButton').classList.add('is-hidden');
    document.getElementById('fullscreen').classList.add('game-running');

    console.log('My character is:', world.character);
  
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
    if (event.keyCode === 37) {
        keyboard.LEFT = true;
    }
    if (event.keyCode === 39) {
        keyboard.RIGHT = true;
    }
    if (event.keyCode === 38) {
        keyboard.UP = true;
    }
    if (event.keyCode === 40) {
        keyboard.DOWN = true;
    }
    if (event.keyCode === 32) {
        keyboard.SPACE = true;
    }
    if (event.keyCode === 68) {
        if (!keyboard.D && !event.repeat) {
            keyboard.THROW = true;
        }
        keyboard.D = true;
    }
    console.log(keyboard);
});

window.addEventListener('keyup', (event) => {
    console.log('Key released:', event.keyCode);
    if (event.keyCode === 37) {
        keyboard.LEFT = false;
    }
    if (event.keyCode === 39) {
        keyboard.RIGHT = false;
    }
    if (event.keyCode === 38) {
        keyboard.UP = false;
    }
    if (event.keyCode === 40) {
        keyboard.DOWN = false;
    }
    if (event.keyCode === 32) {
        keyboard.SPACE = false;
    }
    if (event.keyCode === 68) {
        keyboard.D = false;
    }
    console.log(keyboard);
});
