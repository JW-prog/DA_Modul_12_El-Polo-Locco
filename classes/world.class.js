
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
    collectedCoins = 0;
    bottlePercentage = 100;
    gameOver = false;
    gameResult = null;
    gameResultStartedAt = 0;
    gameResultImages = {};
    throwableObjects = [];
    canThrow = true;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.loadGameResultImages();
        this.character = new Character();
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
        this.character.animate();
        this.draw();
        this.checkCollisions();
        this.checkThrowObjects();
    }

    loadGameResultImages() {
        this.gameResultImages.won = this.createImage('img/You won, you lost/You won A.png');
        this.gameResultImages.lost = this.createImage('img/You won, you lost/You lost.png');
        this.gameResultImages.gameOver = this.createImage('img/You won, you lost/Game over A.png');
    }

    createImage(path) {
        let image = new Image();
        image.src = path;
        return image;
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
         if (this.gameOver) {
             return;
         }
         this.checkEnemyCollisions();
         this.checkBottleHitsOnEndboss();
         this.checkCoinCollisions();
         this.checkBottleCollisions();
         this.removeEscapedChickens();
         this.checkGameResult();
        }, 200);
    }

    removeEscapedChickens() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if (!(enemy instanceof Endboss) && enemy.x + enemy.width < 0) {
                this.level.enemies.splice(i, 1);
            }
        }
    }

    checkGameResult() {
        if (this.character.isDead()) {
            this.finishGame('lost');
        } else if (this.level.enemies.length === 0) {
            this.finishGame('won');
        }
    }

    finishGame(result) {
        if (this.gameOver) {
            return;
        }
        this.gameOver = true;
        this.gameResult = result;
        this.gameResultStartedAt = new Date().getTime();
    }

    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if (!enemy.isDead() && this.character.isColliding(enemy)) {
                if (!(enemy instanceof Endboss) && this.isStomping(enemy)) {
                    this.defeatChicken(enemy, i);
                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        }
    }

    isStomping(enemy) {
        let characterBottom = this.character.y + this.character.height;
        return this.character.isAboveGround() &&
            this.character.speedY < 0 &&
            characterBottom <= enemy.y + enemy.height;
    }

    defeatChicken(enemy, enemyIndex) {
        enemy.hit(enemy.energy);
        this.character.speedY = 18;
        setTimeout(() => {
            if (this.level.enemies[enemyIndex] === enemy) {
                this.level.enemies.splice(enemyIndex, 1);
            } else {
                let currentIndex = this.level.enemies.indexOf(enemy);
                if (currentIndex >= 0) this.level.enemies.splice(currentIndex, 1);
            }
        }, 500);
    }

    checkBottleHitsOnEndboss() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let bottle = this.throwableObjects[i];
            let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
            if (endboss && !endboss.isDead() && bottle.isColliding(endboss)) {
                endboss.hit(20);
                this.statusBarEnemy.setPercentageEnemy(endboss.energy);
                this.throwableObjects.splice(i, 1);
            }
        }
    }

    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            if (this.character.isColliding(this.level.coins[i])) {
                this.level.coins.splice(i, 1);
                this.collectedCoins++;
                this.character.heal(10);
                this.statusBar.setPercentage(this.character.energy);
                let percentage = (this.collectedCoins / (this.collectedCoins + this.level.coins.length)) * 100;
                this.statusBarCoin.setPercentage(percentage);
            }
        }
    }

    checkBottleCollisions() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            if (this.character.isColliding(this.level.bottles[i])) {
                this.level.bottles.splice(i, 1);
                this.bottlePercentage = Math.min(100, this.bottlePercentage + 20);
                this.statusBarBottle.setPercentage(this.bottlePercentage);
            }
        }
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.gameOver) {
                return;
            }
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
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0); // Kamera-Offset zurücksetzen
        this.drawGameResult();
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    drawGameResult() {
        if (!this.gameResult) {
            return;
        }

        let elapsedTime = new Date().getTime() - this.gameResultStartedAt;
        let image = elapsedTime < 1800
            ? this.gameResultImages[this.gameResult]
            : this.gameResultImages.gameOver;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCenteredResultImage(image);
        this.ctx.restore();
    }

    drawCenteredResultImage(image) {
        if (!image || !image.complete || image.naturalWidth === 0) {
            return;
        }

        let maxWidth = this.canvas.width * 0.9;
        let maxHeight = this.canvas.height * 0.9;
        let scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
        let width = image.naturalWidth * scale;
        let height = image.naturalHeight * scale;
        let x = (this.canvas.width - width) / 2;
        let y = (this.canvas.height - height) / 2;
        this.ctx.drawImage(image, x, y, width, height);
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
    

