
class Level {
    enemies;
    clouds;
    backgroundObjects;
    levelEndX = 2200; // Set the level end position to the right edge of the last background object

    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}