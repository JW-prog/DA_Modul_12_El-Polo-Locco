class WorldRenderer extends WorldCollectibles {
    /**
     * Draws one animation frame.
     * @returns {void}
     */
    draw() {
        if (this.isDisposed) return;
        this.prepareCanvas();
        this.drawWorldObjects();
        this.drawFixedObjects();
        this.drawGameResult();
        if (this.shouldContinueDrawing()) requestAnimationFrame(() => this.draw());
    }


    /**
     * Clears and scales the canvas.
     * @returns {void}
     */
    prepareCanvas() {
        const ratio = this.canvas.pixelRatio || 1;
        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.ctx.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
    }


    /**
     * Draws camera-relative game objects.
     * @returns {void}
     */
    drawWorldObjects() {
        const roundedCameraX = Math.round(this.camera_x);
        this.ctx.translate(roundedCameraX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.enemyProjectiles);
        this.addToMap(this.character);
        this.ctx.translate(-roundedCameraX, 0);
    }


    /**
     * Draws screen-fixed status bars.
     * @returns {void}
     */
    drawFixedObjects() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarEnemy);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
    }


    /**
     * Checks whether frames are still needed.
     * @returns {boolean} Drawing state.
     */
    shouldContinueDrawing() {
        return !this.isDisposed && (!this.gameResult || Date.now() - this.gameResultStartedAt < 2000);
    }


    /**
     * Marks this world as inactive so its drawing loop can end.
     * @returns {void}
     */
    dispose() {
        this.isDisposed = true;
        this.gameOver = true;
    }


    /**
     * Returns logical canvas width.
     * @returns {number} Width.
     */
    getCanvasWidth() {
        return this.canvas.logicalWidth || this.canvas.width;
    }


    /**
     * Returns logical canvas height.
     * @returns {number} Height.
     */
    getCanvasHeight() {
        return this.canvas.logicalHeight || this.canvas.height;
    }


    /**
     * Draws the current result overlay.
     * @returns {void}
     */
    drawGameResult() {
        if (!this.gameResult) return;
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        this.ctx.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
        this.drawCenteredResultImage(this.getCurrentResultImage());
        this.ctx.restore();
    }


    /**
     * Selects the current result image.
     * @returns {HTMLImageElement} Result image.
     */
    getCurrentResultImage() {
        const elapsed = Date.now() - this.gameResultStartedAt;
        return elapsed < 1800 ? this.gameResultImages[this.gameResult] : this.gameResultImages.gameOver;
    }


    /**
     * Draws a centered result image.
     * @param {HTMLImageElement} image - Result image.
     * @returns {void}
     */
    drawCenteredResultImage(image) {
        if (!image || !image.complete || !image.naturalWidth) return;
        const size = this.getResultImageSize(image);
        const x = (this.getCanvasWidth() - size.width) / 2;
        const y = (this.getCanvasHeight() - size.height) / 2;
        this.ctx.drawImage(image, x, y, size.width, size.height);
    }


    /**
     * Calculates scaled result dimensions.
     * @param {HTMLImageElement} image - Result image.
     * @returns {Object} Width and height.
     */
    getResultImageSize(image) {
        const maxFraction = this.usesTouchControls() ? 0.65 : 0.9;
        const scale = Math.min(this.getCanvasWidth() * maxFraction / image.naturalWidth,
            this.getCanvasHeight() * maxFraction / image.naturalHeight);
        return { width: image.naturalWidth * scale, height: image.naturalHeight * scale };
    }

    /**
     * Checks whether the game currently runs with on-screen touch controls.
     * @returns {boolean} Touch-control state.
     */
    usesTouchControls() {
        return window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(max-width: 1024px)').matches;
    }


    /**
     * Draws a list of objects.
     * @param {DrawableObject[]} objects - Objects.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }


    /**
     * Draws one object with its orientation.
     * @param {DrawableObject} object - Object.
     * @returns {void}
     */
    addToMap(object) {
        if (object.otherDirection) this.flipImage(object);
        object.draw(this.ctx);
        object.drawFrame(this.ctx);
        if (object.otherDirection) this.flipImageBack(object);
    }


    /**
     * Mirrors the canvas for an object.
     * @param {DrawableObject} object - Object.
     * @returns {void}
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x *= -1;
    }


    /**
     * Restores the canvas after mirroring.
     * @param {DrawableObject} object - Object.
     * @returns {void}
     */
    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore();
    }
}
