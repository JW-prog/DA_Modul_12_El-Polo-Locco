
    let level1;
    function initLevel1() {
        level1 = new Level([
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss(),
        new ChickenSmall(),
        new ChickenSmall(),
        new ChickenSmall(),

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
        new Coin(250, 320),
        new Coin(450, 250),
        new Coin(650, 180),
        new Coin(850, 250),
        new Coin(1050, 320),
        new Coin(1250, 230),
        new Coin(1450, 150),
        new Coin(1650, 230),
        new Coin(2050, 320),
        new Coin(2100, 220)
    ]
);
}
