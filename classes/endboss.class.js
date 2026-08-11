
class Endboss extends MovableObject {
    height = 500;
    width = 300;
    y = -30;
    health = 100;
    speed = 2;
    attackRange = 180;
    attackCooldown = 1200;
    lastAttack = 0;
    attackEnd = 0;
    animationState = '';
    deathAnimationFinished = false;
    hasSeenCharacter = false;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /** Creates the endboss and loads its animations. */
    constructor() {
        super();
        this.loadEndbossImages();
        this.x = 2300;
        this.y = 50;
        this.animate();
        this.move();
    }


    /** Loads every endboss animation. @returns {void} */
    loadEndbossImages() {
        this.loadImage(this.IMAGES_WALKING[0]);
        [this.IMAGES_WALKING, this.IMAGES_ALERT, this.IMAGES_ATTACK,
            this.IMAGES_HURT, this.IMAGES_DEAD].forEach((images) => this.loadImages(images));
    }


    /** Starts the endboss animation loop. @returns {void} */
    animate() {
        this.animationInterval = setInterval(() => this.updateAnimation(), 120);
    }


    /** Advances the current endboss animation. @returns {void} */
    updateAnimation() {
        const animation = this.getCurrentAnimation();
        if (this.isDead()) this.playDeathAnimation(animation);
        else this.playAnimation(animation);
    }


    /** Advances the finite death animation. @param {string[]} images - Death frames. @returns {void} */
    playDeathAnimation(images) {
        if (this.deathAnimationFinished) return;
        const frameIndex = this.currentImage % images.length;
        this.img = this.imageCache[images[frameIndex]];
        this.currentImage++;
        if (this.currentImage >= images.length * 2) this.finishDeathAnimation();
    }


    /** Finishes death animation and schedules removal. @returns {void} */
    finishDeathAnimation() {
        this.deathAnimationFinished = true;
        setTimeout(() => this.removeFromWorld(), 120);
    }


    /** Removes the endboss and stops its animation loop. @returns {void} */
    removeFromWorld() {
        if (!this.world) return;
        const index = this.world.level.enemies.indexOf(this);
        if (index >= 0) this.world.level.enemies.splice(index, 1);
        clearInterval(this.animationInterval);
    }


    /** Starts the endboss movement loop. @returns {void} */
    move() {
        setInterval(() => this.updateMovement(), 1000 / 60);
    }


    /** Updates movement and attacks for one frame. @returns {void} */
    updateMovement() {
        if (!this.canMove()) return;
        if (!this.activateOnSight()) return;
        const character = this.world.character;
        const distance = Math.abs(character.x - this.x);
        if (distance <= this.attackRange) this.attack();
        else if (character.x < this.x) this.moveLeft();
        else this.moveRight();
    }


    /** Checks whether movement is currently allowed. @returns {boolean} Movement state. */
    canMove() {
        return this.world && !this.isDead() && !this.isHurt() && !this.isAttacking();
    }


    /** Activates the boss once Pepe sees it. @returns {boolean} Activation state. */
    activateOnSight() {
        if (this.hasSeenCharacter) return true;
        this.hasSeenCharacter = this.hasVisualContact();
        if (this.hasSeenCharacter) audioManager.startEndbossSound();
        return this.hasSeenCharacter;
    }


    /** Checks whether the boss is within the visible canvas. @returns {boolean} Visibility. */
    hasVisualContact() {
        const screenX = this.x + this.world.camera_x;
        const canvasWidth = this.world.canvas.logicalWidth || this.world.canvas.width;
        return screenX < canvasWidth && screenX + this.width > 0;
    }


    /** Selects the current endboss animation. @returns {string[]} Animation frames. */
    getCurrentAnimation() {
        if (this.isDead()) return this.setAnimationState('dead', this.IMAGES_DEAD);
        if (this.isHurt()) return this.setAnimationState('hurt', this.IMAGES_HURT);
        if (this.isAttacking()) return this.setAnimationState('attack', this.IMAGES_ATTACK);
        if (!this.hasSeenCharacter) return this.setAnimationState('alert', this.IMAGES_ALERT);
        return this.setAnimationState('walking', this.IMAGES_WALKING);
    }


    /** Updates animation state. @param {string} name - State. @param {string[]} images - Frames. @returns {string[]} Frames. */
    setAnimationState(name, images) {
        if (this.animationState !== name) {
            this.animationState = name;
            this.currentImage = 0;
        }
        return images;
    }


    /** Checks whether the attack animation is active. @returns {boolean} Attack state. */
    isAttacking() {
        return Date.now() < this.attackEnd;
    }


    /** Starts an attack when its cooldown has elapsed. @returns {void} */
    attack() {
        const now = Date.now();
        if (now - this.lastAttack < this.attackCooldown) return;
        this.lastAttack = now;
        this.attackEnd = now + 800;
        this.damageCharacter();
    }


    /** Damages Pepe during an attack. @returns {void} */
    damageCharacter() {
        if (!this.world.character.canTakeDamage()) return;
        this.world.character.hit(this.world.getEnemyCollisionDamage(this));
        this.world.updateCharacterStatusBar();
    }


    /** Applies damage and controls endboss sounds. @param {number} damage - Damage. @returns {void} */
    hit(damage = 1) {
        super.hit(damage);
        if (this.isDead()) this.stopSoundsAfterDeath();
        else audioManager.playEndbossHitSound();
    }


    /** Stops every endboss sound after death. @returns {void} */
    stopSoundsAfterDeath() {
        audioManager.stopEndbossHitSound();
        audioManager.stopEndbossSound();
    }
}

   
