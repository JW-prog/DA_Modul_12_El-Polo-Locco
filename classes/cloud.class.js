
class Cloud extends MovableObject {
    y = 50;
    width = 500;
    height = 200;
    speed = 0.15;
    


    constructor() {
        super();
        this.loadImage('img\\5_background\\layers\\4_clouds\\1.png');
        this.x = Math.random() * 500;  // Zahl zwischen 0 und 500
        

        this.animate();
    }
     
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

    
}