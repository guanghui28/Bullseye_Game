window.addEventListener("load", () => {
    const ctx = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 720;
    ctx.fillStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    ctx.font = "40px Bangers";

    class Player {
        constructor(game) {
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 50;
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 5;
            this.image = bullImg;
            this.spriteWidth = 255;
            this.spriteHeight = 255;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - this.width / 2;
            this.spriteY;
            this.frameX = 0;
            this.frameY = 0;
            // this.spriteY = this.collisionY - this.height / 2;
        }
        restart() {
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.spriteX = this.collisionX - this.width / 2;
            this.spriteY = this.collisionY - this.height / 2 - 100;
        }
        draw(ctx) {
            ctx.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
            if (this.game.debug) {
                ctx.beginPath();
                ctx.arc(
                    this.collisionX,
                    this.collisionY,
                    this.collisionRadius,
                    0,
                    Math.PI * 2
                );
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.restore();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.collisionX, this.collisionY);
                ctx.lineTo(this.game.mouse.x, this.game.mouse.y);
                ctx.stroke();
            }
        }
        update() {
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            // sprite animation
            const angle = Math.atan2(this.dy, this.dx);
            if (angle < -2.74 || angle > 2.74) this.frameY = 6;
            else if (angle < -1.96) this.frameY = 7;
            else if (angle < -1.17) this.frameY = 0;
            else if (angle < -0.39) this.frameY = 1;
            else if (angle < 0.39) this.frameY = 2;
            else if (angle < 1.17) this.frameY = 3;
            else if (angle < 1.96) this.frameY = 4;
            else if (angle < 2.74) this.frameY = 5;

            const distance = Math.hypot(this.dx, this.dy);
            if (distance > this.speedModifier) {
                this.speedX = this.dx / distance || 0;
                this.speedY = this.dy / distance || 0;
            } else {
                this.speedX = 0;
                this.speedY = 0;
            }
            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;

            this.spriteX = this.collisionX - this.width / 2;
            this.spriteY = this.collisionY - this.height / 2 - 100;

            //horizontal boundaries
            if (this.collisionX - this.collisionRadius < 0)
                this.collisionX = this.collisionRadius;
            else if (this.collisionX + this.collisionRadius > this.game.width)
                this.collisionX = this.game.width - this.collisionRadius;

            //vertical boundaries
            if (this.collisionY + this.collisionRadius > this.game.height)
                this.collisionY = this.game.height - this.collisionRadius;
            else if (
                this.collisionY - this.collisionRadius <
                this.game.topMargin
            ) {
                this.collisionY = this.game.topMargin + this.collisionRadius;
            }
            // check collision
            this.game.obstacles.forEach((obs) => {
                // [(dist < sumOfRadius), dist, sumOfRadius, dx, dy];
                const [isCollision, dist, sumOfRadius, dx, dy] =
                    this.game.checkCollision(this, obs);
                if (isCollision) {
                    const unit_x = dx / dist;
                    const unit_y = dy / dist;
                    this.collisionX =
                        obs.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY =
                        obs.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
        }
    }

    class Obstacle {
        constructor(game) {
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 60;
            this.image = obstacleImg;
            this.spriteWidth = 256;
            this.spriteHeight = 256;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 70;
            this.frameX = Math.floor(Math.random() * 4);
            this.frameY = Math.floor(Math.random() * 3);
        }
        draw(ctx) {
            ctx.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
            if (this.game.debug) {
                ctx.beginPath();
                ctx.arc(
                    this.collisionX,
                    this.collisionY,
                    this.collisionRadius,
                    0,
                    Math.PI * 2
                );
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.restore();
                ctx.stroke();
            }
        }
        //ignore function
        update() {}
    }

    class Egg {
        constructor(game) {
            this.game = game;
            this.collisionRadius = 40;
            this.margin = this.collisionRadius * 2;
            this.collisionX =
                this.margin +
                Math.random() * (this.game.width - this.margin * 2);
            this.collisionY =
                this.game.topMargin +
                Math.random() * (this.game.height - this.game.topMargin);
            this.image = eggImg;
            this.spriteWidth = 110;
            this.spriteHeight = 135;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.hatchTimer = 0;
            this.hatchInterval = 5000;
            this.markedForDeletion = false;
        }
        update(deltaTime) {
            // collision
            let collisionObjects = [
                this.game.player,
                ...this.game.obstacles,
                ...this.game.enemies,
            ];
            collisionObjects.forEach((object) => {
                let [collision, dist, sumOfRadius, dx, dy] =
                    this.game.checkCollision(this, object);
                if (collision) {
                    const unit_x = dx / dist;
                    const unit_y = dy / dist;
                    this.collisionX =
                        object.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY =
                        object.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 35;
            // hatching
            if (
                this.hatchTimer > this.hatchInterval ||
                this.collisionY < this.game.topMargin
            ) {
                this.game.hatchling.push(
                    new Larva(this.game, this.collisionX, this.collisionY)
                );
                this.markedForDeletion = true;
                this.game.removeGameObject();
            } else {
                this.hatchTimer += deltaTime;
            }
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.spriteX, this.spriteY);
            if (this.game.debug) {
                ctx.beginPath();
                ctx.arc(
                    this.collisionX,
                    this.collisionY,
                    this.collisionRadius,
                    0,
                    Math.PI * 2
                );
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.restore();
                ctx.stroke();
                ctx.textAlgin = "center";
                const timer = (this.hatchTimer * 0.001).toFixed(0);
                ctx.fillText(
                    timer,
                    this.collisionX,
                    this.collisionY - this.collisionRadius * 2.5
                );
            }
        }
    }

    class Larva {
        constructor(game, x, y) {
            this.game = game;
            this.image = larvaImg;
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.speedY = Math.random() + 1;
            this.collisionX = x;
            this.collisionY = y;
            this.collisionRadius = 30;
            this.spriteX;
            this.spriteY;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 2);
        }
        draw(ctx) {
            ctx.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
            if (this.game.debug) {
                ctx.beginPath();
                ctx.arc(
                    this.collisionX,
                    this.collisionY,
                    this.collisionRadius,
                    0,
                    Math.PI * 2
                );
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.restore();
                ctx.stroke();
            }
        }
        update(deltaTime) {
            this.collisionY -= this.speedY;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 50;
            // move to safety
            if (this.collisionY < this.game.topMargin) {
                this.markedForDeletion = true;
                this.game.removeGameObject();
                if (!this.game.gameOver) this.game.score++;
                for (let i = 0; i < 3; i++) {
                    this.game.particles.push(
                        new FireFly(
                            this.game,
                            this.collisionX,
                            this.collisionY,
                            "yellow"
                        )
                    );
                }
            }
            // collision with objects
            let collisionObjects = [this.game.player, ...this.game.obstacles];
            collisionObjects.forEach((object) => {
                let [collision, dist, sumOfRadius, dx, dy] =
                    this.game.checkCollision(this, object);
                if (collision) {
                    const unit_x = dx / dist;
                    const unit_y = dy / dist;
                    this.collisionX =
                        object.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY =
                        object.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
            // collision with enemies
            this.game.enemies.forEach((enemy) => {
                if (this.game.checkCollision(this, enemy)[0]) {
                    this.markedForDeletion = true;
                    this.game.removeGameObject();
                    if (!this.game.gameOver) this.game.lostHatchling++;
                    for (let i = 0; i < 3; i++) {
                        this.game.particles.push(
                            new Spark(
                                this.game,
                                this.collisionX,
                                this.collisionY,
                                "blue"
                            )
                        );
                    }
                }
            });
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.collisionRadius = 30;
            this.image = toadsImg;
            this.spriteWidth = 140;
            this.spriteHeight = 260;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.collisionX =
                this.game.width +
                this.width +
                Math.random() * this.game.width * 0.5;
            this.collisionY =
                this.game.topMargin +
                Math.random() * (this.game.height - this.game.topMargin);
            this.spriteX;
            this.spriteY;
            this.speedX = Math.random() * 3 + 0.5;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 4);
        }
        update() {
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height + 40;
            this.collisionX -= this.speedX;
            if (this.spriteX + this.width < 0 && !this.game.gameOver) {
                this.collisionX =
                    this.game.width +
                    this.width +
                    Math.random() * this.game.width * 0.5;
                this.collisionY =
                    this.game.topMargin +
                    Math.random() * (this.game.height - this.game.topMargin);
            }
            let collisionObjects = [
                this.game.player,
                ...this.game.obstacles,
                ...this.game.eggs,
            ];
            collisionObjects.forEach((object) => {
                let [collision, dist, sumOfRadius, dx, dy] =
                    this.game.checkCollision(this, object);
                if (collision) {
                    const unit_x = dx / dist;
                    const unit_y = dy / dist;
                    this.collisionX =
                        object.collisionX + (sumOfRadius + 1) * unit_x;
                    this.collisionY =
                        object.collisionY + (sumOfRadius + 1) * unit_y;
                }
            });
        }
        draw(ctx) {
            ctx.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
            if (this.game.debug) {
                ctx.beginPath();
                ctx.arc(
                    this.collisionX,
                    this.collisionY,
                    this.collisionRadius,
                    0,
                    Math.PI * 2
                );
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.restore();
                ctx.stroke();
            }
        }
    }

    class Particle {
        constructor(game, x, y, color) {
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.color = color;
            this.radius = Math.floor(Math.random() * 10 + 5);
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 2 + 0.5;
            this.angle = 0;
            this.va = Math.random() * 0.1 + 0.01;
            this.markedForDeletion = false;
        }
        draw(ctx) {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(
                this.collisionX,
                this.collisionY,
                this.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

    class FireFly extends Particle {
        update() {
            this.angle += this.va;
            this.collisionX += Math.sin(this.angle) * this.speedX;
            this.collisionY -= this.speedY;
            if (this.collisionY < 0 - this.radius) {
                this.markedForDeletion = true;
                this.game.removeGameObject();
            }
        }
    }

    class Spark extends Particle {
        update() {
            this.angle += this.va * 0.5;
            this.collisionX -= Math.cos(this.angle) * this.speedX;
            this.collisionY -= Math.sin(this.angle) * this.speedY;
            if (this.radius > 0.1) this.radius -= 0.05;
            if (this.radius < 0.2) {
                this.markedForDeletion = true;
                this.game.removeGameObject();
            }
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchling = [];
            this.gameObjects = [];
            this.particles = [];
            this.numberOfObstacles = 10;
            this.topMargin = 260;
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false,
            };
            this.debug = false;
            this.fps = 70;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.maxEggs = 10;
            this.eggTimer = 0;
            this.eggInterval = 500;
            this.score = 0;
            this.lostHatchling = 0;
            this.winningScore = 30;
            this.gameOver = false;
            this.init();

            //events
            canvas.addEventListener("mousedown", (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            canvas.addEventListener("mouseup", (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener("mousemove", (e) => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });
            window.addEventListener("keydown", (e) => {
                if (e.key === "d") this.debug = !this.debug;
                else if (e.key === "r") this.restart();
            });
        }
        restart() {
            this.player.restart();
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchling = [];
            this.gameObjects = [];
            this.particles = [];
            this.score = 0;
            this.lostHatchling = 0;
            this.gameOver = false;
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false,
            };
            this.init();
        }
        render(ctx, deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                ctx.clearRect(0, 0, this.width, this.height);
                // sort by collisionY (asc)
                this.gameObjects = [
                    ...this.eggs,
                    ...this.obstacles,
                    ...this.enemies,
                    ...this.hatchling,
                    ...this.particles,
                    this.player,
                ].sort((a, b) => a.collisionY - b.collisionY);
                this.gameObjects.forEach((obj) => {
                    obj.draw(ctx);
                    obj.update(deltaTime);
                });

                this.frameTimer = 0;
            }
            this.frameTimer += deltaTime;
            // add eggs periodically
            if (
                this.eggTimer > this.eggInterval &&
                this.eggs.length < this.maxEggs &&
                !this.gameOver
            ) {
                this.addEggs();
                this.eggTimer = 0;
            } else {
                this.eggTimer += deltaTime;
            }
            //draw status text
            ctx.save();
            ctx.textAlign = "left";
            ctx.fillText(`Score: ${this.score}`, 25, 50);
            if (this.debug) {
                ctx.fillText(`Lost score: ${this.lostHatchling}`, 25, 80);
            }
            ctx.restore();

            // check win/lose
            if (this.score >= this.winningScore) {
                this.gameOver = true;
                ctx.save();
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.shadowOffsetX = 4;
                ctx.shadowOffsetY = 4;
                ctx.shadowColor = "black";
                let message1;
                let message2;
                if (this.lostHatchling <= 5) {
                    message1 = "Bullseye!!!";
                    message2 = "You bullied the bullies!";
                } else {
                    message1 = "Bullocks!!!";
                    message2 = `You lost ${this.lostHatchling} hatchlings, don't be a pushover!`;
                }
                ctx.font = "130px Bangers";
                ctx.fillText(
                    message1,
                    this.width * 0.5,
                    this.height * 0.5 - 20
                );
                ctx.font = "40px Bangers";
                ctx.fillText(
                    message2,
                    this.width * 0.5,
                    this.height * 0.5 + 30
                );
                ctx.fillText(
                    `Final score: ${this.score}. Press "R" to butt heads again!`,
                    this.width * 0.5,
                    this.height * 0.5 + 80
                );
                ctx.restore();
            }
        }
        addEggs() {
            this.eggs.push(new Egg(this));
        }
        addEnemy() {
            this.enemies.push(new Enemy(this));
            console.log(this.enemies);
        }
        init() {
            // create enemies
            for (let i = 0; i < 5; i++) {
                this.addEnemy();
            }
            // create non-overlap obstacles
            let attempts = 0;
            while (
                attempts < 500 &&
                this.obstacles.length < this.numberOfObstacles
            ) {
                let overlap = false;
                let testObstacle = new Obstacle(this);
                const minGap = 100;
                this.obstacles.forEach((obs) => {
                    const dx = obs.collisionX - testObstacle.collisionX;
                    const dy = obs.collisionY - testObstacle.collisionY;
                    const dist = Math.hypot(dx, dy);
                    const sumOfRadius =
                        obs.collisionRadius +
                        testObstacle.collisionRadius +
                        minGap;
                    //overlap
                    if (dist < sumOfRadius) {
                        overlap = true;
                    }
                });
                const margin = testObstacle.collisionRadius * 3;
                if (
                    !overlap &&
                    testObstacle.spriteX > 0 &&
                    testObstacle.spriteX < this.width - testObstacle.width &&
                    testObstacle.collisionY > this.topMargin + margin &&
                    testObstacle.collisionY < this.height - margin
                ) {
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
        checkCollision(a, b) {
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const dist = Math.hypot(dx, dy);
            const sumOfRadius = a.collisionRadius + b.collisionRadius;
            return [dist < sumOfRadius, dist, sumOfRadius, dx, dy];
        }
        removeGameObject() {
            this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion);
            this.hatchling = this.hatchling.filter(
                (larva) => !larva.markedForDeletion
            );
            this.particles = this.particles.filter(
                (particle) => !particle.markedForDeletion
            );
        }
    }

    const game = new Game(canvas);
    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
});
