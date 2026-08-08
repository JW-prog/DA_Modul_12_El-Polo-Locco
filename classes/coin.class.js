class Coin extends DrawableObject {
    width = 80;
    height = 80;

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval(() => {
            let imageIndex = this.currentImage % this.IMAGES_COIN.length;
            let imagePath = this.IMAGES_COIN[imageIndex];
            this.img = this.imageCache[imagePath];
            this.currentImage++;
        }, 300);
    }
}
