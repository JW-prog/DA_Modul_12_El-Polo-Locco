
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

    /** Creates a small jumping chicken. @param {number} x - Horizontal start position. */
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


    /** Starts randomized recurring jumps. @returns {void} */
    startJumping() {
        const interval = 1800 + Math.random() * 1400;
        this.jumpInterval = setInterval(() => this.jumpWhenReady(), interval);
    }


    /** Starts a jump when the chicken is ready. @returns {void} */
    jumpWhenReady() {
        if (isGamePaused()) return;
        if (this.isActivated && !this.isDead() && !this.isAboveGround()) this.speedY = 25;
    }


    /** Starts the small chicken's gravity loop. @returns {void} */
    applyGravity() {
        setInterval(() => this.updateChickenGravity(), 1000 / 60);
    }


    /** Applies one gravity step. @returns {void} */
    updateChickenGravity() {
        if (isGamePaused()) return;
        if (!this.isAboveGround() && this.speedY <= 0) return;
        this.y -= this.speedY / 2;
        this.speedY -= this.acceleration / 2;
        if (this.y > this.groundY) this.landOnGround();
    }


    /** Places the chicken on the ground. @returns {void} */
    landOnGround() {
        this.y = this.groundY;
        this.speedY = 0;
    }


    /** Checks whether the chicken is airborne. @returns {boolean} Airborne state. */
    isAboveGround() {
        return this.y < this.groundY;
    }


    /** Starts movement and animation loops. @returns {void} */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 1000 / 10);
    }


    /** Updates movement for one frame. @returns {void} */
    updateMovement() {
        if (!this.world || this.isDead() || isGamePaused()) return;
        this.activateNearCharacter();
        if (this.isActivated) this.moveTowardsCharacter();
    }


    /** Updates the current animation. @returns {void} */
    updateAnimation() {
        if (isGamePaused()) return;
        this.playAnimation(this.isDead() ? this.IMAGES_DEAD : this.IMAGES_WALKING);
    }


    /** Activates the chicken near Pepe. @returns {void} */
    activateNearCharacter() {
        if (Math.abs(this.x - this.world.character.x) <= 600) this.isActivated = true;
    }


    /** Moves toward Pepe. @returns {void} */
    moveTowardsCharacter() {
        if (this.world.character.x < this.x) this.moveLeft();
        else this.moveRight();
    }
}



