class StatusBar extends DrawableObject {
    percentage = 0;
    width = 200;
    height = 60;

    /**
     * Creates a status bar.
     *
     * Without arguments, it creates Pepe's health bar.
     * @param {string[]} images - Images from empty to full.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     * @param {number} percentage - Initial percentage.
     */
    constructor(images = StatusBar.getHealthImages(), x = 20, y = 0, percentage = 100) {
        super();
        this.images = images;
        this.x = x;
        this.y = y;
        this.loadImages(this.images);
        this.setPercentage(percentage);
    }

    /**
     * Returns Pepe's health-bar images.
     * @returns {string[]} Image paths.
     */
    static getHealthImages() {
        return [
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
        ];
    }

    /**
     * Updates the displayed value.
     * @param {number} percentage - New percentage.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.images[this.resolveImageIndex()]];
    }

    /**
     * Maps the percentage to an image.
     * @returns {number} Image index.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage <= 0) return 0;
        return Math.max(1, Math.floor(this.percentage / 20));
    }
}
