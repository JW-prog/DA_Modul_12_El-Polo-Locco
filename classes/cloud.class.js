class Cloud extends MovableObject {
    y = 50;
    width = 500;
    height = 200;
    speed = 0.15;

    /** Creates and animates a cloud. */
    constructor() {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }


    /** Starts the cloud movement loop. @returns {void} */
    animate() {
        setInterval(() => this.moveLeft(), 1000 / 60);
    }
}
