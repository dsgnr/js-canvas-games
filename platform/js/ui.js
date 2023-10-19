export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = "Helvetica";
        this.livesImage = lives;
    }

    draw(context) {
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.textAlign = "left";
        context.fillStyle = this.game.fontColor;

        // Lives
        for (let i = 0; i < this.game.lives; i++) {
            context.save();
            context.drawImage(this.livesImage, 35 * i + 20, 95, 25, 25);
            context.fillStyle = "red";
            context.restore();
        }

        // Score
        context.fillText(`Score: ${this.game.score}`, 20, 50);

        // Timer
        context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
        context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);
        if (this.game.gameOver) {
            context.textAlign = "center";
            context.textBaseline = "bottom";
            context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
            context.fillText(
                this.game.score > this.game.winningScore ? "Nice!" : "Uh Oh!",
                canvas.width / 2,
                canvas.height / 2
            );
        }
    }
}
