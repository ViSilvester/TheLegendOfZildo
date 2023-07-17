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
export class MapObject extends Entity {
    constructor(pos, dim) {
        super();
        this.pos = pos;
        this.dim = dim;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.img = yield EzIO.loadImageFromUrl('assets/casa_iso.png');
        });
    }
    update(game) {
    }
    render(game) {
        const fpos = game.map.pointToView(this.pos, game);
        const w = this.dim.x * game.tileSize.x;
        const h = this.dim.y * game.tileSize.y;
        if (this.img) {
            game.draw.drawImage(this.img, fpos, new Vec2(w, h));
        }
    }
}
