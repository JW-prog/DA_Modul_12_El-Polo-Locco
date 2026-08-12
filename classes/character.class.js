
class Character extends MovableObject {
    height = 280;
    width = 120;
    y = 100;
    groundY = 190;
    energy = 200;
    maxEnergy = 200;
    damageCooldown = 500;
     IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];


    world; // Reference to the World object
    deathAnimationStarted = false;
    deathAnimationFinished = false;
    animationState = '';
    lastMovementTime = Date.now() - 5000;
    longIdleDelay = 5000;
    wasInAir = false;
    jumpStarted = false;


    /** Creates Pepe and loads all animations. */
    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/long_idle/I-11.png');
        this.loadCharacterImages();
        this.applyGravity();
        this.x = 220;
    }


    /** Loads every character animation. @returns {void} */
    loadCharacterImages() {
        [this.IMAGES_WALKING, this.IMAGES_JUMPING, this.IMAGES_DEAD,
            this.IMAGES_HURT, this.IMAGES_IDLE, this.IMAGES_SLEEPING]
            .forEach((images) => this.loadImages(images));
    }


    /** Starts Pepe's gravity loop. @returns {void} */
    applyGravity() {
        setInterval(() => this.updateCharacterGravity(), 1000 / 60);
    }


    /** Applies one gravity step and clamps the floor. @returns {void} */
    updateCharacterGravity() {
        if (isGamePaused()) return;
        if (!this.isAboveGround() && this.speedY <= 0) return;
        this.y -= this.speedY / 2;
        this.speedY -= this.acceleration / 2;
        if (this.y > this.groundY) this.landOnGround();
    }


    /** Places Pepe exactly on the ground. @returns {void} */
    landOnGround() {
        this.y = this.groundY;
        this.speedY = 0;
    }


    /** Checks whether Pepe is airborne. @returns {boolean} Airborne state. */
    isAboveGround() {
        return this.y < this.groundY;
    }


    /** Applies damage and selects the matching sound/state. @param {number} damage - Damage. @returns {void} */
    hit(damage = 2) {
        super.hit(damage);
        if (this.isDead()) this.handleFatalHit();
        else audioManager.playCharacterHitSound();
    }


    /** Handles Pepe's fatal hit. @returns {void} */
    handleFatalHit() {
        audioManager.stopCharacterHitSound();
        this.startDeathAnimation();
    }


    /** Initializes Pepe's death animation once. @returns {void} */
    startDeathAnimation() {
        if (this.deathAnimationStarted) return;
        this.deathAnimationStarted = true;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }


    /** Starts movement and animation loops. @returns {void} */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 80);
    }

    /** Updates player movement for one frame. @returns {void} */
    updateMovement() {
        if (isGamePaused()) return audioManager.setWalkingSound(false);
        if (this.isDead() || this.world.gameOver) return audioManager.setWalkingSound(false);
        this.checkLanding();
        this.updateWalkingSound();
        this.updateMovementTime();
        this.moveFromInput();
        this.jumpFromInput();
        this.world.camera_x = -this.x + 100;
    }


    /** Records recent player input for idle animations. @returns {void} */
    updateMovementTime() {
        const input = this.world.keyboard;
        if (input.RIGHT || input.LEFT || input.SPACE) this.lastMovementTime = Date.now();
    }


    /** Moves Pepe horizontally from keyboard input. @returns {void} */
    moveFromInput() {
        const input = this.world.keyboard;
        if (input.RIGHT && this.x < this.world.level.levelEndX) this.moveCharacterRight();
        if (input.LEFT && this.x > 120) this.moveCharacterLeft();
    }


    /** Moves Pepe right. @returns {void} */
    moveCharacterRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }


    /** Moves Pepe left. @returns {void} */
    moveCharacterLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }


    /** Starts a jump from keyboard input. @returns {void} */
    jumpFromInput() {
        if (!this.world.keyboard.SPACE || this.isAboveGround() || this.jumpStarted) return;
        this.speedY = 30;
        this.jumpStarted = true;
        audioManager.playJumpSound();
    }


    /** Selects and advances Pepe's current animation. @returns {void} */
    updateAnimation() {
        if (isGamePaused()) return;
        if (this.isDead()) return this.updateDeathAnimation();
        const animation = this.getCharacterAnimation();
        this.playCharacterAnimation(animation.state, animation.images);
    }


    /** Returns the current living-character animation. @returns {Object} State and frames. */
    getCharacterAnimation() {
        if (this.isHurt()) return { state: 'hurt', images: this.IMAGES_HURT };
        if (this.isAboveGround()) return { state: 'jumping', images: this.IMAGES_JUMPING };
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            return { state: 'walking', images: this.IMAGES_WALKING };
        }
        return this.getIdleAnimation();
    }


    /** Selects the short or long idle animation. @returns {Object} State and frames. */
    getIdleAnimation() {
        if (Date.now() - this.lastMovementTime >= this.longIdleDelay) {
            return { state: 'long_idle', images: this.IMAGES_SLEEPING };
        }
        return { state: 'idle', images: this.IMAGES_IDLE };
    }


    /** Advances Pepe's death state. @returns {void} */
    updateDeathAnimation() {
        this.startDeathAnimation();
        this.playDeathAnimation();
    }


    /** Detects a completed landing. @returns {void} */
    checkLanding() {
        const isInAir = this.isAboveGround();
        if (this.jumpStarted && this.wasInAir && !isInAir) {
            audioManager.playLandingSound();
            this.jumpStarted = false;
        }
        this.wasInAir = isInAir;
    }


    /** Synchronizes the walking sound. @returns {void} */
    updateWalkingSound() {
        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        audioManager.setWalkingSound(isMoving && !this.isAboveGround());
    }


    /** Plays an animation and resets changed state. @param {string} state - State name. @param {string[]} images - Frames. @returns {void} */
    playCharacterAnimation(state, images) {
        if (this.animationState !== state) {
            this.animationState = state;
            this.currentImage = 0;
        }
        this.playAnimation(images);
    }


    /** Advances Pepe's finite death animation. @returns {void} */
    playDeathAnimation() {
        if (this.deathAnimationFinished) return;
        const frameIndex = this.currentImage % this.IMAGES_DEAD.length;
        this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
        this.currentImage++;
        if (this.currentImage >= this.IMAGES_DEAD.length * 3) this.finishDeathAnimation();
    }


    /** Completes Pepe's death animation. @returns {void} */
    finishDeathAnimation() {
        this.deathAnimationFinished = true;
        setTimeout(() => this.isVisible = false, 50);
    }
}
