let level1;

/** Creates coins arranged as an arc. @param {number} startX - First X position. @param {number} baseY - Baseline. @param {number} count - Coin count. @param {number} spacing - Horizontal spacing. @param {number} arcHeight - Arc height. @returns {Coin[]} Coins. */
function createCoinArc(startX, baseY, count = 5, spacing = 60, arcHeight = 130) {
    return Array.from({ length: count }, (_, index) => {
        const progress = index / (count - 1);
        const y = baseY - 4 * arcHeight * progress * (1 - progress);
        return new Coin(startX + index * spacing, y);
    });
}


/** Initializes the first level. @returns {void} */
function initLevel1() {
    level1 = new Level(createEnemies(), [new Cloud()], createBackgrounds(),
        createBottles(), createCoins());
}


/** Creates all level enemies. @returns {MovableObject[]} Enemies. */
function createEnemies() {
    const enemies = [];
    [680, 760, 840, 1280, 1360, 1440, 1850, 1930, 2010]
        .forEach((x) => enemies.push(new Chicken(x)));
    [720, 800, 880, 1320, 1400, 1480, 1890, 1970, 2050]
        .forEach((x) => enemies.push(new ChickenSmall(x)));
    enemies.push(new Endboss());
    return enemies;
}


/** Creates all scrolling background layers. @returns {BackgroundObject[]} Backgrounds. */
function createBackgrounds() {
    const backgrounds = [];
    for (let section = 0; section < 4; section++) {
        backgrounds.push(...createBackgroundSection(section));
    }
    return backgrounds;
}


/** Creates one background section. @param {number} section - Section index. @returns {BackgroundObject[]} Layers. */
function createBackgroundSection(section) {
    const variant = section % 2 + 1;
    const x = 719 * section;
    return [new BackgroundObject('img/5_background/layers/air.png', x, 0),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, x, 50),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, x, 50),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, x, 50)];
}


/** Creates all collectible bottles. @returns {Bottle[]} Bottles. */
function createBottles() {
    const positions = [[280, 500], [380, 500], [450, 400], [580, 400], [700, 400],
        [760, 420], [850, 420], [1050, 420], [1120, 420], [1250, 420],
        [1420, 420], [1500, 420], [1650, 420], [1850, 420], [1920, 420], [2050, 420]];
    return positions.map(([x, y]) => new Bottle(x, y));
}


/** Creates all collectible coin arcs. @returns {Coin[]} Coins. */
function createCoins() {
    return [...createCoinArc(400, 330, 5, 60, 130),
        ...createCoinArc(650, 310, 5, 60, 110),
        ...createCoinArc(1060, 340, 5, 60, 150),
        ...createCoinArc(1470, 310, 5, 60, 110),
        ...createCoinArc(1850, 340, 5, 60, 140)];
}
