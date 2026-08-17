class Level {
    levelEndX = 2200;

    /**
     * Creates a level.
     * @param {MovableObject[]} enemies - Enemies.
     * @param {Cloud[]} clouds - Clouds.
     * @param {BackgroundObject[]} backgrounds - Backgrounds.
     * @param {Bottle[]} bottles - Bottles.
     * @param {Coin[]} coins - Coins.
     */
    constructor(enemies, clouds, backgrounds, bottles = [], coins = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgrounds;
        this.bottles = bottles;
        this.coins = coins;
    }
}
