import { KeybordController } from "../../../controllers/keyboardController.js";
import { EzIO } from "../../engine/EzIO.js";
import { Entity } from "../../engine/entity.js";
import { Rect, Vec2 } from "../../engine/geometry.js";
import { Game } from "../../game/game.js";
import { Inventory } from "../../inventory/inventory.js";
import { Particle } from "../../particle/particle.js";
import { Enemy } from "../enemy/enemy.js";

export class Player extends Entity {

    //engine variables
    pos: Vec2;
    dim: Vec2;
    direction: string = "down";
    sprite!: ImageBitmap;
    status = "idle";
    attackArea = new Rect(new Vec2(0, 0), new Vec2(0, 0));

    // control variables
    animationTimer = 0;
    knockbackTimer = 0;
    damageColldownTimer = 0;
    attackTimer = 0;
    ExpToLvlUp = 50;
    attackColldown = false;

    // status
    life = 10;
    magic = 10;
    powerPoints = 3;

    level = 1;
    vitality = 1;
    strength = 1;
    magic_power = 1;
    defence = 1;
    inteligence = 1;
    experience = 0;

    inventory = new Inventory();

    constructor(pos: Vec2) {
        super();
        this.pos = pos;
        this.dim = new Vec2(0.5, 0.5);
    }

    get maxLife() {
        return this.vitality * 10;
    }

    get maxMagic() {
        return this.inteligence * 10;
    }

    async create(): Promise<void> {
        this.sprite = await EzIO.loadImageFromUrl("./assets/char.png");
    }

    update(game: Game): void {

        var newPos = new Vec2(this.pos.x, this.pos.y)

        if (this.damageColldownTimer > 0) {
            this.damageColldownTimer--;
        }

        // checa se esta num satus transitivo
        if (this.status != "scrolling" &&
            this.status != "attack" &&
            this.status != "magic" &&
            this.status != "knockback" &&
            this.status != "enterDoor") {
            this.status = 'idle'
        }

        this.updateKeyboardInput(game, newPos);

        if (this.status == "walking") {
            this.updateMovement(game, newPos);
        }
        else if (this.status == "attack") {
            this.updateAttack(game);
        }
        else if (this.status == "magic") {
            this.updateMagic(game);
        }
        else if (this.status == "knockback") {
            this.updateKnockback(game, newPos);
        }
        else if (this.status == "enterDoor") {
            if (game.map.currentMap == game.map.overworldMap) {
                game.map.enterDoor(game);
                this.pos.x = Math.floor(game.map.camera.x * 32) + 16;
                this.pos.y = Math.floor(game.map.camera.y * 18) + 15.5;
                this.status = "doorEntered";
            }
            else {
                game.map.enterDoor(game);
                this.pos = game.map.lastOverWorldPosition;
                this.pos.y += 0.1;
                this.status = "doorEntered";
                this.direction = "down";
            }
        }
        if (this.damageColldownTimer == 0) {
            this.checkEnemyCollision(game);
        }

        this.limitPosition(game, newPos);

        if (this.status != "enterDoor" && this.status != "doorEntered") {
            this.updateMapCollision(game, newPos);
        }

    }

