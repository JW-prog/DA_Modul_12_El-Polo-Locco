class StatusBarBottle extends DrawableObject {
    percentage = 0;
    x = 20;
    y = 60;
    width = 200;
    height = 60;
    IMAGES_BOTTLES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    /** Creates the bottle inventory bar. */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLES);
        this.setPercentage(0);
    }


    /** Updates bottle inventory. @param {number} percentage - Inventory percentage. @returns {void} */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.IMAGES_BOTTLES[this.resolveImageIndex()]];
    }


    /** Maps inventory to an image index. @returns {number} Image index. */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
