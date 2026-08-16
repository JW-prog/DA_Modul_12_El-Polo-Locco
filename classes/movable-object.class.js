class MovableObject extends DrawableObject {
    speed = 7;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    maxEnergy = 100;
    lastHit = 0;
    damageCooldown = 1000;

    /** Starts the object's gravity loop. @returns {void} */
    applyGravity() {
        registerGameInterval(() => this.updateGravity(), 1000 / 60);
    }


    /** Applies one gravity step. @returns {void} */
    updateGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY / 2;
            this.speedY -= this.acceleration / 2;
        }
    }


    /** Checks whether the object is airborne. @returns {boolean} Airborne state. */
    isAboveGround() {
        return this instanceof ThrowableObject || this.y < 180;
    }


    /**
     * Checks rectangular overlap with another object.
     * @param {DrawableObject} object - Collision target.
     * @returns {boolean} Collision state.
     */
    isColliding(object) {
        const overlapsX = this.x + this.width > object.x && this.x < object.x + object.width;
        const overlapsY = this.y + this.height > object.y && this.y < object.y + object.height;
        return overlapsX && overlapsY;
    }


    /** Applies damage and records the hit time. @param {number} damage - Damage amount. @returns {void} */
    hit(damage = 1) {
        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
    }


    /** Checks the damage cooldown. @returns {boolean} Whether damage is allowed. */
    canTakeDamage() {
        return Date.now() - this.lastHit >= this.damageCooldown;
    }


    /** Restores energy up to its maximum. @param {number} amount - Healing amount. @returns {void} */
    heal(amount) {
        this.energy = Math.min(this.maxEnergy, this.energy + amount);
    }


    /** Checks whether all energy is depleted. @returns {boolean} Death state. */
    isDead() {
        return this.energy <= 0;
    }


    /** Checks whether the hit animation is active. @returns {boolean} Hurt state. */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 0.25;
    }


    /** Advances a looping animation. @param {string[]} images - Animation frames. @returns {void} */
    playAnimation(images) {
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    /** Advances an animation without wrapping. @param {string[]} images - Animation frames. @returns {void} */
    playAnimationOnce(images) {
        const index = Math.min(this.currentImage, images.length - 1);
        this.img = this.imageCache[images[index]];
        this.currentImage = Math.min(this.currentImage + 1, images.length - 1);
    }


    /** Moves right and updates orientation. @returns {void} */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = true;
    }


    /** Moves left and updates orientation. @returns {void} */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = false;
    }


    /** Starts an upward jump. @returns {void} */
    jump() {
        this.speedY = 30;
    }
}
