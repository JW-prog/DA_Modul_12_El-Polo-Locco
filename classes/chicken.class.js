
class Chicken extends MovableObject {
    y = 380;
    height = 90;
    width = 90;
    isActivated = false;
    IMAGES_WALKING = [
        'img\\3_enemies_chicken\\chicken_normal\\1_walk\\1_w.png',
        'img\\3_enemies_chicken\\chicken_normal\\1_walk\\2_w.png',
        'img\\3_enemies_chicken\\chicken_normal\\1_walk\\3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    
    constructor(x) {
        super();
        this.loadImage('img\\3_enemies_chicken\\chicken_normal\\1_walk\\1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.35 + Math.random() * 1.05; // Random speed between 0.35 and 1.4
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.world || this.isDead()) {
                return;
            }
            this.activateNearCharacter();
            if (this.isActivated) {
                this.moveTowardsCharacter();
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

    activateNearCharacter() {
        if (Math.abs(this.x - this.world.character.x) <= 600) {
            this.isActivated = true;
        }
    }

    moveTowardsCharacter() {
        if (this.world.character.x < this.x) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }



}
