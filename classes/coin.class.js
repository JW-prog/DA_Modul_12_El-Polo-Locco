class Coin extends DrawableObject {
    width = 80;
    height = 80;
    IMAGES_COIN = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

    /** Creates and animates a coin. @param {number} x - X position. @param {number} y - Y position. */
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.animate();
    }


    /** Starts the coin animation loop. @returns {void} */
    animate() {
        setInterval(() => this.playNextCoinFrame(), 300);
    }


    /** Advances the coin animation. @returns {void} */
    playNextCoinFrame() {
        if (isGamePaused()) return;
        const path = this.IMAGES_COIN[this.currentImage % this.IMAGES_COIN.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
