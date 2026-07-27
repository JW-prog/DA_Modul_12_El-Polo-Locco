
class World { 

    character;
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarEnemy = new StatusBarEnemy();
    statusBarBottle = new StatusBarBottle();
    statusBarCoin = new StatusBarCoin();
    bottlePercentage = 100;
    gameOver = false;
    throwableObjects = [];
    canThrow = true;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.character = new Character();
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
        this.character.animate();
        this.draw();
        this.checkCollisions();
        this.checkThrowObjects();
    }

    setWorld() {
        // Hier kannst du die Welt-Referenz an das Character-Objekt übergeben
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.character.move();
            this.character.jump();
            this.character.applyGravity();
            this.camera_x = -this.character.x + 100;
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 50);
    }


    checkCollisions() {
        setInterval(() => {
             this.level.enemies.forEach((enemy) => {
             if (this.character.isColliding(enemy)) {
             this.character.hit(); // Energie des Charakters verringern
             this.statusBar.setPercentage(this.character.energy); // StatusBar aktualisieren
             }
         });
        }, 200);
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.D && this.canThrow && this.bottlePercentage > 0) {
                let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100, this.character.otherDirection);
                this.throwableObjects.push(bottle);
                this.bottlePercentage -= 20;
                this.statusBarBottle.setPercentage(this.bottlePercentage);
                this.canThrow = false;
            }

            if (!this.keyboard.D) {
                this.canThrow = true;
            }
        }, 1000 / 60);
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0); // Kamera-Offset anwenden
        this.addObjectsToMap(this.level.backgroundObjects);
        
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarEnemy);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0); // Kamera-Offset zurücksetzen
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);  
        }
        
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}


function enterfullScreen() {
    let element = document.getElementById('fullscreen');
    enterFullscreen(element);
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
    }
}
    

