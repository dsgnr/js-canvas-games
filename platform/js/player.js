import {
    Idle,
    Running,
    Jumping,
    Falling,
    Sliding,
    Diving,
    Hit,
    Dying,
    Sitting,
    states,
} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { Message } from "./messages.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.image = player;
        this.width = 150;
        this.height = 131;

        // position
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;

        // bg speed
        this.speed = 0;
        this.maxSpeed = 10;

        // sprite animation frames
        this.maxFrame;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteFps = 20;
        this.frameInterval = 1000 / this.spriteFps;
        this.frameTimer = 0;

        // state management
        this.currentState = null;
        this.states = [
            new Idle(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Sliding(this.game),
            new Diving(this.game),
            new Hit(this.game),
            new Dying(this.game),
            new Sitting(this.game),
        ];
    }

    update(input, deltaTime) {
        this.checkCollisions();
        this.currentState.handleInput(input);

        // horizontal
        this.x += this.speed;
        let valid_state = ![this.states[6], this.states[7]].includes(this.currentState);
        if (input.includes("ArrowRight") && valid_state) {
            this.speed = this.maxSpeed;
        } else if (input.includes("ArrowLeft") && valid_state) {
            this.speed = -this.maxSpeed;
        } else {
            this.speed = 0;
        }
        // Stop at edges
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }

        // vertical
        this.y += this.vy;

        if (this.onGround()) {
            this.vy = 0;
        } else {
            this.vy += this.weight;
        }

        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }

        // Animate sprite
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                if (!this.game.gameOver) {
                    this.frameX = 0;
                }
            }
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollisions() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y &&
                !this.game.gameOver
            ) {
                enemy.markedforDelete = true;
                this.game.collisions.unshift(
                    new CollisionAnimation(
                        this.game,
                        this.x + enemy.width * 0.5,
                        this.y + enemy.height * 0.5
                    )
                );
                if (["SLIDING", "DIVING"].includes(this.currentState.state)) {
                    this.game.score++;
                    this.game.messages.push(new Message("+1", enemy.x, enemy.y, 110, 50));
                } else {
                    this.setState(6, 0);
                    this.game.score -= 5;
                    this.game.lives--;
                    if (this.game.lives <= 0) {
                        this.game.gameOver = true;
                        this.setState(states.DYING, 0);
                    }
                }
            }
        });
    }
}
