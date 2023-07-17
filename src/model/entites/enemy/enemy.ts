import { Entity } from "../../engine/entity.js";
import { Rect, Vec2 } from "../../engine/geometry.js";
import { Game } from "../../game/game.js";
import { Player } from "../player/player.js";

export class Enemy extends Entity {

    pos: Vec2;
    dim: Vec2
    attack: number;
    life: number;
    defence: number;
    magic: number;
    inteligence: number;
    direction: string;
    status: string;
    sprite: ImageBitmap;
    walkDistance: number;
    damageCooldownTimer: number;
    knockbackTimer: number;
    knockbackDir: string;

    constructor(sprite: ImageBitmap, pos: Vec2, life: number, attack: number, defence: number, magic: number, inteligence: number) {
        super();
        this.pos = pos;
        this.dim = new Vec2(1, 1);

        this.sprite = sprite;
        this.direction = "down";
        this.status = "idle";
        this.walkDistance = 0;
        this.damageCooldownTimer = 0;
        this.knockbackTimer = 0;
        this.knockbackDir = "";

        //status
        this.life = life;
        this.attack = attack;
        this.defence = defence;
        this.magic = magic;
        this.inteligence = inteligence;

    }


    create(): void {

    }

    update(game: Game): void {

        if (game.player.status == "attack") {
            var area = new Rect(this.pos, this.dim);

            if (this.damageCooldownTimer <= 0) {
                if (area.checkIntersect(game.player.attackArea)) {


                    this.life -= this.calcAttackDamage(game.player);
                    this.damageCooldownTimer = 10;

                    if (this.life > 0) {
                        this.status = "knockback";
                        this.knockbackTimer = 20;
                        this.knockbackDir = game.player.direction;
                    }
                    else {
                        this.status = "dead";
                        game.player.getExperience(this);
                    }

                    console.clear();
                    console.log("Hit");
                    console.log("Enemy HP: " + this.life);
                }
            }
            else {
                this.damageCooldownTimer--;
            }
        }

        if (this.status == "knockback") {
            this.knockbackTimer--;

            if (this.knockbackTimer == 0) {
                this.status = "idle";
            } else if (this.knockbackDir == "right") {
                this.direction = "left";

                if (!game.map.checkColision(this.pos.x + 1, this.pos.y)) {
                    this.pos.x += 0.1;
                }
            }
            else if (this.knockbackDir == "left") {
                this.direction = "right";

                if (!game.map.checkColision(this.pos.x - 1, this.pos.y)) {
                    this.pos.x -= 0.1;
                }
            }
            else if (this.knockbackDir == "down") {
                this.direction = "up";

                if (!game.map.checkColision(this.pos.x, this.pos.y + 1)) {
                    this.pos.y += 0.1;
                }
            }
            else {
                this.direction = "down";

                if (!game.map.checkColision(this.pos.x, this.pos.y - 1)) {
                    this.pos.y -= 0.1;
                }
            }
        }

        if (this.status == 'idle') {

            if (Math.random() < 0.2) {
                this.status = "walking";

                var dirPercent = Math.random();

                if (dirPercent < 0.25) {
                    this.direction = "up";
                }
                else if (dirPercent < 0.5) {
                    this.direction = "down";
                }
                else if (dirPercent < 0.75) {
                    this.direction = "left";
                }
                else if (dirPercent < 1) {
                    this.direction = "right";
                }

                this.walkDistance = Math.floor(Math.random() * 4);
            }
        }

        if (this.status == "walking") {

            if (this.walkDistance <= 0) {
                this.status = "idle";
            }
            if (this.direction == "right" && this.walkDistance > 0) {

                if (!game.map.checkColision(this.pos.x + 1, this.pos.y)) {
                    this.pos.x += 0.02;
                }
            }
            else if (this.direction == "left" && this.walkDistance > 0) {
                if (!game.map.checkColision(this.pos.x - 0.1, this.pos.y)) {
                    this.pos.x -= 0.02;
                }
            }
            else if (this.direction == "down" && this.walkDistance > 0) {
                if (!game.map.checkColision(this.pos.x, this.pos.y + 1)) {
                    this.pos.y += 0.02;
                }
            }
            else if (this.direction == "up" && this.walkDistance > 0) {
                if (!game.map.checkColision(this.pos.x, this.pos.y - 0.1)) {
                    this.pos.y -= 0.02;
                }
            }
            this.walkDistance -= 0.02;
        }

    }
    render(game: Game): void {

        var x: number;

        if (this.direction == "down") {
            x = 0;
        }
        else if (this.direction == "up") {
            x = 1;
        }
        else if (this.direction == "right") {
            x = 2;
        }
        else {
            x = 3;
        }

        var offset = new Vec2(game.map.camera.x * 32, game.map.camera.y * 18);
        game.draw.drawImage(
            this.sprite,
            new Vec2(
                ((this.pos.x - offset.x) * game.tilesize) + game.globalPos.x,
                ((this.pos.y - offset.y) * game.tilesize) + game.globalPos.y
            ),
            new Vec2(game.tilesize, game.tilesize),
            new Vec2(x * 16, 0),
            new Vec2(16, 16)
        );
    }

    calcAttackDamage(player: Player) {

        if (Math.random() > 0.05) {
            console.log("Critical hit!")
            return (player.attack * 2) - this.defence;
        }
        return player.attack < this.defence ? 1 : player.attack - this.defence;
    }

}