class WorldEnemyCollision {
    /**
     * Starts recurring collision checks.
     * @returns {void}
     */
    startCollisionChecks() {
        registerGameInterval(() => this.checkCollisions(), 1000 / 60);
    }


    /**
     * Runs one complete collision update.
     * @returns {void}
     */
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


    /**
     * Checks coin and bottle pickups.
     * @returns {void}
     */
    checkCollectibleCollisions() {
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    }


    /**
     * Removes regular chickens that left the level.
     * @returns {void}
     */
    removeEscapedChickens() {
        this.level.enemies = this.level.enemies.filter((enemy) => {
            return enemy instanceof Endboss || enemy.x + enemy.width >= 0;
        });
    }


    /**
     * Detects a won or lost game.
     * @returns {void}
     */
    checkGameResult() {
        if (this.character.isDead() && this.character.deathAnimationFinished) {
            this.finishGame('lost');
        } else if (!this.character.isDead() && this.level.enemies.length === 0) {
            this.finishGame('won');
        }
    }


    /**
     * Finalizes the game once.
     * @param {'won'|'lost'} result - Game result.
     * @returns {void}
     */
    finishGame(result) {
        if (this.gameOver) return;
        this.setGameResult(result);
        audioManager.stop();
        this.playResultSound(result);
        document.getElementById('pauseButton').classList.add('is-hidden');
        document.getElementById('restartButton').classList.remove('is-hidden');
    }


    /**
     * Stores the final game state.
     * @param {'won'|'lost'} result - Game result.
     * @returns {void}
     */
    setGameResult(result) {
        this.gameOver = true;
        this.gameResult = result;
        this.gameResultStartedAt = Date.now();
    }


    /**
     * Plays the matching result sound.
     * @param {'won'|'lost'} result - Game result.
     * @returns {void}
     */
    playResultSound(result) {
        if (result === 'lost') audioManager.playLostSound();
        if (result === 'won') audioManager.playWonSound();
    }


    /**
     * Checks player contact with every enemy.
     * @returns {void}
     */
    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            this.resolveEnemyCollision(this.level.enemies[i]);
        }
    }


    /**
     * Resolves one player-enemy collision.
     * @param {MovableObject} enemy - Enemy.
     * @returns {void}
     */
    resolveEnemyCollision(enemy) {
        const stomping = !(enemy instanceof Endboss) && this.isStomping(enemy);
        if (enemy.isDead() || (!this.isCharacterTouchingEnemy(enemy) && !stomping)) return;
        if (stomping) this.defeatChicken(enemy);
        else this.damageCharacter(enemy);
    }


    /**
     * Checks the visible parts of Pepe and an enemy for contact.
     * @param {MovableObject} enemy - Enemy.
     * @returns {boolean} Collision state.
     */
    isCharacterTouchingEnemy(enemy) {
        const player = { left: this.character.x + 30,
            right: this.character.x + this.character.width - 30,
            top: this.character.y + 50,
            bottom: this.character.y + this.character.height - 15 };
        const target = this.getEnemyContactHitbox(enemy);
        return player.right > target.left && player.left < target.right &&
            player.bottom > target.top && player.top < target.bottom;
    }


    /**
     * Returns a reduced contact hitbox matching the visible enemy body.
     * @param {MovableObject} enemy - Enemy.
     * @returns {Object} Hitbox edges.
     */
    getEnemyContactHitbox(enemy) {
        if (enemy instanceof Endboss) {
            return { left: enemy.x + 55, right: enemy.x + enemy.width - 35,
                top: enemy.y + 60, bottom: enemy.y + enemy.height - 20 };
        }
        return { left: enemy.x + 15, right: enemy.x + enemy.width - 15,
            top: enemy.y + 15, bottom: enemy.y + enemy.height - 5 };
    }


    /**
     * Damages Pepe when his cooldown permits it.
     * @param {MovableObject} enemy - Enemy.
     * @returns {void}
     */
    damageCharacter(enemy) {
        if (!this.character.canTakeDamage()) return;
        this.character.hit(this.getEnemyCollisionDamage(enemy));
        this.updateCharacterStatusBar();
    }


    /**
     * Returns contact damage for an enemy type.
     * @param {MovableObject} enemy - Enemy.
     * @returns {number} Damage.
     */
    getEnemyCollisionDamage(enemy) {
        if (enemy instanceof ChickenSmall) return 3;
        if (enemy instanceof Endboss) return 15;
        return 8;
    }


    /**
     * Updates Pepe's health bar.
     * @returns {void}
     */
    updateCharacterStatusBar() {
        this.statusBar.setPercentage(this.character.energy / this.character.maxEnergy * 100);
    }


    /**
     * Checks whether Pepe lands on an enemy.
     * @param {MovableObject} enemy - Enemy.
     * @returns {boolean} Stomp state.
     */
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


    /**
     * Defeats a stomped chicken.
     * @param {Chicken|ChickenSmall} enemy - Chicken.
     * @returns {void}
     */
    defeatChicken(enemy) {
        enemy.hit(enemy.energy);
        this.playChickenHitSound(enemy);
        this.character.speedY = 18;
        this.removeChickenAfterDeath(enemy);
    }


    /**
     * Plays the matching chicken sound.
     * @param {Chicken|ChickenSmall} enemy - Chicken.
     * @returns {void}
     */
    playChickenHitSound(enemy) {
        if (enemy instanceof ChickenSmall) audioManager.playSmallChickenHitSound();
        else if (enemy instanceof Chicken) audioManager.playNormalChickenHitSound();
    }


    /**
     * Schedules removal of a defeated chicken.
     * @param {MovableObject} enemy - Chicken.
     * @returns {void}
     */
    removeChickenAfterDeath(enemy) {
        setTimeout(() => this.removeEnemy(enemy), 500);
    }


    /**
     * Removes one enemy from the level.
     * @param {MovableObject} enemy - Enemy.
     * @returns {void}
     */
    removeEnemy(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index >= 0) this.level.enemies.splice(index, 1);
    }
}
