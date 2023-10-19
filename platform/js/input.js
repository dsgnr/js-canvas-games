export class InputHandler {
    constructor(game) {
        this.game = game;
        this.allowed_keys = ["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", " "];
        this.keys = [];
        window.addEventListener("keydown", e => {
            if (this.allowed_keys.includes(e.key) && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } else if (e.key === "d") {
                this.game.debug = !this.game.debug;
            }
        });

        window.addEventListener("keyup", e => {
            if (this.allowed_keys.includes(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}
