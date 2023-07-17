var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Entity } from "../../engine/entity.js";
import { EzIO } from "../../engine/EzIO.js";
import { Vec2 } from "../../engine/geometry.js";
export class GameMap extends Entity {
    constructor(pos, tileSize) {
        super();
        this.map = [];
        this.pos = pos;
        this.tileSize = tileSize;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tileset = yield EzIO.loadImageFromUrl('./assets/tileset2.png');
            const amap = (yield EzIO.loadJsonFromUrl('./assets/mapa.json')).layers[0].data;
            for (var i = 0; i < 100; i++) {
                this.map.push(amap.splice(0, 100));
            }
        });
    }
    update(game) {
        this.pos = game.camera;
    }
    render(game) {
        if (this.tileset instanceof ImageBitmap && this.map) {
            const range = 20;
            const limitLeft = Math.floor(game.camera.x - range < 0 ? 0 : game.camera.x - range);
            const limitRight = Math.floor(game.camera.x + range > this.map.length - 1 ? this.map.length - 1 : game.camera.x + range);
            const limitTop = Math.floor(game.camera.y - range < 0 ? 0 : game.camera.y - range);
            const limitBottom = Math.floor(game.camera.y + range > this.map.length - 1 ? this.map.length - 1 : game.camera.y + range);
            for (var i = limitLeft; i < limitRight; i++) {
                for (var j = limitTop; j < limitBottom; j++) {
                    var posx = i - this.pos.x;
                    var posy = j - this.pos.y;
                    var tile = this.map[j][i] - 1;
                    var tilex = (tile % 5) * 64;
                    var tiley = (tile / 5) * 32;
                    game.draw.drawImage(this.tileset, new Vec2(((game.draw.width / 2) - this.tileSize.x / 2) + ((posx - posy) * this.tileSize.x / 2), ((game.draw.height / 2)) + ((posy * this.tileSize.y / 2) + (posx * this.tileSize.y / 2))), this.tileSize, new Vec2(tilex, tiley), new Vec2(64, 32));
                }
            }
        }
    }
    pointToView(pos, game) {
        const camPos = new Vec2(pos.x - game.camera.x, pos.y - game.camera.y);
        const mapPos = new Vec2((game.draw.width / 2) + ((camPos.x - camPos.y) * game.tileSize.x / 2), (game.draw.height / 2) + ((camPos.y + camPos.x) * game.tileSize.y / 2));
        return mapPos;
    }
}