    render(game: Game): void {


        if (this.knockbackTimer > 0 && (this.knockbackTimer % 2 || this.knockbackTimer % 3)) {
            return;
        }

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


        if (this.status == "attack") {
            game.draw.drawImage(
                this.sprite,
                new Vec2(
                    ((this.pos.x - offset.x - 0.25) * game.tilesize) + game.globalPos.x,
                    (this.pos.y - offset.y - 0.5) * game.tilesize + game.globalPos.y
                ),
                new Vec2(game.tilesize, game.tilesize),
                new Vec2((4 * 16) + 4, (dir * 16) + dir + 1),
                new Vec2(16, 16)
            )
        }
        else {
            game.draw.drawImage(
                this.sprite,
                new Vec2(
                    ((this.pos.x - offset.x - 0.25) * game.tilesize) + game.globalPos.x,
                    (this.pos.y - offset.y - 0.5) * game.tilesize + game.globalPos.y
                ),
                new Vec2(game.tilesize, game.tilesize),
                new Vec2(ani_x + 1 + ani_x * 16, (dir * 16) + dir + 1),
                new Vec2(16, 16)
            )
        }



        // const r = new Rect(new Vec2(this.pos.x * game.tilesize, this.pos.y * game.tilesize), new Vec2(this.dim.x * game.tilesize, this.dim.y * game.tilesize));
        // r.pos.x += game.globalPos.x - (game.map.camera.x * 32 * game.tilesize);
        // r.pos.y += game.globalPos.y - (game.map.camera.y * 18 * game.tilesize);
        // game.draw.fillRect(r, 255, 0, 0,);



        //espada
        if (this.status == "attack") {

            var viewAttackArea = new Rect(
                new Vec2(
                    ((this.attackArea.pos.x - offset.x) * game.tilesize) + game.globalPos.x,
                    ((this.attackArea.pos.y - offset.y) * game.tilesize) + game.globalPos.y
                ),
                new Vec2(this.attackArea.dim.x * game.tilesize, this.attackArea.dim.y * game.tilesize)
            );

            game.draw.drawImage(
                this.sprite,
                viewAttackArea.pos,
                viewAttackArea.dim,
                new Vec2((5 * 16) + 4, (dir * 16) + dir + 1),
                new Vec2(16, 16)
            )

            //game.draw.fillRect(viewAttackArea, 255, 0, 0);

        }
    }

    getExperience(enemy: Enemy) {
        var percent = Math.random();
        percent = percent < 0.25 ? 0.25 : percent;
        this.experience += 1 + Math.floor(percent * enemy.level);

        if (this.experience >= this.ExpToLvlUp) {
            this.experience -= this.ExpToLvlUp;
            this.level++;
            this.powerPoints += 3;
            this.ExpToLvlUp += Math.floor(this.ExpToLvlUp / 2);
        }
    }

