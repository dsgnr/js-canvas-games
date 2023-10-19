import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./ui.js";
import {
    Idle,
    Running,
    Jumping,
    Falling,
    Sliding,
    Diving,
    Hit,
    Dying,
    states,
} from "./playerStates.js";

window.addEventListener("load", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 600;

    class Game {
        constructor(width, height) {
            this.debug = false;
            this.gameOver = false;
            this.time = 0;
            this.maxTime = 60000;
            this.score = 0;
            this.winningScore = 50;
            this.lives = 3;
            this.fontColor = "black";
            this.width = width;
            this.height = height;
            this.groundMargin = 160;
            this.speed = 0;
            this.maxSpeed = 4;
            this.maxParticles = 100;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.particles = [];
            this.enemies = [];
            this.collisions = [];
            this.messages = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime) {
            // If we've reached game over, stop the clock!
            if (!this.gameOver) {
                this.time += deltaTime;
            }

            // If we've reached max time, it's game over
            if (this.time > this.maxTime) {
                this.gameOver = true;
            }

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // Handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });

            this.messages.forEach(message => {
                message.update(deltaTime);
            });

            // Handle particles
            this.particles.forEach(particle => {
                particle.update();
            });

            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            // Handle collision sprites
            this.collisions.forEach(collision => {
                collision.update(deltaTime);
            });

            // Prune
            this.enemies = this.enemies.filter(enemy => !enemy.markedforDelete);
            this.collisions = this.collisions.filter(collision => !collision.markedforDelete);
            this.particles = this.particles.filter(particle => !particle.markedforDelete);
            this.messages = this.messages.filter(message => !message.markedforDelete);
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            // Handle particles
            this.particles.forEach(particle => {
                particle.draw(context);
            });

            // Handle collisions
            this.collisions.forEach(collision => {
                collision.draw(context);
            });

            // Handle messages
            this.messages.forEach(message => {
                message.draw(context);
            });

            this.UI.draw(context);
        }

        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            } else if (this.speed > 0) {
                this.enemies.push(new ClimbingEnemy(this));
            }
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);

    // Sprite animation fps
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) {
            requestAnimationFrame(animate);
        } else {
            // Wait till the player has died before freezing
            if (game.gameOver && game.player.frameX <= game.player.maxFrame) {
                requestAnimationFrame(animate);
            }
        }
    }

    animate(0);
});
