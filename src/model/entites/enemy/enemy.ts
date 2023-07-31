import { Entity } from "../../engine/entity.js";
import { Rect, Vec2 } from "../../engine/geometry.js";
import { Game } from "../../game/game.js";
import { Player } from "../player/player.js";

export class Enemy extends Entity {

    pos: Vec2;
    dim: Vec2
    level: number;
    attack: number;
    life: number;
    defence: number;
    direction: string;
    status: string;
    sprite: ImageBitmap;
    walkDistance: number;
    damageCooldownTimer: number;
    knockbackTimer: number;
    knockbackDir: string;

    constructor(sprite: ImageBitmap, pos: Vec2, level: number, life: number, attack: number, defence: number) {
        super();
        this.pos = pos;
        this.dim = new Vec2(1, 1);

        this.level = level;
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

    }

    create(): void {

    }

    update(game: Game): void {

        var newPos = new Vec2(this.pos.x, this.pos.y)
        if (this.status != "knockback") {
            this.updateMagic(game);
        }
        if (game.player.status == "attack") {
            this.updateAttack(game);
        }
        if (this.status == "knockback") {
            this.updateKnockback(game, newPos);
        }
        else if (this.status == 'idle') {
            this.updateIdle(game);
        }
        else if (this.status == "walking") {
            this.updateWalking(game, newPos);
        }

        this.limitPosition(game, newPos);
        this.updateMapCollision(game, newPos);
    }

    render(game: Game): void {

        var x: number;

        if (this.knockbackTimer > 0 && (this.knockbackTimer % 2 || this.knockbackTimer % 3)) {
            return;
        }

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

    limitPosition(game: Game, newPos: Vec2) {
        if (newPos.x + this.dim.x >= (game.map.camera.x + 1) * 32) {
            newPos.x = ((game.map.camera.x + 1) * 32) - this.dim.x;
        }
        if (newPos.x < (game.map.camera.x) * 32) {
            newPos.x = (game.map.camera.x * 32);
        }
        if (newPos.y + this.dim.y >= (game.map.camera.y + 1) * 18) {
            newPos.y = ((game.map.camera.y + 1) * 18) - this.dim.y;
        }
        if (newPos.y < (game.map.camera.y) * 18) {
            newPos.y = (game.map.camera.y * 18);
        }
    }

    checkMapColision(x: number, y: number, game: Game) {

        var tile = game.map.getTile(x, y);

        if (tile != 16 && tile != 24 && tile != 162 && tile != 170 && tile != 7 && tile != 15 && tile != 36 && tile != 37 && tile != 38) {
            return true;
        }

        return false;
    }

    updateMapCollision(game: Game, newPos: Vec2) {
        //colisão

        var finalPos = new Vec2(newPos.x, newPos.y);

        //Para X
        if (this.checkMapColision(newPos.x, this.pos.y, game)) {
            finalPos.x = Math.floor(newPos.x) + 1;
        }
        else if (this.checkMapColision(newPos.x, this.pos.y + this.dim.y - 0.01, game)) {
            finalPos.x = Math.floor(newPos.x) + 1;
        }
        else if (this.checkMapColision(newPos.x + this.dim.x, this.pos.y, game)) {
            finalPos.x = Math.floor(newPos.x) + (1 - this.dim.x);
        }
        else if (this.checkMapColision(newPos.x + this.dim.x, this.pos.y + this.dim.y - 0.01, game)) {
            finalPos.x = Math.floor(newPos.x) + (1 - this.dim.x);
        }

        //Para Y
        if (this.checkMapColision(finalPos.x, newPos.y, game)) {
            finalPos.y = Math.floor(newPos.y) + 1;
        }
        else if (this.checkMapColision(finalPos.x + this.dim.x - 0.01, newPos.y, game)) {
            finalPos.y = Math.floor(newPos.y) + 1;
        }
        else if (this.checkMapColision(finalPos.x, newPos.y + this.dim.y, game)) {
            finalPos.y = Math.floor(newPos.y) + (1 - this.dim.y);
        }
        else if (this.checkMapColision(finalPos.x + this.dim.x - 0.01, newPos.y + this.dim.y, game)) {
            finalPos.y = Math.floor(newPos.y) + (1 - this.dim.y);
        }

        if (this.status != "scrolling") {
            this.pos = finalPos;
        }
    }

    calcAttackDamage(player: Player) {

        if (Math.random() <= 0.05) {
            return (player.strength * 2);
        }
        return player.strength <= this.defence ? 1 : player.strength - this.defence;
    }

    calcMagicDamage(player: Player) {
        if (Math.random() <= 0.05) {
            return (player.magic_power * 2);
        }
        return player.magic_power < this.defence ? 1 : player.magic_power - this.defence;
    }

    updateAttack(game: Game) {
        var area = new Rect(this.pos, this.dim);

        if (this.damageCooldownTimer <= 0) {
            if (area.checkIntersect(game.player.attackArea)) {
                this.life -= this.calcAttackDamage(game.player);
                this.damageCooldownTimer = 30;

                if (this.life > 0) {
                    this.status = "knockback";
                    this.knockbackTimer = 20;
                    this.knockbackDir = game.player.direction;
                }
                else {
                    this.status = "dead";
                    game.player.getExperience(this);
                }
            }
        }
        else {
            this.damageCooldownTimer--;
        }
    }

    updateKnockback(game: Game, newPos: Vec2) {
        this.knockbackTimer--;

        if (this.knockbackTimer == 0) {
            this.status = "idle";
        } else if (this.knockbackDir == "right") {
            this.direction = "left";
            newPos.x += 0.1;
        }
        else if (this.knockbackDir == "left") {
            this.direction = "right";
            newPos.x -= 0.1;
        }
        else if (this.knockbackDir == "down") {
            this.direction = "up";
            newPos.y += 0.1;
        }
        else {
            this.direction = "down";
            newPos.y -= 0.1;
        }
    }

    updateIdle(game: Game) {
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

    updateWalking(game: Game, newPos: Vec2) {
        if (this.walkDistance <= 0) {
            this.status = "idle";
        }
        if (this.direction == "right" && this.walkDistance > 0) {
            newPos.x += 0.02;
        }
        else if (this.direction == "left" && this.walkDistance > 0) {
            newPos.x -= 0.02;
        }
        else if (this.direction == "down" && this.walkDistance > 0) {
            newPos.y += 0.02;
        }
        else if (this.direction == "up" && this.walkDistance > 0) {
            newPos.y -= 0.02;
        }
        this.walkDistance -= 0.02;
    }

    updateMagic(game: Game) {

        if (this.damageCooldownTimer <= 0) {
            for (var i = 0; i < game.playerProjectiles.length; i++) {
                var p = game.playerProjectiles[i];

                var r = new Rect(p.pos, new Vec2(0.5, 0.5));

                if (r.checkIntersect(new Rect(this.pos, this.dim))) {

                    this.life -= this.calcMagicDamage(game.player);
                    this.damageCooldownTimer = 30;

                    if (this.life > 0) {
                        this.status = "knockback";
                        this.knockbackDir = game.player.direction;
                        this.knockbackTimer = 20;
                        break;
                    } else {
                        this.status = "dead";
                        game.player.getExperience(this);
                    }
                }
            }

        }
        else {
            this.damageCooldownTimer--;
        }
    }

}