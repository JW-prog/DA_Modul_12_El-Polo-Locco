class ThrowableObject extends MovableObject {
    hasHit = false;
    gravityInterval;
    movementInterval;
    rotationInterval;
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates and throws a salsa bottle.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {boolean} otherDirection - Left-facing state.
     */
    constructor(x, y, otherDirection = false) {
        super();
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.otherDirection = otherDirection;
        this.throw();
    }


    /**
     * Starts flight movement and rotation.
     * @returns {void}
     */
    throw() {
        this.speedY = 24;
        this.applyGravity();
        this.movementInterval = registerGameInterval(() => this.moveInThrowDirection(), 1000 / 40);
        this.rotationInterval = registerGameInterval(() => this.playAnimation(this.IMAGES_ROTATION), 100);
    }


    /**
     * Moves the bottle in its throw direction.
     * @returns {void}
     */
    moveInThrowDirection() {
        if (isGamePaused()) return;
        this.x += this.otherDirection ? -10 : 10;
    }


    /**
     * Starts bottle gravity.
     * @returns {void}
     */
    applyGravity() {
        this.gravityInterval = registerGameInterval(() => {
            if (isGamePaused()) return;
            if (!this.hasHit) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 30);
    }


    /**
     * Converts the bottle to a splash at its exact impact position.
     * @returns {void}
     */
    splash() {
        const impactX = this.x + this.width / 2;
        const impactY = this.y + this.height / 2;
        this.hasHit = true;
        this.speedY = 0;
        this.stopFlightIntervals();
        this.width = 90;
        this.height = 90;
        this.x = impactX - this.width / 2;
        this.y = impactY - this.height / 2;
        this.img = this.imageCache[this.IMAGES_SPLASH[1]];
    }


    /**
     * Converts a missed bottle to a splash on the ground.
     * @param {number} groundY - Ground line.
     * @returns {void}
     */
    splashOnGround(groundY) {
        this.hasHit = true;
        this.speedY = 0;
        this.stopFlightIntervals();
        this.width = 90;
        this.height = 90;
        this.y = groundY - this.height;
        this.img = this.imageCache[this.IMAGES_SPLASH[1]];
    }


    /**
     * Stops every flight interval.
     * @returns {void}
     */
    stopFlightIntervals() {
        clearInterval(this.gravityInterval);
        clearInterval(this.movementInterval);
        clearInterval(this.rotationInterval);
    }


    /**
     * Marks thrown bottles as airborne.
     * @returns {boolean} Always true.
     */
    isAboveGround() {
        return true;
    }
}
