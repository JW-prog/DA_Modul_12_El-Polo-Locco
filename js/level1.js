let level1;

/**
 * Initializes the first level.
 * @returns {void}
 */
function initLevel1() {
    level1 = new Level(createEnemies(), createClouds(), createBackgrounds(),
        createBottles(), createCoins());
}


/**
 * Creates several clouds spread across the level.
 * @returns {Cloud[]} Clouds.
 */
function createClouds() {
    return [[100, '1.png'], [650, '2.png'], [1200, '1.png'], [1650, '2.png'], [2050, '1.png']]
        .map(([x, file]) => new Cloud(x, `img/5_background/layers/4_clouds/${file}`));
}


/**
 * Creates all level enemies.
 * @returns {MovableObject[]} Enemies.
 */
function createEnemies() {
    const enemies = [];
    [680, 760, 840, 1280, 1360, 1440, 1850, 1930, 2010]
        .forEach((x) => enemies.push(new Chicken(x)));
    [720, 800, 880, 1320, 1400, 1480, 1890, 1970, 2050]
        .forEach((x) => enemies.push(new ChickenSmall(x)));
    enemies.push(new Endboss());
    return enemies;
}


/**
 * Creates all scrolling background layers.
 * @returns {BackgroundObject[]} Backgrounds.
 */
function createBackgrounds() {
    const backgrounds = [];
    for (let section = 0; section < 4; section++) {
        backgrounds.push(...createBackgroundSection(section));
    }
    return backgrounds;
}


/**
 * Creates one background section.
 * @param {number} section - Section index.
 * @returns {BackgroundObject[]} Layers.
 */
function createBackgroundSection(section) {
    const variant = section % 2 + 1;
    const x = 720 * section;
    return [new BackgroundObject('img/5_background/layers/air.png', x, 0),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, x, 50),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, x, 50),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, x, 50)];
}


/**
 * Creates all collectible bottles.
 * @returns {Bottle[]} Bottles.
 */
function createBottles() {
    const positions = [[280, 500], [380, 500], [450, 400], [580, 400], [700, 400],
        [760, 420], [850, 420], [1050, 420], [1120, 420], [1250, 420],
        [1420, 420], [1500, 420], [1650, 420], [1850, 420], [1920, 420], [2050, 420],
        [2140, 420], [2210, 420]];
    return positions.map(([x, y]) => new Bottle(x, y));
}


/**
 * Creates all collectible coins. One coin equals one status-bar step.
 * @returns {Coin[]} Coins.
 */
function createCoins() {
    return [[430, 320], [700, 280], [1080, 330], [1490, 280], [1870, 320]]
        .map(([x, y]) => new Coin(x, y));
}
