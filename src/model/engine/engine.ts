import { Draw } from "./draw.js";
import { Entity } from "./entity.js";

export abstract class Engine {

    draw: Draw;
    entities: Array<Entity>;

    constructor(canvasId: string) {
        this.draw = new Draw(canvasId);
        this.entities = [];
    }

    async create() {

    }

    update() {
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].update(this);
        }
    }

    render() {
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].render(this);
        }
    }

    private mainLoop() {
        requestAnimationFrame(() => {
            this.update();
            this.render();
            this.mainLoop();
        })
    }

    async run() {
        await this.create();
        this.mainLoop();
    }

}
