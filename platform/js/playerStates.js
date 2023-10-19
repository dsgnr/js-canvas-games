import { Dust, Fire, Splash } from "./particles.js";

export const states = {
    IDLE: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    SLIDING: 4,
    DIVING: 5,
    HIT: 6,
    DYING: 7,
    SITTING: 8,
};

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Idle extends State {
    constructor(game) {
        super("IDLE", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 9;
        this.game.player.frameY = 0;
    }
    handleInput(input) {
        if (input.includes(" ")) {
            this.game.player.setState(states.SLIDING, 2);
        }
        if (input.includes("ArrowDown") && this.game.player.onGround()) {
            this.game.player.setState(states.SITTING, 0);
        }
        if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
            this.game.player.setState(states.RUNNING, 1);
        }
    }
}

export class Running extends State {
    constructor(game) {
        super("RUNNING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 5;
    }
    handleInput(input) {
        this.game.particles.unshift(
            new Dust(
                this.game,
                this.game.player.x + this.game.player.width * 0.5,
                this.game.player.y + this.game.player.height
            )
        );
        if (input.includes("ArrowDown")) {
            this.game.player.setState(states.IDLE, 0);
        } else if (input.includes(" ")) {
            this.game.player.setState(states.SLIDING, 2);
        }
        if (input.includes("ArrowUp")) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.includes(" ")) {
            this.game.player.setState(states.SLIDING, 2);
        }
    }
}

export class Jumping extends State {
    constructor(game) {
        super("JUMPING", game);
    }
    enter() {
        this.game.player.frameX = 0;

        if (this.game.player.onGround()) {
            this.game.player.vy -= 20;
        }
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 6;
    }
    handleInput(input) {
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes(" ")) {
            this.game.player.setState(states.SLIDING, 2);
        } else if (input.includes("ArrowDown")) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super("FALLING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 7;
    }
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes("ArrowDown")) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Sitting extends State {
    constructor(game) {
        super("SITTING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 9;
        this.game.player.frameY = 2;
    }
    handleInput(input) {
        if (
            (input.includes("ArrowLeft") || input.includes("ArrowRight")) &&
            this.game.player.onGround()
        ) {
            this.game.player.setState(states.RUNNING, 1);
        }
    }
}

export class Sliding extends State {
    constructor(game) {
        super("SLIDING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 9;
        this.game.player.frameY = 2;
    }
    handleInput(input) {
        this.game.particles.unshift(
            new Fire(
                this.game,
                this.game.player.x + this.game.player.width * 0.5,
                this.game.player.y + this.game.player.height - 20
            )
        );
        if (!input.includes(" ") && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (!input.includes(" ") && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        } else if (
            input.includes(" ") &&
            input.includes("ArrowUp") &&
            this.game.player.onGround()
        ) {
            this.game.player.vy -= 27;
        } else if (input.includes("ArrowDown") && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super("DIVING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 7;
        this.game.player.vy = 15;
    }
    handleInput(input) {
        this.game.particles.unshift(
            new Fire(
                this.game,
                this.game.player.x + this.game.player.width * 0.5,
                this.game.player.y + this.game.player.height * 0.5
            )
        );
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(
                    new Splash(
                        this.game,
                        this.game.player.x + this.game.player.width * 0.5,
                        this.game.player.y + this.game.player.height
                    )
                );
            }
        } else if (!input.includes("ArrowDown") && !this.game.player.onGround()) {
            this.game.player.setState(states.SLIDING, 2);
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super("HIT", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 9;
        this.game.player.frameY = 3;
    }
    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (
            this.game.player.frameX >= this.game.player.maxFrame &&
            !this.game.player.onGround()
        ) {
            this.game.player.setState(states.FALLING, 2);
        }
    }
}

export class Dying extends State {
    constructor(game) {
        super("DYING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 9;
        this.game.player.frameY = 4;
    }

    handleInput(input) {
        // The player is dead, and it's game over.
    }
}
