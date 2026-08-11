class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 300;
    width = 100;
    height = 100;
    isVisible = true;

    /**
     * Loads the object's initial image.
     * @param {string} path - Relative image path.
     * @returns {void}
     */
    loadImage(path) {
        this.img = this.createImage(path);
    }


    /**
     * Creates an image for a path.
     * @param {string} path - Relative image path.
     * @returns {HTMLImageElement} Loaded image element.
     */
    createImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }


    /**
     * Draws the object when it is visible.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @returns {void}
     */
    draw(ctx) {
        if (this.isVisible) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }


    /**
     * Optional debug-frame hook for subclasses.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @returns {void}
     */
    drawFrame(ctx) {}


    /**
     * Preloads images into the image cache.
     * @param {string[]} paths - Relative image paths.
     * @returns {void}
     */
    loadImages(paths) {
        paths.forEach((path) => {
            this.imageCache[path] = this.createImage(path);
        });
    }
}
