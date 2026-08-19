class StatusBar extends DrawableObject {
    percentage = 0;
    collectedCoins = 0;
    totalCoins = 0;
    width = 200;
    height = 60;

    /**
     * Creates a status bar.
     *
     * Without arguments, it creates Pepe's health bar.
    * @param {'health'|'enemy'|'bottle'|'coin'} type - Status bar type.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     * @param {number} percentage - Initial percentage.
     */
    constructor(type = 'health', x = 20, y = 0, percentage = 100) {
        super();
        this.type = type;
        this.images = StatusBar.getImages(type);
        this.x = x;
        this.y = y;
        this.loadImages(this.images);
        this.setPercentage(percentage);
    }

    /**
     * Returns Pepe's health-bar images.
     * @returns {string[]} Image paths.
     */
    static getImages(type) {
        const imageSets = {
            health: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/',
            bottle: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/',
            coin: 'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/',
            enemy: 'img/7_statusbars/2_statusbar_endboss/blue/blue'
        };
        const prefix = imageSets[type] || imageSets.health;
        return [0, 20, 40, 60, 80, 100].map((value) => `${prefix}${value}.png`);
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

    /** Updates the collected coin progress. @param {number} collected - Collected coins. @param {number} total - Total coins. @returns {void} */
    setProgress(collected, total) {
        this.collectedCoins = collected;
        this.totalCoins = total;
        this.setPercentage(total > 0 ? collected / total * 100 : 0);
    }

    /**
     * Maps the percentage to an image.
     * @returns {number} Image index.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage <= 0) return 0;
        if (this.type === 'coin') {
            if (this.collectedCoins >= this.totalCoins && this.totalCoins > 0) return 5;
            return Math.min(4, Math.ceil(this.percentage / 20));
        }
        return Math.max(1, Math.floor(this.percentage / 20));
    }
}
