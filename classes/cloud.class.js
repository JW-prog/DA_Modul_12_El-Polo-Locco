class Cloud extends MovableObject {
    y = 50;
    width = 500;
    height = 200;
    speed = 0.15;

    /**
     * Creates and animates a cloud.
     * @param {number} [x] - Horizontal start position. Random when omitted.
     * @param {string} [image] - Cloud image path.
     */
    constructor(x, image = 'img/5_background/layers/4_clouds/1.png') {
        super();
        this.loadImage(image);
        this.x = x ?? Math.random() * 500;
        this.animate();
    }


    /**
     * Starts the cloud movement loop.
     * @returns {void}
     */
    animate() {
        registerGameInterval(() => {
            if (!isGamePaused()) this.moveLeft();
        }, 1000 / 60);
    }
}
