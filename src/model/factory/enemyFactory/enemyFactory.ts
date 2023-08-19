import { EzIO } from "../../engine/EzIO.js";
import { Vec2 } from "../../engine/geometry.js";
import { Enemy } from "../../entites/enemy/enemy.js";
import { Frog } from "../../entites/enemy/frog.js";

export class EnemyFactory {

    sprites: Array<ImageBitmap> = [];

    async createFactory() {
        this.sprites.push(await EzIO.loadImageFromUrl("./assets/enemy.png"));
        this.sprites.push(await EzIO.loadImageFromUrl("./assets/frog.png"));
        this.sprites.push(await EzIO.loadImageFromUrl("./assets/spider.png"));
        this.sprites.push(await EzIO.loadImageFromUrl("./assets/crawler.png"))
    }

    createEnemy(pos: Vec2, lvl: number, area?: number) {
        var nlvl = lvl
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
            return new Enemy(this.sprites[0], pos, lvl, life, attack, defence)
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