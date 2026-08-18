class WorldCollectibles extends WorldEnemyCollision {
    /**
     * Checks thrown bottles against enemies.
     * @returns {void}
     */
    checkBottleHitsOnEnemies() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            if (!this.throwableObjects[i].hasHit) this.checkBottleAgainstEnemies(this.throwableObjects[i]);
        }
    }


    /**
     * Breaks thrown bottles that reach the ground.
     * @returns {void}
     */
    checkMissedBottles() {
        this.throwableObjects.forEach((bottle) => {
            if (!bottle.hasHit && bottle.y + bottle.height >= 470) this.breakBottleOnGround(bottle);
        });
    }


    /**
     * Resolves a bottle impact on the ground.
     * @param {ThrowableObject} bottle - Bottle.
     * @returns {void}
     */
    breakBottleOnGround(bottle) {
        bottle.splashOnGround(470);
        audioManager.playBottleBreakSound();
        setTimeout(() => this.removeThrowable(bottle), 250);
    }


    /**
     * Checks one bottle against all enemies.
     * @param {ThrowableObject} bottle - Bottle.
     * @returns {void}
     */
    checkBottleAgainstEnemies(bottle) {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (!enemy.isDead() && this.isBottleHittingEnemy(bottle, enemy)) {
                this.resolveBottleHit(bottle, enemy);
                return;
            }
        }
    }


    /**
     * Checks a thrown bottle against the visible body of an enemy.
     * @param {ThrowableObject} bottle - Bottle.
     * @param {MovableObject} enemy - Enemy.
     * @returns {boolean} Hit state.
     */
    isBottleHittingEnemy(bottle, enemy) {
        const projectile = { left: bottle.x + 6, right: bottle.x + bottle.width - 6,
            top: bottle.y + 6, bottom: bottle.y + bottle.height - 6 };
        const target = this.getBottleTargetHitbox(enemy);
        return projectile.right > target.left && projectile.left < target.right &&
            projectile.bottom > target.top && projectile.top < target.bottom;
    }


    /**
     * Returns the visible enemy area that bottles can hit.
     * @param {MovableObject} enemy - Enemy.
     * @returns {Object} Hitbox edges.
     */
    getBottleTargetHitbox(enemy) {
        if (enemy instanceof Endboss) {
            return { left: enemy.x + 45, right: enemy.x + enemy.width - 30,
                top: enemy.y + 25, bottom: enemy.y + enemy.height - 20 };
        }
        return { left: enemy.x + 10, right: enemy.x + enemy.width - 10,
            top: enemy.y + 10, bottom: enemy.y + enemy.height - 5 };
    }


    /**
     * Resolves a bottle hit.
     * @param {ThrowableObject} bottle - Bottle.
     * @param {MovableObject} enemy - Enemy.
     * @returns {void}
     */
    resolveBottleHit(bottle, enemy) {
        this.damageEnemyWithBottle(enemy);
        bottle.splash();
        audioManager.playBottleBreakSound();
        this.playChickenHitSound(enemy);
        setTimeout(() => this.removeThrowable(bottle), 250);
    }


    /**
     * Applies bottle damage to an enemy.
     * @param {MovableObject} enemy - Enemy.
     * @returns {void}
     */
    damageEnemyWithBottle(enemy) {
        if (enemy instanceof Endboss) {
            if (!enemy.canTakeBottleDamage()) return;
            enemy.hit(20);
            this.statusBarEnemy.setPercentage(enemy.energy);
        } else {
            enemy.hit(enemy.energy);
            this.removeChickenAfterDeath(enemy);
        }
    }


    /**
     * Removes a thrown bottle.
     * @param {ThrowableObject} bottle - Bottle.
     * @returns {void}
     */
    removeThrowable(bottle) {
        const index = this.throwableObjects.indexOf(bottle);
        if (index >= 0) this.throwableObjects.splice(index, 1);
    }


    /**
     * Checks and collects coins.
     * @returns {void}
     */
    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            if (this.isCharacterCloseToCoin(this.level.coins[i])) this.collectCoin(i);
        }
    }


    /**
     * Collects one coin.
     * @param {number} index - Coin index.
     * @returns {void}
     */
    collectCoin(index) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        this.statusBarCoin.setProgress(this.collectedCoins, this.totalCoins);
        audioManager.playCoinSound();
    }


    /**
     * Checks Pepe's reduced hitbox against a coin.
     * @param {Coin} coin - Coin.
     * @returns {boolean} Collision state.
     */
    isCharacterCloseToCoin(coin) {
        const player = this.getCharacterCoinHitbox();
        const target = this.getCoinHitbox(coin);
        return player.right > target.left && player.left < target.right &&
            player.bottom > target.top && player.top < target.bottom;
    }


    /**
     * Returns Pepe's pickup hitbox used for coins.
     * @returns {Object} Hitbox edges.
     */
    getCharacterCoinHitbox() {
        return { left: this.character.x + 30, right: this.character.x + this.character.width - 30,
            top: this.character.y + 115, bottom: this.character.y + this.character.height - 20 };
    }


    /**
     * Returns Pepe's collectible hitbox.
     * @returns {Object} Hitbox edges.
     */
    getCharacterCollectibleHitbox() {
        return { left: this.character.x + 45, right: this.character.x + this.character.width - 45,
            top: this.character.y + 60, bottom: this.character.y + this.character.height - 30 };
    }


    /**
     * Returns a coin's visible pickup hitbox.
     * @param {Coin} coin - Coin.
     * @returns {Object} Hitbox edges.
     */
    getCoinHitbox(coin) {
        return { left: coin.x + 12, right: coin.x + coin.width - 12,
            top: coin.y + 12, bottom: coin.y + coin.height - 12 };
    }


    /**
     * Checks and collects ground bottles.
     * @returns {void}
     */
    checkBottleCollisions() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            if (this.isCharacterTouchingBottle(this.level.bottles[i])) this.collectBottle(i);
        }
    }


    /**
     * Checks Pepe's reduced hitbox against the visible part of a bottle.
     * @param {Bottle} bottle - Bottle.
     * @returns {boolean} Collision state.
     */
    isCharacterTouchingBottle(bottle) {
        const player = this.getCharacterCollectibleHitbox();
        const target = { left: bottle.x + 22, right: bottle.x + bottle.width - 22,
            top: bottle.y + 8, bottom: bottle.y + bottle.height - 5 };
        return player.right > target.left && player.left < target.right &&
            player.bottom > target.top && player.top < target.bottom;
    }


    /**
     * Collects one ground bottle.
     * @param {number} index - Bottle index.
     * @returns {void}
     */
    collectBottle(index) {
        this.level.bottles.splice(index, 1);
        this.bottlePercentage = Math.min(100, this.bottlePercentage + 20);
        this.statusBarBottle.setPercentage(this.bottlePercentage);
        audioManager.playBottleCollectSound();
    }


    /**
     * Starts recurring throw-input checks.
     * @returns {void}
     */
    startThrowChecks() {
        registerGameInterval(() => this.checkThrowInput(), 1000 / 60);
    }


    /**
     * Processes one throw input.
     * @returns {void}
     */
    checkThrowInput() {
        if (isGamePaused()) return;
        if (!this.keyboard.THROW) return;
        if (this.gameOver || this.bottlePercentage <= 0) {
            this.keyboard.THROW = false;
            return;
        }
        if (!this.canThrowBottle()) return;
        this.throwBottle();
        this.keyboard.THROW = false;
    }


    /**
     * Checks the delay between two bottle throws.
     * @returns {boolean} Whether throwing is allowed.
     */
    canThrowBottle() {
        return Date.now() - this.lastBottleThrow >= this.bottleThrowCooldown;
    }


    /**
     * Creates a thrown bottle and consumes inventory.
     * @returns {void}
     */
    throwBottle() {
        this.lastBottleThrow = Date.now();
        this.character.wakeUp();
        const bottle = new ThrowableObject(this.character.x + 50,
            this.character.y + 100, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        this.bottlePercentage -= 20;
        this.statusBarBottle.setPercentage(this.bottlePercentage);
    }
}
