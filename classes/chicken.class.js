
class Chicken extends MovableObject {
    y = 380;
    height = 90;
    width = 90;
    IMAGES_WALKING = [
        'img\\3_enemies_chicken\\chicken_normal\\1_walk\\1_w.png',
        'img\\3_enemies_chicken\\chicken_normal\\1_walk\\2_w.png',
        'img\\3_enemies_chicken\\chicken_normal\\1_walk\\3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    
    constructor() {
        super();
        this.loadImage('img\\3_enemies_chicken\\chicken_normal\\1_walk\\1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 700 + Math.random() * 700; // Random x position between 100 and 800
        this.speed = 0.5 + Math.random() * 0.5; // Random speed between 0.5 and 1.0
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000 / 10);
    }



}
