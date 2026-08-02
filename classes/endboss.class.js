
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

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImage(this.IMAGES_ATTACK[0]);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImage(this.IMAGES_HURT[0]);
        this.loadImages(this.IMAGES_HURT);
        this.loadImage(this.IMAGES_DEAD[0]);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2300;
        this.y = 50;
        this.animate();
        this.move();
    }
    
    animate() {
        this.animationInterval = setInterval(() => {
            let animation = this.getCurrentAnimation();
            if (this.isDead()) {
                this.playDeathAnimation(animation);
            } else {
                this.playAnimation(animation);
            }
        }, 120);
    }

    playDeathAnimation(images) {
        if (this.deathAnimationFinished) {
            return;
        }

        let frameIndex = this.currentImage % images.length;
        this.img = this.imageCache[images[frameIndex]];
        this.currentImage++;

        if (this.currentImage >= images.length * 2) {
            this.deathAnimationFinished = true;
            setTimeout(() => this.removeFromWorld(), 120);
        }
    }

    removeFromWorld() {
        if (!this.world) {
            return;
        }

        let index = this.world.level.enemies.indexOf(this);
        if (index >= 0) {
            this.world.level.enemies.splice(index, 1);
        }
        clearInterval(this.animationInterval);
    }

    move() {
        setInterval(() => {
            if (!this.world || this.isDead() || this.isHurt() || this.isAttacking()) {
                return;
            }

            let character = this.world.character;
            let distance = Math.abs(character.x - this.x);

            if (distance <= this.attackRange) {
                this.attack();
            } else if (character.x < this.x) {
                this.moveLeft();
            } else {
                this.moveRight();
            }
        }, 1000 / 60);
    }

    getCurrentAnimation() {
        if (this.isDead()) {
            return this.setAnimationState('dead', this.IMAGES_DEAD);
        }
        if (this.isHurt()) {
            return this.setAnimationState('hurt', this.IMAGES_HURT);
        }
        if (this.isAttacking()) {
            return this.setAnimationState('attack', this.IMAGES_ATTACK);
        }
        return this.setAnimationState('walking', this.IMAGES_WALKING);
    }

    setAnimationState(name, images) {
        if (this.animationState !== name) {
            this.animationState = name;
            this.currentImage = 0;
        }
        return images;
    }

    isAttacking() {
        return new Date().getTime() < this.attackEnd;
    }

    attack() {
        let now = new Date().getTime();
        if (now - this.lastAttack < this.attackCooldown) {
            return;
        }

        this.lastAttack = now;
        this.attackEnd = now + 800;
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
    }

}

   
