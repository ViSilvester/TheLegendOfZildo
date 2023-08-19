var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KeybordController } from "../../controllers/keyboardController.js";
import { SoundController } from "../../controllers/soundController.js";
import { EzIO } from "../engine/EzIO.js";
import { Engine } from "../engine/engine.js";
import { Vec2 } from "../engine/geometry.js";
import { GameMap } from "../entites/map/map.js";
import { Player } from "../entites/player/player.js";
import { EnemyFactory } from "../factory/enemyFactory/enemyFactory.js";
export class Game extends Engine {
    constructor() {
        super('canvas');
        this.status = "title";
        this.blink_timer = 0;
        //configuração para baixa resolução
        this.draw.getContext().webkitImageSmoothingEnabled = false;
        this.draw.getContext().mozImageSmoothingEnabled = false;
        this.draw.getContext().imageSmoothingEnabled = false;
        KeybordController.startKeybordListner();
        this.soundController = new SoundController();
        this.player = new Player(new Vec2(206, 175));
        this.tilesize = this.draw.width / 32;
        this.map = new GameMap(new Vec2(6, 9));
        this.globalPos = new Vec2(0, this.tilesize * 4);
        this.playerProjectiles = [];
        this.enemys = [];
        this.enemyFactory = new EnemyFactory();
        this.mapEnemyMemory = [];
        this.mapCoordMemory = [];
        this.title_timer = 100;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.map.create();
            yield this.player.create();
            yield this.soundController.loadSounds();
            yield this.enemyFactory.createFactory();
            this.ui_texture = yield EzIO.loadImageFromUrl("./assets/img/ui_elements.png");
            this.projectiletexture = yield EzIO.loadImageFromUrl("./assets/img/projectiles.png");
            this.title_screen = yield EzIO.loadImageFromUrl("./assets/img/title_screen.png");
        });
    }
    update() {
        if (!this.soundController.isPlaying) {
            this.soundController.play();
        }
        //keyboard input
        this.updateKeyboardInput();
        if (this.status == "title") {
            if (navigator.userActivation.hasBeenActive) {
                this.title_timer--;
                this.blink_timer = 40;
                if (this.title_timer == 0) {
                    this.status = "inGame";
                }
            }
            else {
                this.blink_timer++;
                if (this.blink_timer == 40) {
                    this.blink_timer = 0;
                }
            }
        }
        if (this.status == "inGame") {
            this.player.update(this);
            this.map.update(this);
            this.updatePlayerProjectiles();
            this.updateEnemys();
        }
        else if (this.status == "inventory") {
            this.player.inventory.update(this);
        }
    }
    render() {
        if (this.status == "title") {
            this.draw.fillBackgroudColor(0, 0, 0);
            this.draw.drawImage(this.title_screen, new Vec2(0, this.globalPos.y / 2), new Vec2(this.tilesize * 32, this.tilesize * 18), new Vec2(0, 0), new Vec2(512, 288));
            if (this.blink_timer < 25) {
                this.drawTextLine("CLICK TO START NEW GAME", new Vec2(this.tilesize * 10, this.tilesize * 22));
            }
        }
        else if (this.status == "inGame") {
            this.draw.fillBackgroudColor(0, 0, 0);
            this.map.render(this);
            this.renderEnemys();
            this.player.render(this);
            this.renderPlayerProjectiles();
            this.player.inventory.renderStatusBar(this);
        }
        else if (this.status == "inventory") {
            this.draw.fillBackgroudColor(0, 0, 0);
            this.map.render(this);
            this.player.inventory.renderInventory(this);
        }
    }
    enemySpawn() {
        this.enemys = [];
        const area = this.map.getAreaTile(2 + (this.map.camera.x * 32), 2 + (this.map.camera.y * 18));
        if (this.map.currentMap == this.map.overworldMap) {
            var indice = this.mapCoordMemory.findIndex((v, i, o) => {
                return v.x == this.map.camera.x && v.y == this.map.camera.y;
            });
            var inimigos = this.mapEnemyMemory[indice] ? this.mapEnemyMemory[indice] : 5;
            if (inimigos > 0) {
                // Pega posições em que inimigos podem spawnar
                var offset = new Vec2(this.map.camera.x * 32, this.map.camera.y * 18);
                var availablePositions = [];
                for (var i = offset.x + 1; i < offset.x + 32 - 1; i++) {
                    for (var j = offset.y + 1; j < offset.y + 18 - 1; j++) {
                        if ((!this.map.checkColision(i, j)) &&
                            i != Math.floor(this.player.pos.x) &&
                            j != Math.floor(this.player.pos.y)) {
                            availablePositions.push(new Vec2(i, j));
                        }
                    }
                }
                // Spawna inimigos
                for (i = 0; i < inimigos; i++) {
                    var pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
                    this.enemys.push(this.enemyFactory.createEnemy(pos, this.player.level + Math.floor(this.player.powerPoints / 3), area));
                }
            }
        }
    }
    renderPlayerProjectiles() {
        for (var i = 0; i < this.playerProjectiles.length; i++) {
            var particle = this.playerProjectiles[i];
            var offset = new Vec2(this.map.camera.x * 32, this.map.camera.y * 18);
            var p = new Vec2(((particle.pos.x - offset.x) * this.tilesize) + this.globalPos.x, ((particle.pos.y - offset.y) * this.tilesize) + this.globalPos.y);
            if (this.player.inventory.blazeMedalion) {
                this.draw.drawImage(this.projectiletexture, p, new Vec2(this.tilesize / 2, this.tilesize / 2), new Vec2(0, 0), new Vec2(16, 16));
            }
            else if (this.player.inventory.riverTunic) {
                this.draw.drawImage(this.projectiletexture, p, new Vec2(this.tilesize / 2, this.tilesize / 2), new Vec2(16, 0), new Vec2(16, 16));
            }
            else if (this.player.inventory.blizardWisper) {
                this.draw.drawImage(this.projectiletexture, p, new Vec2(this.tilesize / 2, this.tilesize / 2), new Vec2(32, 0), new Vec2(16, 16));
            }
            else if (this.player.inventory.ancientAmber) {
                this.draw.drawImage(this.projectiletexture, p, new Vec2(this.tilesize / 2, this.tilesize / 2), new Vec2(48, 0), new Vec2(16, 16));
            }
        }
    }
    updatePlayerProjectiles() {
        for (var i = 0; i < this.playerProjectiles.length; i++) {
            this.playerProjectiles[i].update(this);
            if (this.playerProjectiles[i].lifetime <= 0) {
                this.playerProjectiles.splice(i, 1);
            }
        }
    }
    updateKeyboardInput() {
        if (this.status == "inGame") {
            if (KeybordController.getKeyPress('Enter')) {
                this.status = "inventory";
                this.player.inventory.transitionTimer = 0;
                this.player.inventory.reset(this.player.powerPoints > 0 ? "lvlUp" : "inventory");
            }
        }
        else if (this.status == "inventory") {
            if (KeybordController.getKeyPress('Enter')) {
                this.status = "inGame";
            }
        }
    }
    updateEnemys() {
        if (this.player.status != "scrolling") {
            for (var i = 0; i < this.enemys.length; i++) {
                this.enemys[i].update(this);
                if (this.enemys[i].status == "dead") {
                    this.enemys.splice(i, 1);
                    i--;
                }
            }
        }
    }
    renderEnemys() {
        if (this.player.status != "scrolling") {
            for (var i = 0; i < this.enemys.length; i++) {
                this.enemys[i].render(this);
            }
        }
    }
    drawTextNewLine(text, line) {
        this.draw.fillText(text, line, 255, 255, 255, this.tilesize / 2 + "px Press_Start_2p");
    }
    drawTextLine(text, line) {
        this.draw.fillText(text, line, 255, 255, 255, this.tilesize / 2 + "px Press_Start_2p");
    }
}
