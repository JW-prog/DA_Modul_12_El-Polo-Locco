class Egg extends MovableObject {
    width = 34;
    height = 42;
    hasHit = false;
    horizontalSpeed = 0;
    movementInterval;
    groundY = 400;

    /**
     * Creates an egg thrown by the endboss toward Pepe.
     * @param {number} x - Start X position.
     * @param {number} y - Start Y position.
     * @param {number} targetX - Pepe's X position at throw time.
     */
    constructor(x, y, targetX) {
        super();
        this.x = x;
        this.y = y;
        this.speedY = 16;
        this.horizontalSpeed = this.calculateHorizontalSpeed(x, y, targetX);
        this.applyGravity();
        this.movementInterval = registerGameInterval(() => this.moveEgg(), 1000 / 40);
    }

    /**
     * Computes the horizontal speed needed to land precisely on the target X.
     * @param {number} startX - Start X position.
     * @param {number} startY - Start Y position.
     * @param {number} targetX - Pepe's X position at throw time.
     * @returns {number} Horizontal speed per movement tick.
     */
    calculateHorizontalSpeed(startX, startY, targetX) {
        const flightSeconds = this.simulateFlightSeconds(startY);
        if (flightSeconds <= 0) return 0;
        return (targetX - startX) / flightSeconds / 40;
    }

    /**
     * Simulates the gravity fall to find how long the egg stays airborne.
     * @param {number} startY - Start Y position.
     * @returns {number} Flight duration in seconds.
     */
    simulateFlightSeconds(startY) {
        let y = startY;
        let speedY = this.speedY;
        let ticks = 0;
        while (y + this.height < this.groundY && ticks < 400) {
            y -= speedY / 2;
            speedY -= this.acceleration / 2;
            ticks++;
        }
        return ticks / 60;
    }

    /**
     * Moves the egg horizontally toward its calculated landing point.
     * @returns {void}
     */
    moveEgg() {
        if (isGamePaused() || this.hasHit) return;
        this.x += this.horizontalSpeed;
    }

    /**
     * Keeps the egg falling until it is explicitly removed.
     * @returns {boolean} Always true.
     */
    isAboveGround() {
        return true;
    }

    /**
     * Stops movement once the egg hits Pepe or the ground.
     * @returns {void}
     */
    stopFlight() {
        this.hasHit = true;
        clearInterval(this.movementInterval);
    }

    /**
     * Draws a simple egg shape since no sprite asset exists for it.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#f6ecd9';
        ctx.strokeStyle = '#c9a24a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2,
            this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
