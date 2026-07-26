 class StatusBarEnemy extends DrawableObject {

         percentage = 100;
         x = 500;
         y = 10;
         width = 200;
         height = 60;

    IMAGES_ENEMY = ['img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
               'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
               'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
               'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
               'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
               'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'             
               ];         


    constructor() {
        super();
        this.loadImages(this.IMAGES_ENEMY);
        this.setPercentageEnemy(100);
    }

     setPercentageEnemy(percentage) {
           this.percentage = percentage;
           let pathEnemy = this.IMAGES_ENEMY[this.resolveImageIndexEnemy()];
           this.img = this.imageCache[pathEnemy];
        }

     resolveImageIndexEnemy() {
            if (this.percentage === 100) {
                return 5;
            } else if (this.percentage >= 80) {
                return 4;
            } else if (this.percentage >= 60) {
                return 3;
            } else if (this.percentage >= 40) {
                return 2;
            } else if (this.percentage >= 20) {
                return 1;
            } else {
                return 0;
            }
        }   
}
