
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 300;
    width = 100;
    height = 100;
    isVisible = true;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

     draw(ctx) {
        if (this.isVisible) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx) {}



    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
