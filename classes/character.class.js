
class Character extends MovableObject {
    height = 280;
    width = 120;
    y = 100;
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


    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/long_idle/I-11.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEPING);

    
        this.applyGravity();
        this.x = 220;
    }

    hit(damage = 2) {
        super.hit(damage);
        if (this.isDead()) {
            this.startDeathAnimation();
        }
    }

    startDeathAnimation() {
        if (this.deathAnimationStarted) {
            return;
        }
        this.deathAnimationStarted = true;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }



    animate() {

        setInterval(() => {
            if (this.isDead() || this.world.gameOver) {
                return;
            }

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE) {
                this.lastMovementTime = Date.now();
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
                this.x += this.speed;
                this.otherDirection = false; // Character is facing right
               
            }
            if (this.world.keyboard.LEFT && this.x > 120) {
                this.x -= this.speed;
                this.otherDirection = true; // Character is facing left
            }

            

            if(this.world.keyboard.SPACE && !this.isAboveGround()) { // Jump only if character is on the ground
               this.speedY = 30; // Set the vertical speed for jumping
            }

            this.world.camera_x = -this.x + 100; // Adjust camera position based on character's x position
        }, 1000 / 60);

        setInterval(() => {

            if (this.isDead()) {
                this.startDeathAnimation();
                this.playDeathAnimation();
            } else if (this.isHurt()) {
                this.playCharacterAnimation('hurt', this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playCharacterAnimation('jumping', this.IMAGES_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playCharacterAnimation('walking', this.IMAGES_WALKING);
            } else if (Date.now() - this.lastMovementTime >= this.longIdleDelay) {
                this.playCharacterAnimation('long_idle', this.IMAGES_SLEEPING);
            } else {
                this.playCharacterAnimation('idle', this.IMAGES_IDLE);
            }
        }, 80);
    }

    playCharacterAnimation(state, images) {
        if (this.animationState !== state) {
            this.animationState = state;
            this.currentImage = 0;
        }
        this.playAnimation(images);
    }

    playDeathAnimation() {
        if (this.deathAnimationFinished) {
            return;
        }

        let frameIndex = this.currentImage % this.IMAGES_DEAD.length;
        this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
        this.currentImage++;

        if (this.currentImage >= this.IMAGES_DEAD.length * 3) {
            this.deathAnimationFinished = true;
            setTimeout(() => this.isVisible = false, 50);
        }
    }

    jump() {
      console.log('Character is jumping');
    }

    gameOver() {
    if (this.isDead() && !this.world.gameOver) {
        this.playAnimationOnce(this.IMAGES_DEAD);

        setTimeout(() => {
            this.world.gameOver = true;
            console.log('Game over');
        }, 1000);
    }
}
}
