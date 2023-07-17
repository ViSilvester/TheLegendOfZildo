import { Engine } from "./engine.js";

export abstract class Entity {

    abstract create(): void;

    abstract update(engine: Engine): void;

    abstract render(engine: Engine): void;

}