    updateKeyboardInput(game: Game, newPos: Vec2) {
        //update position

        if (this.status == 'idle') {

            if (!KeybordController.getKeyState('k')) {
                this.attackColldown = false;
            }

            if (KeybordController.getKeyState('k') && !this.attackColldown) {
                this.status = "attack";
                this.attackTimer = 15;
            }
            else if (KeybordController.getKeyPress('j') && !this.attackColldown && this.magic >= 5) {
                this.status = "magic";
                this.attackTimer = 10;
                this.magic -= 5;
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

            if (KeybordController.getKeyPress('1')) {
                this.inventory.blazeMedalion = true;
                this.inventory.riverTunic = false;
                this.inventory.blizardWisper = false;
                this.inventory.ancientAmber = false;
            }
            else if (KeybordController.getKeyPress('2')) {
                this.inventory.blazeMedalion = false;
                this.inventory.riverTunic = true;
                this.inventory.blizardWisper = false;
                this.inventory.ancientAmber = false;
            }
            else if (KeybordController.getKeyPress('3')) {
                this.inventory.blazeMedalion = false;
                this.inventory.riverTunic = false;
                this.inventory.blizardWisper = true;
                this.inventory.ancientAmber = false;
            }
            else if (KeybordController.getKeyPress('4')) {
                this.inventory.blazeMedalion = false;
                this.inventory.riverTunic = false;
                this.inventory.blizardWisper = false;
                this.inventory.ancientAmber = true;
            }

        }
    }

    updateMovement(game: Game, newPos: Vec2) {

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

    updateAttack(game: Game) {
        //Attack

        var swordOffset: Vec2;
        if (this.direction == "up") {
            swordOffset = new Vec2(-0.25, -this.dim.y - 1);
        }
        else if (this.direction == "down") {
            swordOffset = new Vec2(-0.25, this.dim.y);
        }
        else if (this.direction == "left") {
            swordOffset = new Vec2(-1.25, this.dim.y - 1);
        }
        else {
            swordOffset = new Vec2(this.dim.x + 0.25, this.dim.y - 1);
        }
        this.attackArea = new Rect(
            new Vec2(this.pos.x + swordOffset.x, this.pos.y + swordOffset.y),
            new Vec2(1, 1)
        );
        this.attackTimer--;
        if (this.attackTimer == 0) {
            this.attackColldown = true;
            this.status = "idle";
        }

    }

    updateKnockback(game: Game, newPos: Vec2) {

        this.knockbackTimer--;

        if (this.knockbackTimer > 0) {

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
        }

        if (this.knockbackTimer == 0) {
            this.status = "idle";
        }
    }

    limitPosition(game: Game, newPos: Vec2) {
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

        if (this.status == "knockback") {

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

    }

    checkEnemyCollision(game: Game) {

        //verifica colisão com inimigo
        var r = new Rect(this.pos, this.dim);
        for (var i = 0; i < game.enemys.length; i++) {
            var enemy = game.enemys[i];

            if (enemy.status == "jumping") {

            }
            else if (r.checkIntersect(new Rect(enemy.pos, enemy.dim))) {

                this.status = "knockback";
                this.life -= enemy.attack < this.defence ? 1 : enemy.attack - this.defence;
                this.knockbackTimer = 20;
                this.damageColldownTimer = 30;

                if (Math.abs(this.pos.x - enemy.pos.x) > (Math.abs(this.pos.y - enemy.pos.y))) {
                    if (this.pos.x < enemy.pos.x) {
                        this.direction = "right";
                    } else {
                        this.direction = "left";
                    }
                }
                else {
                    if (this.pos.y < enemy.pos.y) {
                        this.direction = "down";
                    } else {
                        this.direction = "up";
                    }
                }

                break;
            }
        }
    }

    checkMapColision(x: number, y: number, game: Game) {

        var tile = game.map.getTile(x, y);

        if (tile == 146 || tile == 154 || tile == 48 || tile == 56) {
            this.status = "enterDoor";
            return false;
        }

        if (this.inventory.riverTunic) {
            if (tile == 17 || tile == 18 || tile == 19 || tile == 33 || tile == 34 || tile == 35 || tile == 49 || tile == 50 || tile == 51 ||
                tile == 25 || tile == 26 || tile == 27 || tile == 41 || tile == 42 || tile == 43 || tile == 57 || tile == 58 || tile == 59) {
                return false;
            }

        }
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

    updateMagic(game: Game) {

        if (this.attackTimer == 10) {
            this.attackTimer--;
            if (this.direction == "right") {
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x + 0.5, this.pos.y), new Vec2(10, 10), new Vec2(0.2, 0), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x + 0.5, this.pos.y), new Vec2(10, 10), new Vec2(0.2, -0.1), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x + 0.5, this.pos.y), new Vec2(10, 10), new Vec2(0.2, 0.1), 50));
            }
            else if (this.direction == "left") {
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x - 0.5, this.pos.y), new Vec2(10, 10), new Vec2(-0.2, 0), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x - 0.5, this.pos.y), new Vec2(10, 10), new Vec2(-0.2, -0.1), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x - 0.5, this.pos.y), new Vec2(10, 10), new Vec2(-0.2, 0.1), 50));
            }
            else if (this.direction == "up") {
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x, this.pos.y), new Vec2(10, 10), new Vec2(0, -0.2), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x, this.pos.y), new Vec2(10, 10), new Vec2(0.1, -0.2), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x, this.pos.y), new Vec2(10, 10), new Vec2(-0.1, -0.2), 50));
            }
            if (this.direction == "down") {
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x, this.pos.y), new Vec2(10, 10), new Vec2(0, 0.2), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x, this.pos.y), new Vec2(10, 10), new Vec2(0.1, 0.2), 50));
                game.playerProjectiles.push(new Particle(new Vec2(this.pos.x, this.pos.y), new Vec2(10, 10), new Vec2(-0.1, 0.2), 50));
            }
        }
        else if (this.attackTimer > 0) {
            this.attackTimer--;
        }
        else {
            this.status = "idle";
        }

    }

}