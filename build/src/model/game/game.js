var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KeybordController } from "../../controllers/keyboardController.js";
import { SoundController } from "../../controllers/soundController.js";
import { Engine } from "../engine/engine.js";
import { Rect, Vec2 } from "../engine/geometry.js";
import { GameMap } from "../entites/map/map.js";
import { Player } from "../entites/player/player.js";
export class Game extends Engine {
    constructor() {
        super('canvas');
        //configuração para baixa resolução
        this.draw.getContext().webkitImageSmoothingEnabled = false;
        this.draw.getContext().mozImageSmoothingEnabled = false;
        this.draw.getContext().imageSmoothingEnabled = false;
        KeybordController.startKeybordListner();
        this.soundController = new SoundController();
        this.player = new Player(new Vec2(2, 5));
        this.tilesize = this.draw.width / 32;
        this.map = new GameMap(new Vec2(0, 0));
        this.globalPos = new Vec2(0, 200);
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.map.create();
            yield this.player.create();
            yield this.soundController.loadSounds();
        });
    }
    update() {
        // if (!this.soundController.isPlaying) {
        //     this.soundController.play();
        // }
        this.player.update(this);
        this.map.update(this);
    }
    render() {
        this.draw.fillBackgroudColor(15, 15, 15);
        this.map.render(this);
        this.player.render(this);
        this.drawStatusBar();
    }
    drawStatusBar() {
        this.draw.fillRect(new Rect(new Vec2(0, 0), new Vec2(this.draw.width, this.globalPos.y)), 15, 15, 15);
        this.draw.fillText("HP: " + this.player.life, new Vec2(20, 50), 255, 255, 255);
        this.draw.fillText("MP: " + this.player.mana, new Vec2(20, 90), 255, 255, 255);
        this.draw.fillText("XP: " + this.player.experience + "/ 100", new Vec2(20, 130), 255, 255, 255);
    }
}
