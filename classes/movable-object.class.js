
class MovableObject extends DrawableObject {
    speed = 7;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    maxEnergy = 100;
    lastHit = 0;
    damageCooldown = 1000;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY / 2;
                this.speedY -= this.acceleration / 2;
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }

   

    isColliding(mo) {
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x + mo.width &&
               this.y < mo.y + mo.height;
    }

    hit(damage = 1) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    canTakeDamage() {
        return new Date().getTime() - this.lastHit >= this.damageCooldown;
    }

    heal(amount) {
        this.energy = Math.min(this.maxEnergy, this.energy + amount);
    }

    isDead() {
        return this.energy <= 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000;
        return timepassed < 0.25; // Returns true if less than 0.5 seconds has passed since last hit
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationOnce(images) {
        let i = Math.min(this.currentImage, images.length - 1);
        let path = images[i];
        this.img = this.imageCache[path];
        if (this.currentImage < images.length - 1) {
            this.currentImage++;
        }
    }

    moveRight() {
        this.x += this.speed;    
        this.otherDirection = true; // Character is facing right
         
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = false; // Character is facing left
           
    }
      
     jump() {
        this.speedY = 30;

    }

}
    
