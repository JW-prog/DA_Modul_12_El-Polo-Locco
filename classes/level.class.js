
class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    levelEndX = 2200; // Set the level end position to the right edge of the last background object

    constructor(enemies, clouds, backgroundObjects, bottles = [], coins = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}
