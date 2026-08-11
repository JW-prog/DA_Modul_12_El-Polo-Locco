class StatusBar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];
    percentage = 100;
    x = 20;
    y = 0;
    width = 200;
    height = 60;

    /** Creates Pepe's health bar. */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }


    /** Updates the displayed health. @param {number} percentage - Health percentage. @returns {void} */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.IMAGES[this.resolveImageIndex()]];
    }


    /** Maps a percentage to an image index. @returns {number} Image index. */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
