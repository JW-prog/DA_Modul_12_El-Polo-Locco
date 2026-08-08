
    let level1;

    function createCoinArc(startX, baseY, count = 5, spacing = 60, arcHeight = 130) {
        let coins = [];

        for (let i = 0; i < count; i++) {
            let progress = i / (count - 1);
            let y = baseY - 4 * arcHeight * progress * (1 - progress);
            coins.push(new Coin(startX + i * spacing, y));
        }

        return coins;
    }

    function initLevel1() {
        level1 = new Level([
        new Chicken(680),
        new Chicken(760),
        new Chicken(840),
        new ChickenSmall(720),
        new ChickenSmall(800),
        new ChickenSmall(880),
        new Chicken(1280),
        new Chicken(1360),
        new Chicken(1440),
        new ChickenSmall(1320),
        new ChickenSmall(1400),
        new ChickenSmall(1480),
        new Chicken(1850),
        new Chicken(1930),
        new Chicken(2010),
        new ChickenSmall(1890),
        new ChickenSmall(1970),
        new ChickenSmall(2050),
        new Endboss(),

    ],
    [
        new Cloud(),
    ],
    [
        new BackgroundObject('img\\5_background\\layers\\air.png',0,0),
        new BackgroundObject('img\\5_background\\layers\\3_third_layer\\1.png',0,50),
        new BackgroundObject('img\\5_background\\layers\\2_second_layer\\1.png',0,50),
        new BackgroundObject('img\\5_background\\layers\\1_first_layer\\1.png',0,50),
        new BackgroundObject('img\\5_background\\layers\\air.png',719,0),
        new BackgroundObject('img\\5_background\\layers\\3_third_layer\\2.png',719,50),
        new BackgroundObject('img\\5_background\\layers\\2_second_layer\\2.png',719,50),
        new BackgroundObject('img\\5_background\\layers\\1_first_layer\\2.png',719,50),
        new BackgroundObject('img\\5_background\\layers\\air.png',719*2,0),
        new BackgroundObject('img\\5_background\\layers\\3_third_layer\\1.png',719*2,50),
        new BackgroundObject('img\\5_background\\layers\\2_second_layer\\1.png',719*2,50),
        new BackgroundObject('img\\5_background\\layers\\1_first_layer\\1.png',719*2,50),
        new BackgroundObject('img\\5_background\\layers\\air.png',719*3,0),
        new BackgroundObject('img\\5_background\\layers\\3_third_layer\\2.png',719*3,50),
        new BackgroundObject('img\\5_background\\layers\\2_second_layer\\2.png',719*3,50),
        new BackgroundObject('img\\5_background\\layers\\1_first_layer\\2.png',719*3,50),
    ],
    [
        new Bottle(280, 500),
        new Bottle(380, 500),
        new Bottle(450, 400),
        new Bottle(580, 400),
        new Bottle(700, 400),
        new Bottle(760, 420),
        new Bottle(850, 420),
        new Bottle(1050, 420),
        new Bottle(1120, 420),
        new Bottle(1250, 420),
        new Bottle(1420, 420),
        new Bottle(1500, 420),
        new Bottle(1650, 420),
        new Bottle(1850, 420),
        new Bottle(1920, 420),
        new Bottle(2050, 420)
    ],
    [
        ...createCoinArc(240, 330, 5, 60, 130),
        ...createCoinArc(650, 310, 5, 60, 110),
        ...createCoinArc(1060, 340, 5, 60, 150),
        ...createCoinArc(1470, 310, 5, 60, 110),
        ...createCoinArc(1850, 340, 5, 60, 140)
    ]
);
}
