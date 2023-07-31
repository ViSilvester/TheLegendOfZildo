import { KeybordController } from "../../controllers/keyboardController.js";
import { SoundController } from "../../controllers/soundController.js";
import { EzIO } from "../engine/EzIO.js";
import { Engine } from "../engine/engine.js";
import { Rect, Vec2 } from "../engine/geometry.js";
import { Enemy } from "../entites/enemy/enemy.js";
import { GameMap } from "../entites/map/map.js";
import { Player } from "../entites/player/player.js";
import { EnemyFactory } from "../factory/enemyFactory/enemyFactory.js";
import { Inventory } from "../inventory/inventory.js";
import { Particle } from "../particle/particle.js";

export class Game extends Engine {

    status = "inGame";
    tilesize: number;
    player: Player;
    map!: GameMap;
    enemys: Array<Enemy>;
    playerProjectiles: Array<Particle>;
    enemyFactory: EnemyFactory;
    mapEnemyMemory: Array<number>;
    mapCoordMemory: Array<Vec2>;
    globalPos: Vec2;
    soundController: SoundController;
    ui_texture!: ImageBitmap;
    projectiletexture!: ImageBitmap;

    constructor() {
        super('canvas');

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
    }

    async create() {
        await this.map.create();
        await this.player.create();
        await this.soundController.loadSounds();
        await this.enemyFactory.createFactory();
        this.ui_texture = await EzIO.loadImageFromUrl("./assets/ui_elements.png");
        this.projectiletexture = await EzIO.loadImageFromUrl("./assets/projectiles.png");
    }

    update(): void {

        //keyboard input
        this.updateKeyboardInput()

        if (this.status == "inGame") {
            this.player.update(this);
            this.map.update(this);
            this.updatePlayerProjectiles()
            this.updateEnemys();
        }
        else if (this.status == "inventory") {
            this.player.inventory.update(this);
        }
    }

    render(): void {

        if (this.status == "inGame") {
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
                return v.x == this.map.camera.x && v.y == this.map.camera.y
            });
            var inimigos = this.mapEnemyMemory[indice] ? this.mapEnemyMemory[indice] : 5;

            if (inimigos > 0) {

                // Pega posições em que inimigos podem spawnar
                var offset = new Vec2(
                    this.map.camera.x * 32,
                    this.map.camera.y * 18,
                );
                var availablePositions: Array<Vec2> = [];
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
                    this.enemys.push(
                        this.enemyFactory.createEnemy(pos, this.player.level + Math.floor(this.player.powerPoints / 3), area)
                    );
                }
            }
        }
    }

    renderPlayerProjectiles() {
        for (var i = 0; i < this.playerProjectiles.length; i++) {
            var particle = this.playerProjectiles[i];

            var offset = new Vec2(this.map.camera.x * 32, this.map.camera.y * 18);
            var p = new Vec2(
                ((particle.pos.x - offset.x) * this.tilesize) + this.globalPos.x,
                ((particle.pos.y - offset.y) * this.tilesize) + this.globalPos.y
            );

            if (this.player.inventory.blazeMedalion) {
                this.draw.drawImage(
                    this.projectiletexture,
                    p,
                    new Vec2(this.tilesize / 2, this.tilesize / 2),
                    new Vec2(0, 0),
                    new Vec2(16, 16)
                );
            }
            else if (this.player.inventory.riverTunic) {
                this.draw.drawImage(
                    this.projectiletexture,
                    p,
                    new Vec2(this.tilesize / 2, this.tilesize / 2),
                    new Vec2(16, 0),
                    new Vec2(16, 16)
                );
            }
            else if (this.player.inventory.blizardWisper) {
                this.draw.drawImage(
                    this.projectiletexture,
                    p,
                    new Vec2(this.tilesize / 2, this.tilesize / 2),
                    new Vec2(32, 0),
                    new Vec2(16, 16)
                );
            } else if (this.player.inventory.ancientAmber) {
                this.draw.drawImage(
                    this.projectiletexture,
                    p,
                    new Vec2(this.tilesize / 2, this.tilesize / 2),
                    new Vec2(48, 0),
                    new Vec2(16, 16)
                );
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

    drawTextNewLine(text: string, line: Vec2) {
        this.draw.fillText(text, line, 255, 255, 255, this.tilesize / 2 + "px Press_Start_2p")
    }
    drawTextLine(text: string, line: Vec2) {
        this.draw.fillText(text, line, 255, 255, 255, this.tilesize / 2 + "px Press_Start_2p")
    }
}
