class World extends WorldRenderer {
    character;
    level = level1;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarEnemy = new StatusBar('enemy', 500, 10, 100);
    statusBarBottle = new StatusBar('bottle', 20, 60, 0);
    statusBarCoin = new StatusBar('coin', 20, 120, 0);
    collectedCoins = 0;
    bottlePercentage = 0;
    gameOver = false;
    gameResult = null;
    gameResultStartedAt = 0;
    gameResultImages = {};
    throwableObjects = [];
    lastBottleThrow = 0;
    bottleThrowCooldown = 500;
    isDisposed = false;

    /**
     * Creates and starts a game world.
     * @param {HTMLCanvasElement} canvas - Canvas.
     * @param {Keyboard} keyboard - Input state.
     */
    constructor(canvas, keyboard) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.totalCoins = this.level.coins.length;
        this.initializeWorld();
    }


    /**
     * Initializes objects and game loops.
     * @returns {void}
     */
    initializeWorld() {
        this.statusBarCoin.setProgress(0, this.totalCoins);
        this.loadGameResultImages();
        this.initializeCharacter();
        this.level.enemies.forEach((enemy) => enemy.world = this);
        this.draw();
        this.startCollisionChecks();
        this.startThrowChecks();
    }


    /**
     * Creates and connects the player character.
     * @returns {void}
     */
    initializeCharacter() {
        this.character = new Character();
        this.character.world = this;
        this.previousCharacterBottom = this.character.y + this.character.height;
        this.character.animate();
    }


    /**
     * Preloads result-screen images.
     * @returns {void}
     */
    loadGameResultImages() {
        this.gameResultImages.won = this.createImage('img/You won, you lost/You won A.png');
        this.gameResultImages.lost = this.createImage('img/You won, you lost/You lost.png');
        this.gameResultImages.gameOver = this.createImage('img/You won, you lost/Game over A.png');
    }


    /**
     * Creates an image.
     * @param {string} path - Image path.
     * @returns {HTMLImageElement} Image.
     */
    createImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }
}


/**
 * Enters fullscreen for the game container.
 * @returns {void}
 */
function enterfullScreen() {
    enterFullscreen(document.getElementById('fullscreen'));
}


/**
 * Requests supported browser fullscreen mode.
 * @param {HTMLElement} element - Target element.
 * @returns {void}
 */
function enterFullscreen(element) {
    const request = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
    if (request) request.call(element);
}
