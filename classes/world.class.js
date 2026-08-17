class World {
    character;
    level = level1;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarEnemy = new StatusBarEnemy();
    statusBarBottle = new StatusBarBottle();
    statusBarCoin = new StatusBarCoin();
    collectedCoins = 0;
    bottlePercentage = 0;
    gameOver = false;
    gameResult = null;
    gameResultStartedAt = 0;
    gameResultImages = {};
    throwableObjects = [];
    lastBottleThrow = 0;
    bottleThrowCooldown = 500;
    isDisposed = false;

    /** Creates and starts a game world. @param {HTMLCanvasElement} canvas - Canvas. @param {Keyboard} keyboard - Input state. */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.totalCoins = this.level.coins.length;
        this.initializeWorld();
    }


    /** Initializes objects and game loops. @returns {void} */
    initializeWorld() {
        this.statusBarCoin.setProgress(0, this.totalCoins);
        this.loadGameResultImages();
        this.initializeCharacter();
        this.level.enemies.forEach((enemy) => enemy.world = this);
        this.draw();
        this.startCollisionChecks();
        this.startThrowChecks();
    }


    /** Creates and connects the player character. @returns {void} */
    initializeCharacter() {
        this.character = new Character();
        this.character.world = this;
        this.previousCharacterBottom = this.character.y + this.character.height;
        this.character.animate();
    }


    /** Preloads result-screen images. @returns {void} */
    loadGameResultImages() {
        this.gameResultImages.won = this.createImage('img/You won, you lost/You won A.png');
        this.gameResultImages.lost = this.createImage('img/You won, you lost/You lost.png');
        this.gameResultImages.gameOver = this.createImage('img/You won, you lost/Game over A.png');
    }


    /** Creates an image. @param {string} path - Image path. @returns {HTMLImageElement} Image. */
    createImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }


    /** Starts recurring collision checks. @returns {void} */
    startCollisionChecks() {
        registerGameInterval(() => this.checkCollisions(), 1000 / 60);
    }


    /** Runs one complete collision update. @returns {void} */
    checkCollisions() {
        if (this.gameOver || isGamePaused()) return;
        this.checkEnemyCollisions();
        this.checkBottleHitsOnEnemies();
        this.checkMissedBottles();
        this.checkCollectibleCollisions();
        this.removeEscapedChickens();
        this.checkGameResult();
        this.previousCharacterBottom = this.character.y + this.character.height;
    }


    /** Checks coin and bottle pickups. @returns {void} */
    checkCollectibleCollisions() {
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    }


    /** Removes regular chickens that left the level. @returns {void} */
    removeEscapedChickens() {
        this.level.enemies = this.level.enemies.filter((enemy) => {
            return enemy instanceof Endboss || enemy.x + enemy.width >= 0;
        });
    }


    /** Detects a won or lost game. @returns {void} */
    checkGameResult() {
        if (this.character.isDead() && this.character.deathAnimationFinished) {
            this.finishGame('lost');
        } else if (!this.character.isDead() && this.level.enemies.length === 0) {
            this.finishGame('won');
        }
    }


    /** Finalizes the game once. @param {'won'|'lost'} result - Game result. @returns {void} */
    finishGame(result) {
        if (this.gameOver) return;
        this.setGameResult(result);
        audioManager.stop();
        this.playResultSound(result);
        document.getElementById('pauseButton').classList.add('is-hidden');
        document.getElementById('restartButton').classList.remove('is-hidden');
    }


    /** Stores the final game state. @param {'won'|'lost'} result - Game result. @returns {void} */
    setGameResult(result) {
        this.gameOver = true;
        this.gameResult = result;
        this.gameResultStartedAt = Date.now();
    }


    /** Plays the matching result sound. @param {'won'|'lost'} result - Game result. @returns {void} */
    playResultSound(result) {
        if (result === 'lost') audioManager.playLostSound();
        if (result === 'won') audioManager.playWonSound();
    }


    /** Checks player contact with every enemy. @returns {void} */
    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            this.resolveEnemyCollision(this.level.enemies[i]);
        }
    }


    /** Resolves one player-enemy collision. @param {MovableObject} enemy - Enemy. @returns {void} */
    resolveEnemyCollision(enemy) {
        const stomping = !(enemy instanceof Endboss) && this.isStomping(enemy);
        if (enemy.isDead() || (!this.isCharacterTouchingEnemy(enemy) && !stomping)) return;
        if (stomping) this.defeatChicken(enemy);
        else this.damageCharacter(enemy);
    }


    /** Checks the visible parts of Pepe and an enemy for contact. @param {MovableObject} enemy - Enemy. @returns {boolean} Collision state. */
    isCharacterTouchingEnemy(enemy) {
        const player = { left: this.character.x + 30,
            right: this.character.x + this.character.width - 30,
            top: this.character.y + 50,
            bottom: this.character.y + this.character.height - 15 };
        const target = this.getEnemyContactHitbox(enemy);
        return player.right > target.left && player.left < target.right &&
            player.bottom > target.top && player.top < target.bottom;
    }


    /** Returns a reduced contact hitbox matching the visible enemy body. @param {MovableObject} enemy - Enemy. @returns {Object} Hitbox edges. */
    getEnemyContactHitbox(enemy) {
        if (enemy instanceof Endboss) {
            return { left: enemy.x + 55, right: enemy.x + enemy.width - 35,
                top: enemy.y + 60, bottom: enemy.y + enemy.height - 20 };
        }
        return { left: enemy.x + 15, right: enemy.x + enemy.width - 15,
            top: enemy.y + 15, bottom: enemy.y + enemy.height - 5 };
    }


    /** Damages Pepe when his cooldown permits it. @param {MovableObject} enemy - Enemy. @returns {void} */
    damageCharacter(enemy) {
        if (!this.character.canTakeDamage()) return;
        this.character.hit(this.getEnemyCollisionDamage(enemy));
        this.updateCharacterStatusBar();
    }


    /** Returns contact damage for an enemy type. @param {MovableObject} enemy - Enemy. @returns {number} Damage. */
    getEnemyCollisionDamage(enemy) {
        if (enemy instanceof ChickenSmall) return 3;
        if (enemy instanceof Endboss) return 15;
        return 8;
    }


    /** Updates Pepe's health bar. @returns {void} */
    updateCharacterStatusBar() {
        this.statusBar.setPercentage(this.character.energy / this.character.maxEnergy * 100);
    }


    /** Checks whether Pepe lands on an enemy. @param {MovableObject} enemy - Enemy. @returns {boolean} Stomp state. */
    isStomping(enemy) {
        const bottom = this.character.y + this.character.height;
        const playerLeft = this.character.x + 30;
        const playerRight = this.character.x + this.character.width - 30;
        const target = this.getEnemyContactHitbox(enemy);
        const stompTop = target.top + (enemy instanceof ChickenSmall ? 8 : 2);
        const overlaps = playerRight > target.left && playerLeft < target.right;
        return overlaps && this.character.speedY < 0 &&
            this.previousCharacterBottom <= stompTop + 8 && bottom >= stompTop;
    }


    /** Defeats a stomped chicken. @param {Chicken|ChickenSmall} enemy - Chicken. @returns {void} */
    defeatChicken(enemy) {
        enemy.hit(enemy.energy);
        this.playChickenHitSound(enemy);
        this.character.speedY = 18;
        this.removeChickenAfterDeath(enemy);
    }


    /** Plays the matching chicken sound. @param {Chicken|ChickenSmall} enemy - Chicken. @returns {void} */
    playChickenHitSound(enemy) {
        if (enemy instanceof ChickenSmall) audioManager.playSmallChickenHitSound();
        else if (enemy instanceof Chicken) audioManager.playNormalChickenHitSound();
    }


    /** Schedules removal of a defeated chicken. @param {MovableObject} enemy - Chicken. @returns {void} */
    removeChickenAfterDeath(enemy) {
        setTimeout(() => this.removeEnemy(enemy), 500);
    }


    /** Removes one enemy from the level. @param {MovableObject} enemy - Enemy. @returns {void} */
    removeEnemy(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index >= 0) this.level.enemies.splice(index, 1);
    }


    /** Checks thrown bottles against enemies. @returns {void} */
    checkBottleHitsOnEnemies() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            if (!this.throwableObjects[i].hasHit) this.checkBottleAgainstEnemies(this.throwableObjects[i]);
        }
    }


    /** Breaks thrown bottles that reach the ground. @returns {void} */
    checkMissedBottles() {
        this.throwableObjects.forEach((bottle) => {
            if (!bottle.hasHit && bottle.y + bottle.height >= 470) this.breakBottleOnGround(bottle);
        });
    }


    /** Resolves a bottle impact on the ground. @param {ThrowableObject} bottle - Bottle. @returns {void} */
    breakBottleOnGround(bottle) {
        bottle.splashOnGround(470);
        audioManager.playBottleBreakSound();
        setTimeout(() => this.removeThrowable(bottle), 250);
    }


    /** Checks one bottle against all enemies. @param {ThrowableObject} bottle - Bottle. @returns {void} */
    checkBottleAgainstEnemies(bottle) {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (!enemy.isDead() && this.isBottleHittingEnemy(bottle, enemy)) {
                this.resolveBottleHit(bottle, enemy);
                return;
            }
        }
    }


    /** Checks a thrown bottle against the visible body of an enemy. @param {ThrowableObject} bottle - Bottle. @param {MovableObject} enemy - Enemy. @returns {boolean} Hit state. */
    isBottleHittingEnemy(bottle, enemy) {
        const projectile = { left: bottle.x + 6, right: bottle.x + bottle.width - 6,
            top: bottle.y + 6, bottom: bottle.y + bottle.height - 6 };
        const target = this.getBottleTargetHitbox(enemy);
        return projectile.right > target.left && projectile.left < target.right &&
            projectile.bottom > target.top && projectile.top < target.bottom;
    }


    /** Returns the visible enemy area that bottles can hit. @param {MovableObject} enemy - Enemy. @returns {Object} Hitbox edges. */
    getBottleTargetHitbox(enemy) {
        if (enemy instanceof Endboss) {
            return { left: enemy.x + 45, right: enemy.x + enemy.width - 30,
                top: enemy.y + 25, bottom: enemy.y + enemy.height - 20 };
        }
        return { left: enemy.x + 10, right: enemy.x + enemy.width - 10,
            top: enemy.y + 10, bottom: enemy.y + enemy.height - 5 };
    }


    /** Resolves a bottle hit. @param {ThrowableObject} bottle - Bottle. @param {MovableObject} enemy - Enemy. @returns {void} */
    resolveBottleHit(bottle, enemy) {
        this.damageEnemyWithBottle(enemy);
        bottle.splash();
        audioManager.playBottleBreakSound();
        this.playChickenHitSound(enemy);
        setTimeout(() => this.removeThrowable(bottle), 250);
    }


    /** Applies bottle damage to an enemy. @param {MovableObject} enemy - Enemy. @returns {void} */
    damageEnemyWithBottle(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(15);
            this.statusBarEnemy.setPercentageEnemy(enemy.energy);
        } else {
            enemy.hit(enemy.energy);
            this.removeChickenAfterDeath(enemy);
        }
    }


    /** Removes a thrown bottle. @param {ThrowableObject} bottle - Bottle. @returns {void} */
    removeThrowable(bottle) {
        const index = this.throwableObjects.indexOf(bottle);
        if (index >= 0) this.throwableObjects.splice(index, 1);
    }


    /** Checks and collects coins. @returns {void} */
    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            if (this.isCharacterCloseToCoin(this.level.coins[i])) this.collectCoin(i);
        }
    }


    /** Collects one coin. @param {number} index - Coin index. @returns {void} */
    collectCoin(index) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        this.statusBarCoin.setProgress(this.collectedCoins, this.totalCoins);
        audioManager.playCoinSound();
    }


    /** Checks Pepe's reduced hitbox against a coin. @param {Coin} coin - Coin. @returns {boolean} Collision state. */
    isCharacterCloseToCoin(coin) {
        const player = this.getCharacterCoinHitbox();
        const target = this.getCoinHitbox(coin);
        return player.right > target.left && player.left < target.right &&
            player.bottom > target.top && player.top < target.bottom;
    }


    /** Returns Pepe's pickup hitbox used for coins. @returns {Object} Hitbox edges. */
    getCharacterCoinHitbox() {
        return { left: this.character.x + 30, right: this.character.x + this.character.width - 30,
            top: this.character.y + 115, bottom: this.character.y + this.character.height - 20 };
    }


    /** Returns Pepe's collectible hitbox. @returns {Object} Hitbox edges. */
    getCharacterCollectibleHitbox() {
        return { left: this.character.x + 45, right: this.character.x + this.character.width - 45,
            top: this.character.y + 60, bottom: this.character.y + this.character.height - 30 };
    }


    /** Returns a coin's visible pickup hitbox. @param {Coin} coin - Coin. @returns {Object} Hitbox edges. */
    getCoinHitbox(coin) {
        return { left: coin.x + 12, right: coin.x + coin.width - 12,
            top: coin.y + 12, bottom: coin.y + coin.height - 12 };
    }


    /** Checks and collects ground bottles. @returns {void} */
    checkBottleCollisions() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            if (this.isCharacterTouchingBottle(this.level.bottles[i])) this.collectBottle(i);
        }
    }


    /** Checks Pepe's reduced hitbox against the visible part of a bottle. @param {Bottle} bottle - Bottle. @returns {boolean} Collision state. */
    isCharacterTouchingBottle(bottle) {
        const player = this.getCharacterCollectibleHitbox();
        const target = { left: bottle.x + 22, right: bottle.x + bottle.width - 22,
            top: bottle.y + 8, bottom: bottle.y + bottle.height - 5 };
        return player.right > target.left && player.left < target.right &&
            player.bottom > target.top && player.top < target.bottom;
    }


    /** Collects one ground bottle. @param {number} index - Bottle index. @returns {void} */
    collectBottle(index) {
        this.level.bottles.splice(index, 1);
        this.bottlePercentage = Math.min(100, this.bottlePercentage + 20);
        this.statusBarBottle.setPercentage(this.bottlePercentage);
        audioManager.playBottleCollectSound();
    }


    /** Starts recurring throw-input checks. @returns {void} */
    startThrowChecks() {
        registerGameInterval(() => this.checkThrowInput(), 1000 / 60);
    }


    /** Processes one throw input. @returns {void} */
    checkThrowInput() {
        if (isGamePaused()) return;
        if (!this.gameOver && this.keyboard.THROW && this.bottlePercentage > 0 &&
            this.canThrowBottle()) this.throwBottle();
        this.keyboard.THROW = false;
    }


    /** Checks the delay between two bottle throws. @returns {boolean} Whether throwing is allowed. */
    canThrowBottle() {
        return Date.now() - this.lastBottleThrow >= this.bottleThrowCooldown;
    }


    /** Creates a thrown bottle and consumes inventory. @returns {void} */
    throwBottle() {
        this.lastBottleThrow = Date.now();
        this.character.wakeUp();
        const bottle = new ThrowableObject(this.character.x + 50,
            this.character.y + 100, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        this.bottlePercentage -= 20;
        this.statusBarBottle.setPercentage(this.bottlePercentage);
    }


    /** Draws one animation frame. @returns {void} */
    draw() {
        if (this.isDisposed) return;
        this.prepareCanvas();
        this.drawWorldObjects();
        this.drawFixedObjects();
        this.drawGameResult();
        if (this.shouldContinueDrawing()) requestAnimationFrame(() => this.draw());
    }


    /** Clears and scales the canvas. @returns {void} */
    prepareCanvas() {
        const ratio = this.canvas.pixelRatio || 1;
        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.ctx.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
    }


    /** Draws camera-relative game objects. @returns {void} */
    drawWorldObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
    }


    /** Draws screen-fixed status bars. @returns {void} */
    drawFixedObjects() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarEnemy);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
    }


    /** Checks whether frames are still needed. @returns {boolean} Drawing state. */
    shouldContinueDrawing() {
        return !this.isDisposed && (!this.gameResult || Date.now() - this.gameResultStartedAt < 2000);
    }


    /** Marks this world as inactive so its drawing loop can end. @returns {void} */
    dispose() {
        this.isDisposed = true;
        this.gameOver = true;
    }


    /** Returns logical canvas width. @returns {number} Width. */
    getCanvasWidth() {
        return this.canvas.logicalWidth || this.canvas.width;
    }


    /** Returns logical canvas height. @returns {number} Height. */
    getCanvasHeight() {
        return this.canvas.logicalHeight || this.canvas.height;
    }


    /** Draws the current result overlay. @returns {void} */
    drawGameResult() {
        if (!this.gameResult) return;
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        this.ctx.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
        this.drawCenteredResultImage(this.getCurrentResultImage());
        this.ctx.restore();
    }


    /** Selects the current result image. @returns {HTMLImageElement} Result image. */
    getCurrentResultImage() {
        const elapsed = Date.now() - this.gameResultStartedAt;
        return elapsed < 1800 ? this.gameResultImages[this.gameResult] : this.gameResultImages.gameOver;
    }


    /** Draws a centered result image. @param {HTMLImageElement} image - Result image. @returns {void} */
    drawCenteredResultImage(image) {
        if (!image || !image.complete || !image.naturalWidth) return;
        const size = this.getResultImageSize(image);
        const x = (this.getCanvasWidth() - size.width) / 2;
        const y = (this.getCanvasHeight() - size.height) / 2;
        this.ctx.drawImage(image, x, y, size.width, size.height);
    }


    /** Calculates scaled result dimensions. @param {HTMLImageElement} image - Result image. @returns {Object} Width and height. */
    getResultImageSize(image) {
        const scale = Math.min(this.getCanvasWidth() * 0.9 / image.naturalWidth,
            this.getCanvasHeight() * 0.9 / image.naturalHeight);
        return { width: image.naturalWidth * scale, height: image.naturalHeight * scale };
    }


    /** Draws a list of objects. @param {DrawableObject[]} objects - Objects. @returns {void} */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }


    /** Draws one object with its orientation. @param {DrawableObject} object - Object. @returns {void} */
    addToMap(object) {
        if (object.otherDirection) this.flipImage(object);
        object.draw(this.ctx);
        object.drawFrame(this.ctx);
        if (object.otherDirection) this.flipImageBack(object);
    }


    /** Mirrors the canvas for an object. @param {DrawableObject} object - Object. @returns {void} */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x *= -1;
    }


    /** Restores the canvas after mirroring. @param {DrawableObject} object - Object. @returns {void} */
    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore();
    }
}


/** Enters fullscreen for the game container. @returns {void} */
function enterfullScreen() {
    enterFullscreen(document.getElementById('fullscreen'));
}


/** Requests supported browser fullscreen mode. @param {HTMLElement} element - Target element. @returns {void} */
function enterFullscreen(element) {
    const request = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
    if (request) request.call(element);
}
