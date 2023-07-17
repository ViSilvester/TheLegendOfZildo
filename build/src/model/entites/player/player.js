var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KeybordController } from "../../../controllers/keyboardController.js";
import { EzIO } from "../../engine/EzIO.js";
import { Entity } from "../../engine/entity.js";
import { Rect, Vec2 } from "../../engine/geometry.js";
export class Player extends Entity {
    constructor(pos) {
        super();
        this.direction = "down";
        this.status = "idle";
        // control variables
        this.animationTimer = 0;
        this.knockbackTimer = 0;
        this.attackTimer = 0;
        this.attackColldown = false;
        this.attackArea = new Rect(new Vec2(0, 0), new Vec2(0, 0));
        // status
        this.life = 50;
        this.attack = 5;
        this.magic_attack = 2;
        this.defence = 5;
        this.inteligence = 5;
        this.mana = 10;
        this.experience = 0;
        this.pos = pos;
        this.dim = new Vec2(1, 1);
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sprite = yield EzIO.loadImageFromUrl("../../../../assets/char.png");
        });
    }
    update(game) {
        var newPos = new Vec2(this.pos.x, this.pos.y);
        // checa se esta num satus transitivo
        if (this.status != "scrolling" &&
            this.status != "attack" &&
            this.status != "knockback") {
            this.status = 'idle';
        }
        this.updateKeyboardInput(game, newPos);
        if (this.status == "walking") {
            this.updateMovement(game, newPos);
        }
        else if (this.status == "attack") {
            this.updateAttack(game);
        }
        else if (this.status == "knockback") {
            this.updateKnockback(game, newPos);
        }
        if (this.status != "knockback") {
            this.checkEnemyCollison(game);
        }
        this.limitPosition(game, newPos);
        this.updateMapCollision(game, newPos);
    }
    render(game) {
        var offset = new Vec2(game.map.camera.x * 32, game.map.camera.y * 18);
        var dir = 1;
        switch (this.direction) {
            case "down":
                dir = 0;
                break;
            case "up":
                dir = 1;
                break;
            case "right":
                dir = 2;
                break;
            case "left":
                dir = 3;
                break;
        }
        if (this.status == "walking") {
            this.animationTimer++;
            if (this.animationTimer >= 40) {
                this.animationTimer = 0;
            }
        }
        if (this.status == "idle") {
            this.animationTimer = 0;
        }
        //sprite
        var ani_x = Math.floor(this.animationTimer / 10);
        game.draw.drawImage(this.sprite, new Vec2(((this.pos.x - offset.x) * game.tilesize) + game.globalPos.x, (this.pos.y - offset.y) * game.tilesize + +game.globalPos.y), new Vec2(game.tilesize, game.tilesize), new Vec2(ani_x + 1 + ani_x * 16, (dir * 16) + dir + 1), new Vec2(16, 16));
        //espada
        if (this.status == "attack") {
            var viewAttackArea = new Rect(new Vec2(((this.attackArea.pos.x - offset.x) * game.tilesize) + game.globalPos.x, ((this.attackArea.pos.y - offset.y) * game.tilesize) + game.globalPos.y), new Vec2(this.attackArea.dim.x * game.tilesize, this.attackArea.dim.y * game.tilesize));
            game.draw.fillRect(viewAttackArea, 255, 0, 0);
        }
    }
    getExperience(enemy) {
        this.experience += 1 + Math.floor(Math.random() * 5);
    }
    updateKeyboardInput(game, newPos) {
        //update position
        if (this.status == 'idle') {
            if (!KeybordController.getKeyState(' ')) {
                this.attackColldown = false;
            }
            if (KeybordController.getKeyState(' ') && !this.attackColldown) {
                this.status = "attack";
                this.attackTimer = 10;
            }
            else if (KeybordController.getKeyState('w')) {
                this.status = "walking";
                this.direction = "up";
            }
            else if (KeybordController.getKeyState('a')) {
                this.status = "walking";
                this.direction = "left";
            }
            else if (KeybordController.getKeyState('s')) {
                this.status = "walking";
                this.direction = "down";
            }
            else if (KeybordController.getKeyState('d')) {
                this.status = "walking";
                this.direction = "right";
            }
        }
    }
    updateMovement(game, newPos) {
        if (this.status == "walking") {
            if (this.direction == "up") {
                newPos.y -= 0.1;
            }
            else if (this.direction == "left") {
                newPos.x -= 0.1;
            }
            else if (this.direction == "down") {
                newPos.y += 0.1;
            }
            else {
                newPos.x += 0.1;
            }
        }
    }
    updateAttack(game) {
        //Attack
        var swordOffset;
        if (this.direction == "up") {
            swordOffset = new Vec2(0, -1);
        }
        else if (this.direction == "down") {
            swordOffset = new Vec2(0, 1);
        }
        else if (this.direction == "left") {
            swordOffset = new Vec2(-1, 0);
        }
        else {
            swordOffset = new Vec2(1, 0);
        }
        this.attackArea = new Rect(new Vec2(this.pos.x + swordOffset.x, this.pos.y + swordOffset.y), new Vec2(1, 1));
        this.attackTimer--;
        if (this.attackTimer == 0) {
            this.attackColldown = true;
            this.status = "idle";
        }
    }
    updateKnockback(game, newPos) {
        this.knockbackTimer--;
        if (this.direction == "left") {
            newPos.x += 0.1;
        }
        else if (this.direction == "right") {
            newPos.x -= 0.1;
        }
        else if (this.direction == "up") {
            newPos.y += 0.1;
        }
        else {
            newPos.y -= 0.1;
        }
        if (this.knockbackTimer == 0) {
            this.status = "idle";
        }
    }
    limitPosition(game, newPos) {
        // limita posição
        if (newPos.x + 1 >= game.map.width) {
            newPos.x = game.map.width - 1;
        }
        if (newPos.x <= 0) {
            newPos.x = 0;
        }
        if (newPos.y + 1 >= game.map.heigh) {
            newPos.y = game.map.heigh - 1;
        }
        if (newPos.y <= 0) {
            newPos.y = 0;
        }
    }
    checkEnemyCollison(game) {
        //verifica colisão com inimigo
        var r = new Rect(this.pos, this.dim);
        for (var i = 0; i < game.map.enemys.length; i++) {
            var enemy = game.map.enemys[i];
            if (r.checkIntersect(new Rect(enemy.pos, enemy.dim))) {
                this.status = "knockback";
                this.life -= enemy.attack < this.defence ? 1 : enemy.attack - this.defence;
                this.knockbackTimer = 10;
                if (Math.abs(this.pos.x - enemy.pos.x) > (Math.abs(this.pos.y - enemy.pos.y))) {
                    if (this.pos.x < enemy.pos.x) {
                        this.direction = "right";
                    }
                    else {
                        this.direction = "left";
                    }
                }
                else {
                    if (this.pos.y < enemy.pos.y) {
                        this.direction = "down";
                    }
                    else {
                        this.direction = "up";
                    }
                }
                break;
            }
        }
    }
    updateMapCollision(game, newPos) {
        //colisão
        var finalPos = new Vec2(newPos.x, newPos.y);
        //Para X
        if (game.map.checkColision(newPos.x, this.pos.y)) {
            finalPos.x = Math.floor(newPos.x) + 1;
        }
        else if (game.map.checkColision(newPos.x, this.pos.y + 0.99)) {
            finalPos.x = Math.floor(newPos.x) + 1;
        }
        else if (game.map.checkColision(newPos.x + 1, this.pos.y)) {
            finalPos.x = Math.floor(newPos.x);
        }
        else if (game.map.checkColision(newPos.x + 1, this.pos.y + 0.99)) {
            finalPos.x = Math.floor(newPos.x);
        }
        //Para Y
        if (game.map.checkColision(finalPos.x, newPos.y)) {
            finalPos.y = Math.floor(newPos.y) + 1;
        }
        else if (game.map.checkColision(finalPos.x + 0.99, newPos.y)) {
            finalPos.y = Math.floor(newPos.y) + 1;
        }
        else if (game.map.checkColision(finalPos.x, newPos.y + 1)) {
            finalPos.y = Math.floor(newPos.y);
        }
        else if (game.map.checkColision(finalPos.x + 0.99, newPos.y + 1)) {
            finalPos.y = Math.floor(newPos.y);
        }
        if (this.status != "scrolling") {
            this.pos = finalPos;
        }
    }
}
