class ThrowableObject extends MovableObject {
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
        this.throw(100, 100);
    }

    throw() {
        this.speedY = 24;
        this.applyGravity();

        setInterval(() => {
            this.x += this.otherDirection ? -10 : 10;
        }, 1000 / 40);

        setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);
    }

    isAboveGround() {
        return true;
    }
}