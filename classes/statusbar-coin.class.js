class StatusBarCoin extends DrawableObject {
    percentage = 0;
    collectedCoins = 0;
    totalCoins = 0;
    x = 20;
    y = 120;
    width = 200;
    height = 60;
    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    /** Creates the coin progress bar. */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.setPercentage(0);
    }


    /** Updates the coin percentage. @param {number} percentage - Coin percentage. @returns {void} */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.IMAGES_COIN[this.resolveImageIndex()]];
    }


    /** Updates collected coin progress. @param {number} collected - Collected coins. @param {number} total - Total coins. @returns {void} */
    setProgress(collected, total) {
        this.collectedCoins = collected;
        this.totalCoins = total;
        this.setPercentage(total > 0 ? collected / total * 100 : 0);
    }


    /** Maps coin progress to an image index. @returns {number} Image index. */
    resolveImageIndex() {
        if (this.percentage <= 0) return 0;
        return Math.min(5, Math.ceil(this.percentage / 20));
    }
}
