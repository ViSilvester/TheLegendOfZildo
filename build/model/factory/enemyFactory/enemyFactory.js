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
import { Enemy } from "../../entites/enemy/enemy.js";
import { Frog } from "../../entites/enemy/frog.js";
export class EnemyFactory {
    constructor() {
        this.sprites = [];
    }
    createFactory() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sprites.push(yield EzIO.loadImageFromUrl("./assets/enemy.png"));
            this.sprites.push(yield EzIO.loadImageFromUrl("./assets/frog.png"));
            this.sprites.push(yield EzIO.loadImageFromUrl("./assets/spider.png"));
            this.sprites.push(yield EzIO.loadImageFromUrl("./assets/crawler.png"));
        });
    }
    createEnemy(pos, lvl, area) {
        var nlvl = lvl;
        nlvl += lvl * Math.random() * 0.5;
        nlvl -= lvl - Math.random() * 0.5;
        lvl = Math.floor(nlvl);
        lvl = lvl <= 0 ? 3 : lvl;
        const points = lvl * 3;
        var percent = Math.random();
        percent = percent > 0.5 ? 0.5 : percent;
        percent = percent < 0.35 ? 0.35 : percent;
        const life = Math.floor(points * percent) * 2;
        percent = percent > 0.5 ? 0.5 : percent;
        percent = percent < 0.35 ? 0.35 : percent;
        const attack = Math.floor((points - life) * percent) * 4;
        const defence = points - attack - life;
        if (!area) {
            return new Enemy(this.sprites[0], pos, lvl, life, attack, defence);
        }
        else {
            switch (area) {
                case 176:
                    return new Enemy(this.sprites[0], pos, lvl, life, attack, defence);
                case 177:
                    return new Frog(this.sprites[1], pos, lvl, life, attack, defence);
                case 178:
                    return new Enemy(this.sprites[2], pos, lvl, life, attack, defence);
                case 179:
                    return new Enemy(this.sprites[3], pos, lvl, life, attack, defence);
                default:
                    return new Enemy(this.sprites[0], pos, lvl, life, attack, defence);
            }
        }
    }
}
