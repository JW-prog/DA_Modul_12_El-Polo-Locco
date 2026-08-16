
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
    
    /** Creates a normal chicken. @param {number} x - Horizontal start position. */
    constructor(x) {
        super();
        this.loadImage('img\\3_enemies_chicken\\chicken_normal\\1_walk\\1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.35 + Math.random() * 1.05;
        this.animate();
    }


    /** Starts movement and animation loops. @returns {void} */
    animate() {
        registerGameInterval(() => this.updateMovement(), 1000 / 60);
        registerGameInterval(() => this.updateAnimation(), 1000 / 10);
    }


    /** Updates movement for one frame. @returns {void} */
    updateMovement() {
        if (!this.world || this.isDead() || isGamePaused()) return;
        this.activateNearCharacter();
        if (this.isActivated && !this.isTouchingCharacter()) this.moveTowardsCharacter();
    }


    /** Updates the current animation. @returns {void} */
    updateAnimation() {
        if (isGamePaused()) return;
        if (this.isDead()) this.playAnimation(this.IMAGES_DEAD);
        else if (!this.isTouchingCharacter()) this.playAnimation(this.IMAGES_WALKING);
    }


    /** Checks whether this chicken currently touches Pepe. @returns {boolean} Contact state. */
    isTouchingCharacter() {
        return Boolean(this.world && this.world.isCharacterTouchingEnemy(this));
    }


    /** Activates the chicken near Pepe. @returns {void} */
    activateNearCharacter() {
        if (Math.abs(this.x - this.world.character.x) <= 600) this.isActivated = true;
    }


    /** Moves toward Pepe. @returns {void} */
    moveTowardsCharacter() {
        const chickenCenter = this.x + this.width / 2;
        const characterCenter = this.world.character.x + this.world.character.width / 2;
        const distance = characterCenter - chickenCenter;
        if (Math.abs(distance) <= this.speed) return;
        if (distance < 0) this.moveLeft();
        else this.moveRight();
    }
}
