import { Vec2 } from "../../engine/geometry.js";
import { Enemy } from "./enemy.js";
export class Frog extends Enemy {
    constructor(sprite, pos, level, life, attack, defence) {
        super(sprite, pos, level, life, attack, defence);
        this.jumpDistance = 0;
        this.jumpValue = 0;
        this.idleTimer = 10;
    }
    render(game) {
        if (this.status == "knockback") {
            if (this.knockbackTimer > 0 && (this.knockbackTimer % 2 == 0 || this.knockbackTimer % 3 == 0)) {
                return;
            }
        }
        else if (this.damageCooldownTimer > 0 && (this.damageCooldownTimer % 2 == 0 || this.damageCooldownTimer % 3 == 0)) {
            return;
        }
        var offset = new Vec2(game.map.camera.x * 32, game.map.camera.y * 18);
        var fpos = new Vec2(((this.pos.x - offset.x) * game.tilesize) + game.globalPos.x, ((this.pos.y - offset.y) * game.tilesize) + game.globalPos.y);
        var uv1 = new Vec2(0, 0);
        var uv2 = new Vec2(16, 16);
        var rdim = new Vec2(this.dim.x * game.tilesize, this.dim.y * game.tilesize);
        if (this.direction == "right") {
            uv1.x = 16;
        }
        if (this.status == "jumping") {
            uv1.y = 16;
            uv2.y = 18;
            rdim.y = 1.1 * game.tilesize;
        }
        //game.draw.fillRect(new Rect(fpos, rdim), 0, 0, 255);
        if (this.status == "jumping") {
            fpos.y += game.tilesize * 0.25;
            game.draw.drawImage(this.sprite, fpos, new Vec2(this.dim.x * game.tilesize, this.dim.y * game.tilesize), new Vec2(32, 0), new Vec2(16, 16));
            fpos.y -= game.tilesize * 0.25;
        }
        fpos.y -= this.jumpValue * game.tilesize;
        game.draw.drawImage(this.sprite, fpos, rdim, uv1, uv2);
    }
    update(game) {
        var newPos = new Vec2(this.pos.x, this.pos.y);
        this.updateMagic(game);
        if (this.status == "idle") {
            this.updateIdle(game);
        }
        if (game.player.status == "attack" && this.jumpValue <= 0.5) {
            this.updateAttack(game);
        }
        if (this.status == "knockback") {
            this.updateKnockback(game, newPos);
        }
        if (this.status == "jumping") {
            this.updateJumping(game, newPos);
        }
        super.limitPosition(game, newPos);
        super.updateMapCollision(game, newPos);
    }
    updateIdle(game) {
        if (this.idleTimer > 0) {
            this.idleTimer--;
        }
        else {
            super.updateIdle(game);
            if (this.status == "walking") {
                this.status = "jumping";
                this.jumpDistance = this.walkDistance;
                this.jumpValue = 0;
            }
        }
    }
    updateJumping(game, newPos) {
        super.updateWalking(game, newPos);
        newPos.x += (newPos.x - this.pos.x) * 2;
        newPos.y += (newPos.y - this.pos.y) * 2;
        if (this.walkDistance > this.jumpDistance / 2) {
            this.jumpValue += 0.05;
        }
        else if (this.jumpValue > 0) {
            this.jumpValue -= 0.05;
        }
        if (this.status == "idle") {
            this.idleTimer = 100 + Math.floor(Math.random() * 100);
        }
    }
    updateMagic(game) {
        super.updateMagic(game);
        if (this.status == "knockback" && this.walkDistance > 0) {
            this.status = "jumping";
        }
    }
}
