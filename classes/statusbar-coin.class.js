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


    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.setPercentage(0);
    }

    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES_COIN[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    setProgress(collectedCoins, totalCoins) {
        this.collectedCoins = collectedCoins;
        this.totalCoins = totalCoins;
        let percentage = totalCoins > 0 ? (collectedCoins / totalCoins) * 100 : 0;
        this.setPercentage(percentage);
    }

    resolveImageIndex() {
        if (this.percentage <= 0) {
            return 0;
        }
        return Math.min(5, Math.ceil(this.percentage / 20));
    }

}
