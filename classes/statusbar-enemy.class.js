class StatusBarEnemy extends DrawableObject {
    percentage = 100;
    x = 500;
    y = 10;
    width = 200;
    height = 60;
    IMAGES_ENEMY = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    /** Creates the endboss health bar. */
    constructor() {
        super();
        this.loadImages(this.IMAGES_ENEMY);
        this.setPercentageEnemy(100);
    }


    /** Updates endboss health. @param {number} percentage - Health percentage. @returns {void} */
    setPercentageEnemy(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.IMAGES_ENEMY[this.resolveImageIndexEnemy()]];
    }


    /** Maps endboss health to an image index. @returns {number} Image index. */
    resolveImageIndexEnemy() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
