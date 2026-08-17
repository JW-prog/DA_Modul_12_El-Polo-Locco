class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a background layer.
     * @param {string} imagePath - Image path.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    constructor(imagePath, x, y) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}
