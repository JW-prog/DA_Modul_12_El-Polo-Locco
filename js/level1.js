
    let level1;
    function initLevel1() {
        level1 = new Level([
        new Chicken(),
        new Chicken(),
        new Chicken(),
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
        new Bottle(280, 360),
        new Bottle(380, 360),
        new Bottle(450, 360),
        new Bottle(580, 360),
        new Bottle(700, 360),
        new Bottle(760, 360),
        new Bottle(850, 360),
        new Bottle(1050, 360),
        new Bottle(1120, 360),
        new Bottle(1250, 360),
        new Bottle(1420, 360),
        new Bottle(1500, 360),
        new Bottle(1650, 360),
        new Bottle(1850, 360),
        new Bottle(1920, 360),
        new Bottle(2050, 360)
    ]
);
}
