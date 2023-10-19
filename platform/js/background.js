class Layer {
    constructor(game, width, height, speed, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }

    update() {
        if (this.x < -this.width) {
            this.x = 0;
        } else {
            this.x -= this.game.speed * this.speed;
        }
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game) {
        this.game = game;
        this.width = 1667;
        this.height = 500;

        this.ground = new Layer(this.game, this.width, this.height, 1, ground);
        this.bg1 = new Layer(this.game, this.width, this.height, 0, bg1);
        this.bg2 = new Layer(this.game, this.width, this.height, 0.2, bg2);
        this.bg3 = new Layer(this.game, this.width, this.height, 0.4, bg3);
        this.bg4 = new Layer(this.game, this.width, this.height, 0.5, bg4);
        this.bg5 = new Layer(this.game, this.width, this.height, 0.3, bg5);
        this.bg6 = new Layer(this.game, this.width, this.height, 0.4, bg6);
        this.bg7 = new Layer(this.game, this.width, this.height, 0.5, bg7);
        this.bg8 = new Layer(this.game, this.width, this.height, 0.5, bg8);
        this.bg9 = new Layer(this.game, this.width, this.height, 0.6, bg9);
        this.backgroundLayers = [
            this.bg1,
            this.bg2,
            this.bg3,
            this.bg4,
            this.bg5,
            this.bg6,
            this.bg7,
            this.bg8,
            this.bg9,
            this.ground,
        ];
    }

    update() {
        this.backgroundLayers.forEach(layer => {
            layer.update();
        });
    }

    draw(context) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        });
    }
}
