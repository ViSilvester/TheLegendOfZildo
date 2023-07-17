var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EzIO } from "../../engine/EzIO.js";
import { Entity } from "../../engine/entity.js";
import { Vec2 } from "../../engine/geometry.js";
import { Enemy } from "../enemy/enemy.js";
export class GameMap extends Entity {
    constructor(cameraPos) {
        super();
        this.camera = new Vec2(0, 0);
        this.camera = cameraPos;
        this.enemys = [];
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tileset = yield EzIO.loadImageFromUrl("../../../../assets/tileset.png");
            this.enemtySprites = yield EzIO.loadImageFromUrl("../../../../assets/enemy.png");
            var obj = yield EzIO.loadJsonFromUrl("../../../../assets/main_map.json");
            this.width = obj.width;
            this.heigh = obj.heigh;
            this.map = obj.layers[0].data;
        });
    }
    update(game) {
        this.updateCameraScrolling(game);
    }
    render(game) {
        var offset = new Vec2(this.camera.x * 32, this.camera.y * 18);
        for (var y = offset.y; y < offset.y + 18; y++) {
            for (var x = offset.x; x < offset.x + 32; x++) {
                var tile = this.getTile(x, y);
                game.draw.drawImage(this.tileset, new Vec2(((x - offset.x) * game.tilesize) + game.globalPos.x, ((y - offset.y) * game.tilesize) + game.globalPos.y), new Vec2(game.tilesize, game.tilesize), new Vec2((tile % 6) * 8, Math.floor(tile / 6) * 8), new Vec2(8, 8));
            }
        }
        // render enemys
        for (var i = 0; i < this.enemys.length; i++) {
            this.enemys[i].render(game);
        }
    }
    getTile(x, y) {
        return this.map[(Math.floor(y) * this.width) + Math.floor(x)] - 1;
    }
    checkColision(x, y) {
        var tile = this.getTile(x, y);
        if (tile != 6 && tile != 12) {
            return true;
        }
        return false;
    }
    updateCameraScrolling(game) {
        // update camera  
        if (game.player.direction == "right" && game.player.status != "scrolling" && game.player.pos.x > (this.camera.x + 1) * 32) {
            game.player.status = "scrolling";
        }
        if (game.player.direction == "left" && game.player.status != "scrolling" && game.player.pos.x + 1 <= this.camera.x * 32) {
            game.player.status = "scrolling";
        }
        if (game.player.direction == "down" && game.player.status != "scrolling" && game.player.pos.y > (this.camera.y + 1) * 18) {
            game.player.status = "scrolling";
        }
        if (game.player.direction == "up" && game.player.status != "scrolling" && game.player.pos.y + 1 <= this.camera.y * 18) {
            game.player.status = "scrolling";
        }
        if (game.player.status == "scrolling") {
            switch (game.player.direction) {
                case "right":
                    this.camera.x += 0.025;
                    if (Math.floor(game.player.pos.x) == Math.floor(this.camera.x * 32)) {
                        game.player.status = 'idle';
                        this.camera.x = Math.floor(this.camera.x);
                        this.updateEnemySpawn(game);
                    }
                    break;
                case "left":
                    this.camera.x -= 0.025;
                    if (Math.floor(game.player.pos.x + 2) == Math.floor((this.camera.x + 1) * 32)) {
                        game.player.status = 'idle';
                        this.camera.x = Math.floor(this.camera.x);
                        this.updateEnemySpawn(game);
                    }
                    break;
                case "down":
                    this.camera.y += 0.025;
                    if (Math.floor(game.player.pos.y) == Math.floor(this.camera.y * 18)) {
                        game.player.status = 'idle';
                        this.camera.y = Math.floor(this.camera.y);
                        this.updateEnemySpawn(game);
                    }
                    break;
                case "up":
                    this.camera.y -= 0.025;
                    if (Math.floor(game.player.pos.y + 2) == Math.floor((this.camera.y + 1) * 18)) {
                        game.player.status = 'idle';
                        this.camera.y = Math.floor(this.camera.y);
                        this.updateEnemySpawn(game);
                    }
                    break;
            }
        }
        else {
            this.updateEnemys(game);
        }
    }
    updateEnemySpawn(game) {
        this.enemys = [];
        // Pega posições em que inimigos podem spawnar
        var offset = new Vec2(this.camera.x * 32, this.camera.y * 18);
        var availablePositions = [];
        for (var i = offset.x; i < offset.x + 32; i++) {
            for (var j = offset.y; j < offset.y + 18; j++) {
                if ((!this.checkColision(i, j)) &&
                    i != Math.floor(game.player.pos.x) &&
                    j != Math.floor(game.player.pos.y)) {
                    availablePositions.push(new Vec2(i, j));
                }
            }
        }
        // Spawna 5 inimigos
        for (i = 0; i < 5; i++) {
            var pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            this.enemys.push(new Enemy(this.enemtySprites, pos, 15, 10, 1, 5, 1));
        }
    }
    updateEnemys(game) {
        for (var i = 0; i < this.enemys.length; i++) {
            this.enemys[i].update(game);
            if (this.enemys[i].status == "dead") {
                this.enemys.splice(i, 1);
                i--;
            }
        }
    }
}
