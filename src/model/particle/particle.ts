import { Entity } from "../engine/entity.js";
import { Vec2 } from "../engine/geometry.js";
import { Game } from "../game/game.js";

export class Particle extends Entity {

    pos: Vec2;
    dim: Vec2;
    vel: Vec2;
    lifetime: number;
    type: string

    constructor(pos: Vec2, dim: Vec2, vel: Vec2, lifetime: number, type?: string) {
        super();
        this.pos = pos;
        this.dim = dim;
        this.vel = vel;
        this.lifetime = lifetime;
        this.type = type ? type : "fire";
    }

    create(): void {

    }
    update(game: Game): void {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.lifetime--;
    }
    render(game: Game): void {
        var offset = new Vec2(game.map.camera.x * 32, game.map.camera.y * 18);
        var p = new Vec2(
            ((this.pos.x - offset.x) * game.tilesize) + game.globalPos.x,
            ((this.pos.y - offset.y) * game.tilesize) + game.globalPos.y
        );
        game.draw.circle(p, this.dim.x, 255, 0, 0);
    }
}