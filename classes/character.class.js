
class Character extends MovableObject {
    height = 280;
    width = 120;
    y = 100;
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


    constructor() {
        super();
        this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

    
        this.applyGravity();
        this.x = 220 + Math.random() * 500; // Random x position between 200 and 700
    }



    animate() {

        setInterval(() => {
            if (this.isDead() || this.world.gameOver) {
                return;
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
                this.moveRight(); // Prevent moving right beyond the level end
                this.x += this.speed;
                this.otherDirection = false; // Character is facing right
               
            }
            if (this.world.keyboard.LEFT && this.x > 120) {
                this.moveLeft(); // Prevent moving left beyond the canvas
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
                if (!this.deathAnimationStarted) {
                    this.deathAnimationStarted = true;
                    this.currentImage = 0;
                }
                this.playDeathAnimation();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
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
