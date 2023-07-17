import { Vec2 } from "../engine/geometry.js";
export class Renderer {
    constructor(id) {
        this.canvas = document.getElementById(id);
        var gl = this.canvas.getContext("webgl");
        if (!gl) {
            throw new Error('webGL not supported');
        }
        this.ctx = gl;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    getContext() {
        return this.ctx;
    }
    getMousePos(pos) {
        var rect = this.canvas.getBoundingClientRect();
        return new Vec2(pos.x - rect.left, pos.y - rect.top);
    }
    setClearColor(r, g, b) {
        this.ctx.clearColor(r, g, b, 1.0);
    }
    clear() {
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    }
}
