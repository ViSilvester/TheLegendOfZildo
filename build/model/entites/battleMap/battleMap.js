var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KeybordController } from "../../../controllers/keyboardController.js";
import { Entity } from "../../engine/entity.js";
import { EzIO } from "../../engine/EzIO.js";
import { Vec2 } from "../../engine/geometry.js";
export class BattleMap extends Entity {
    constructor(enemyIndex) {
        super();
        this.map = [];
        this.pos = new Vec2(8, 8);
        this.enemyHP = 50;
        this.enemyIndex = enemyIndex;
        this.phase = "player_choise";
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tileset = yield EzIO.loadImageFromUrl('./assets/tileset2.png');
            this.map = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1],
                [1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1],
                [1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1],
                [1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1],
                [1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ];
        });
    }
    update(game) {
        switch (this.phase) {
            case 'player_choise':
                if (KeybordController.getKeyState('Enter')) {
                    this.phase = 'enemy_choise';
                }
                break;
            case 'enemy_choise':
                this.phase = 'battle';
                break;
            case 'battle':
                game.playerHP -= 10;
                this.enemyHP -= 10;
                this.phase = 'player_choise';
                if (this.enemyHP == 0) {
                    this.phase = 'victory';
                }
                if (game.playerHP == 0) {
                    this.phase = 'defeat';
                }
                break;
            case 'victory':
                game.enemys.splice(this.enemyIndex, 1);
                game.currentMode = 'game';
                break;
            case 'defeat':
                game.currentMode = 'game';
                break;
        }
    }
    render(game) {
        this.renderMap(game);
        this.drawUi(game);
        game.draw.circle(this.pointToView(this.pos, game), 5, 255, 0, 0);
    }
    pointToView(pos, game) {
        const camPos = new Vec2(pos.x - game.camera.x, pos.y - game.camera.y);
        const mapPos = new Vec2((game.draw.width / 2) + ((camPos.x - camPos.y) * game.tileSize.x / 2), (game.draw.height / 2) + ((camPos.y + camPos.x) * game.tileSize.y / 2));
        return mapPos;
    }
    renderMap(game) {
        if (this.tileset instanceof ImageBitmap && this.map) {
            for (var i = 0; i < this.map.length; i++) {
                for (var j = 0; j < this.map.length; j++) {
                    var posx = i - this.pos.x;
                    var posy = j - this.pos.y;
                    var tile = this.map[j][i] - 1;
                    var tilex = (tile % 5) * 64;
                    var tiley = (tile / 5) * 32;
                    game.draw.drawImage(this.tileset, new Vec2(((game.draw.width / 2) - game.tileSize.x / 2) + ((posx - posy) * game.tileSize.x / 2), ((game.draw.height / 2)) + ((posy * game.tileSize.y / 2) + (posx * game.tileSize.y / 2))), game.tileSize, new Vec2(tilex, tiley), new Vec2(64, 32));
                }
            }
        }
    }
    drawUi(game) {
        const basePos = new Vec2(50, game.draw.height * 0.75);
        var pos = new Vec2(50, game.draw.height * 0.75);
        game.draw.fillText("Player 1", pos, 255, 255, 255);
        game.draw.strokeText("Player 1", pos, 0, 0, 255);
        pos.y += 30;
        game.draw.fillText("Life: " + game.playerHP, pos, 255, 255, 255);
        game.draw.strokeText("Life: " + game.playerHP, pos, 0, 0, 255);
        pos.y += 30;
        game.draw.fillText("Mana: 10000", pos, 255, 255, 255);
        game.draw.strokeText("Mana: 10000", pos, 0, 0, 255);
        var pos = basePos;
        pos.x = game.draw.width - 250;
        game.draw.fillText("Enemy 1", pos, 255, 255, 255);
        game.draw.strokeText("Enemy 1", pos, 0, 0, 255);
        pos.y += 30;
        game.draw.fillText("Life: " + this.enemyHP, pos, 255, 255, 255);
        game.draw.strokeText("Life: " + this.enemyHP, pos, 0, 0, 255);
        pos.y += 30;
        game.draw.fillText("Mana: 10000", pos, 255, 255, 255);
        game.draw.strokeText("Mana: 10000", pos, 0, 0, 255);
    }
}
