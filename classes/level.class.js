
class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    levelEndX = 2200; // Set the level end position to the right edge of the last background object

    constructor(enemies, clouds, backgroundObjects, bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
    }
}
