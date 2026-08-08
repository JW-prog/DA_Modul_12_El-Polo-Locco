
class ChickenSmall extends MovableObject {
    y = 420;
    groundY = 420;
    height = 50;
    width = 50;
    jumpInterval;
    isActivated = false;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor(x) {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.5 + Math.random() * 0.5;
        this.applyGravity();
        this.startJumping();
        this.animate();
    }

    startJumping() {
        let interval = 1800 + Math.random() * 1400;
        this.jumpInterval = setInterval(() => {
            if (this.isActivated && !this.isDead() && !this.isAboveGround()) {
                this.speedY = 25;
            }
        }, interval);
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY / 2;
                this.speedY -= this.acceleration / 2;
                if (this.y > this.groundY) {
                    this.y = this.groundY;
                    this.speedY = 0;
                }
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        return this.y < this.groundY;
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



