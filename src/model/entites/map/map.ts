import { EzIO } from "../../engine/EzIO.js";
import { Entity } from "../../engine/entity.js";
import { Vec2 } from "../../engine/geometry.js";
import { Game } from "../../game/game.js";
import { Enemy } from "../enemy/enemy.js";
import { Player } from "../player/player.js";


export class GameMap extends Entity {

    tileset!: ImageBitmap;
    currentMap!: Array<number>;
    overworldMap!: Array<number>;
    innerAreasMap!: Array<number>;
    overworldEnemyAreasMap!: Array<number>;
    width!: number;
    heigh!: number;
    camera: Vec2;
    lastOverWorldPosition = new Vec2(0, 0);

    constructor(cameraPos: Vec2) {
        super();
        this.camera = cameraPos;
    }

    async create(): Promise<void> {

        this.tileset = await EzIO.loadImageFromUrl("./assets/tileset_01.png");
        var obj = await EzIO.loadJsonFromUrl("./assets/main_map.json");
        this.width = obj.width;
        this.heigh = obj.heigh;
        this.overworldMap = obj.layers[0].data;
        this.innerAreasMap = obj.layers[1].data;
        this.overworldEnemyAreasMap = obj.layers[2].data;
        this.currentMap = this.overworldMap;

    }
    update(game: Game): void {
        this.updateCameraScrolling(game);
    }

    render(game: Game): void {

        var offset = new Vec2(this.camera.x * 32, this.camera.y * 18);

        for (var y = offset.y; y < offset.y + 18; y++) {

            for (var x = offset.x; x < offset.x + 32; x++) {

                var tile = this.getTile(x, y);

                game.draw.drawImage(
                    this.tileset,
                    new Vec2(
                        ((x - offset.x) * game.tilesize) + game.globalPos.x,
                        ((y - offset.y) * game.tilesize) + game.globalPos.y
                    ),
                    new Vec2(game.tilesize, game.tilesize),
                    new Vec2(
                        (tile % 16) * 16,
                        Math.floor(tile / 16) * 16
                    ),
                    new Vec2(16, 16)
                )
            }
        }
    }

    getTile(x: number, y: number): number {
        return this.currentMap[(Math.floor(y) * this.width) + Math.floor(x)] - 1;
    }

    getAreaTile(x: number, y: number): number {
        return this.overworldEnemyAreasMap[(Math.floor(y) * this.width) + Math.floor(x)] - 1;
    }

    checkColision(x: number, y: number) {

        var tile = this.getTile(x, y);

        if (tile != 16 && tile != 24) {
            return true;
        }

        return false;

    }

    private updateCameraScrolling(game: Game) {

        // update camera  

        if ((game.player.direction == "right" && game.player.status != "scrolling" && game.player.pos.x > (this.camera.x + 1) * 32) ||
            (game.player.direction == "left" && game.player.status != "scrolling" && game.player.pos.x + 1 <= this.camera.x * 32) ||
            (game.player.direction == "down" && game.player.status != "scrolling" && game.player.pos.y > (this.camera.y + 1) * 18) ||
            (game.player.direction == "up" && game.player.status != "scrolling" && game.player.pos.y + 1 <= this.camera.y * 18)) {

            game.player.status = "scrolling"

            game.mapCoordMemory.push(new Vec2(this.camera.x, this.camera.y));
            game.mapEnemyMemory.push(game.enemys.length);

            if (game.mapEnemyMemory.length > 6) {
                game.mapCoordMemory.splice(0, 1);
                game.mapEnemyMemory.splice(0, 1);
            }

        }

        if (game.player.status == "scrolling") {
            switch (game.player.direction) {
                case "right":
                    this.camera.x += 0.025;
                    if (Math.floor(game.player.pos.x) == Math.floor(this.camera.x * 32)) {
                        game.player.status = 'idle';
                        this.camera.x = Math.floor(this.camera.x);
                        game.enemySpawn();
                    }
                    break;
                case "left":
                    this.camera.x -= 0.025;
                    if (Math.floor(game.player.pos.x + 2) == Math.floor((this.camera.x + 1) * 32)) {
                        game.player.status = 'idle';
                        this.camera.x = Math.floor(this.camera.x);
                        game.enemySpawn();
                    }
                    break;
                case "down":
                    this.camera.y += 0.025;
                    if (Math.floor(game.player.pos.y) == Math.floor(this.camera.y * 18)) {
                        game.player.status = 'idle';
                        this.camera.y = Math.floor(this.camera.y);
                        game.enemySpawn();
                    }
                    break;
                case "up":
                    this.camera.y -= 0.025;
                    if (Math.floor(game.player.pos.y + 2) == Math.floor((this.camera.y + 1) * 18)) {
                        game.player.status = 'idle';
                        this.camera.y = Math.floor(this.camera.y);
                        game.enemySpawn();
                    }
                    break;
            }
        }
    }

    enterDoor(game: Game) {

        if (this.currentMap == this.overworldMap) {
            this.currentMap = this.innerAreasMap;
            this.lastOverWorldPosition.x = game.player.pos.x;
            this.lastOverWorldPosition.y = game.player.pos.y;
            game.enemys = []
        }
        else {
            this.currentMap = this.overworldMap;
            game.enemys = []
        }

    }
}
