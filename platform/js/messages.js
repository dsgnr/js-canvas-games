export class Message {
    constructor(value, x, y, targetX, targetY) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markedforDelete = false;
        this.timer = 0;
    }

    update() {
        this.x += (this.targetX - this.x) * 0.03;
        this.y += (this.targetY - this.y) * 0.03;
        this.timer++;
        if (this.timer > 100) {
            this.markedforDelete = true;
        }
    }
    draw(context) {
        context.font = "20px";
        context.fillStyle = "white";
        context.fillText(this.value, this.x, this.y);
    }
}
