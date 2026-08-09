
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
    totalCoins = 0;
    bottlePercentage = 0;
    gameOver = false;
    gameResult = null;
    gameResultStartedAt = 0;
    gameResultImages = {};
    throwableObjects = [];
    previousCharacterBottom;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.totalCoins = this.level.coins.length;
        this.statusBarCoin.setProgress(0, this.totalCoins);
        this.loadGameResultImages();
        this.character = new Character();
        this.character.world = this;
        this.previousCharacterBottom = this.character.y + this.character.height;
        this.level.enemies.forEach(enemy => enemy.world = this);
        this.character.animate();
        this.draw();
        this.startCollisionChecks();
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


    startCollisionChecks() {
        setInterval(() => {
            this.checkCollisions();
        }, 1000 / 60);
    }

    checkCollisions() {
        if (this.gameOver) {
            return;
        }
        this.checkEnemyCollisions();
        this.checkBottleHitsOnEnemies();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.removeEscapedChickens();
        this.checkGameResult();
        this.previousCharacterBottom = this.character.y + this.character.height;
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
            if (this.character.deathAnimationFinished) {
                this.finishGame('lost');
            }
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
        audioManager.stop();
        document.getElementById('restartButton').classList.remove('is-hidden');
    }

    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            let stompsChicken = !(enemy instanceof Endboss) && this.isStomping(enemy);
            if (!enemy.isDead() && (this.character.isColliding(enemy) || stompsChicken)) {
                if (stompsChicken) {
                    this.defeatChicken(enemy);
                } else if (this.character.canTakeDamage()) {
                    this.character.hit(this.getEnemyCollisionDamage(enemy));
                    this.updateCharacterStatusBar();
                }
            }
        }
    }

    getEnemyCollisionDamage(enemy) {
        if (enemy instanceof ChickenSmall) {
            return 3;
        }
        if (enemy instanceof Endboss) {
            return 15;
        }
        return 8;
    }

    updateCharacterStatusBar() {
        let percentage = (this.character.energy / this.character.maxEnergy) * 100;
        this.statusBar.setPercentage(percentage);
    }

    isStomping(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        let horizontallyOverlapping =
            this.character.x + this.character.width > enemy.x &&
            this.character.x < enemy.x + enemy.width;

        return horizontallyOverlapping &&
            this.character.speedY < 0 &&
            this.previousCharacterBottom <= enemyTop + 10 &&
            characterBottom >= enemyTop;
    }

    defeatChicken(enemy) {
        enemy.hit(enemy.energy);
        this.character.speedY = 18;
        this.removeChickenAfterDeath(enemy);
    }

    removeChickenAfterDeath(enemy) {
        setTimeout(() => {
            let currentIndex = this.level.enemies.indexOf(enemy);
            if (currentIndex >= 0) {
                this.level.enemies.splice(currentIndex, 1);
            }
        }, 500);
    }

    checkBottleHitsOnEnemies() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let bottle = this.throwableObjects[i];
            if (bottle.hasHit) {
                continue;
            }
            for (let j = this.level.enemies.length - 1; j >= 0; j--) {
                let enemy = this.level.enemies[j];
                if (enemy.isDead() || !bottle.isColliding(enemy)) {
                    continue;
                }
                if (enemy instanceof Endboss) {
                    enemy.hit(15);
                    this.statusBarEnemy.setPercentageEnemy(enemy.energy);
                } else {
                    enemy.hit(enemy.energy);
                    this.removeChickenAfterDeath(enemy);
                }
                bottle.splash(enemy);
                this.removeBottleAfterSplash(bottle);
                break;
            }
        }
    }

    removeBottleAfterSplash(bottle) {
        setTimeout(() => {
            let bottleIndex = this.throwableObjects.indexOf(bottle);
            if (bottleIndex >= 0) {
                this.throwableObjects.splice(bottleIndex, 1);
            }
        }, 250);
    }

    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            if (this.character.isColliding(this.level.coins[i])) {
                this.level.coins.splice(i, 1);
                audioManager.playCoinSound();
                this.collectedCoins++;
                this.statusBarCoin.setProgress(this.collectedCoins, this.totalCoins);
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
            if (this.keyboard.THROW && this.bottlePercentage > 0) {
                let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100, this.character.otherDirection);
                this.throwableObjects.push(bottle);
                this.bottlePercentage -= 20;
                this.statusBarBottle.setPercentage(this.bottlePercentage);
            }
            this.keyboard.THROW = false;
        }, 1000 / 60);
    }


    draw() {
        this.ctx.setTransform(this.canvas.pixelRatio || 1, 0, 0, this.canvas.pixelRatio || 1, 0, 0);
        this.ctx.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

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
        if (this.shouldContinueDrawing()) {
            requestAnimationFrame(() => this.draw());
        }
    }

    shouldContinueDrawing() {
        return !this.gameResult || new Date().getTime() - this.gameResultStartedAt < 2000;
    }

    getCanvasWidth() {
        return this.canvas.logicalWidth || this.canvas.width;
    }

    getCanvasHeight() {
        return this.canvas.logicalHeight || this.canvas.height;
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
        this.ctx.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
        this.drawCenteredResultImage(image);
        this.ctx.restore();
    }

    drawCenteredResultImage(image) {
        if (!image || !image.complete || image.naturalWidth === 0) {
            return;
        }

        let maxWidth = this.getCanvasWidth() * 0.9;
        let maxHeight = this.getCanvasHeight() * 0.9;
        let scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
        let width = image.naturalWidth * scale;
        let height = image.naturalHeight * scale;
        let x = (this.getCanvasWidth() - width) / 2;
        let y = (this.getCanvasHeight() - height) / 2;
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
    

