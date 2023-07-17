import { Vec2 } from "./geometry.js";
export class Draw {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
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
    line(p1, p2, r, g, b) {
        this.ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }
    circle(p1, radius, r, g, b) {
        this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }
    fillBackgroudColor(r, g, b) {
        this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    fillRect(rect, r, g, b) {
        this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        this.ctx.fillRect(rect.pos.x, rect.pos.y, rect.dim.x, rect.dim.y);
    }
    fillShape(shape, r, g, b) {
        this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        this.ctx.beginPath();
        this.ctx.moveTo(shape[0].x, shape[0].y);
        for (var i = 1; i < shape.length; i++) {
            this.ctx.lineTo(shape[i].x, shape[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    fillShapePattern(shape, img) {
        this.ctx.fillStyle = this.ctx.createPattern(img, 'repeat');
        this.ctx.beginPath();
        this.ctx.moveTo(shape[0].x, shape[0].y);
        for (var i = 1; i < shape.length; i++) {
            this.ctx.lineTo(shape[i].x, shape[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    drawImage(img, pos, dim, imgPos, imgDim) {
        if (!dim && !imgPos && !imgDim) {
            this.ctx.drawImage(img, pos.x, pos.y);
        }
        else if (!imgPos && dim) {
            this.ctx.drawImage(img, pos.x, pos.y, dim.x, dim.y);
        }
        else if (imgDim) {
            this.ctx.drawImage(img, imgPos === null || imgPos === void 0 ? void 0 : imgPos.x, imgPos === null || imgPos === void 0 ? void 0 : imgPos.y, imgDim === null || imgDim === void 0 ? void 0 : imgDim.x, imgDim === null || imgDim === void 0 ? void 0 : imgDim.y, pos.x, pos.y, dim === null || dim === void 0 ? void 0 : dim.x, dim === null || dim === void 0 ? void 0 : dim.y);
        }
    }
    fillText(text, pos, r, g, b, font) {
        this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        if (font) {
            this.ctx.font = font;
        }
        else {
            this.ctx.font = "30px Arial";
        }
        this.ctx.fillText(text, pos.x, pos.y);
    }
    strokeText(text, pos, r, g, b, font) {
        this.ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
        if (font) {
            this.ctx.font = font;
        }
        else {
            this.ctx.font = "30px Arial";
        }
        this.ctx.strokeText(text, pos.x, pos.y);
    }
}
