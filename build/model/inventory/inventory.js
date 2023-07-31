import { KeybordController } from "../../controllers/keyboardController.js";
import { Rect, Vec2 } from "../engine/geometry.js";
export class Inventory {
    constructor() {
        this.lifePotion = 20;
        this.magicPotion = 20;
        this.powerPotion = 0;
        //relics
        this.blazeMedalion = true;
        this.riverTunic = false;
        this.blizardWisper = false;
        this.ancientAmber = false;
        //keybordTogle
        this.virtualKeyboard = new Map();
        //Ui data
        this.status = "inventory";
        this.transitionTimer = 0;
        this.inventoryPos = new Vec2(1, 1);
        this.inventoryDim = new Vec2(18, 20);
        this.sel = 0;
        this.game_saved_note = 0;
        this.vitality = 0;
        this.strength = 0;
        this.magic_power = 0;
        this.defence = 0;
        this.inteligence = 0;
    }
    reset(mode) {
        this.status = mode;
        this.sel = 0;
        this.vitality = 0;
        this.strength = 0;
        this.magic_power = 0;
        this.defence = 0;
        this.inteligence = 0;
    }
    getKeyPress(key) {
        if (!this.virtualKeyboard.get(key)) {
            this.virtualKeyboard.set(key, "");
            return false;
        }
        else if (this.virtualKeyboard.get(key) == key) {
            return true;
        }
        else {
            return false;
        }
    }
    updateKeyPress() {
        var keys = Array.from(this.virtualKeyboard.keys());
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (KeybordController.getKeyState(key) && this.virtualKeyboard.get(key) == "") {
                this.virtualKeyboard.set(key, key);
            }
            else if (KeybordController.getKeyState(key) && this.virtualKeyboard.get(key) == key) {
                this.virtualKeyboard.set(key, "rep");
            }
            else if (!KeybordController.getKeyState(key)) {
                this.virtualKeyboard.set(key, "");
            }
        }
    }
    getLifePotion() {
        return this.lifePotion;
    }
    getMagicPotion() {
        return this.magicPotion;
    }
    addPotion(id) {
        switch (id) {
            case 1:
                this.lifePotion++;
                break;
            case 2:
                this.magicPotion++;
                break;
            case 2:
                this.powerPotion++;
                break;
        }
    }
    drinkPotion(player, potionId) {
        switch (potionId) {
            case 1:
                if (this.lifePotion > 0) {
                    this.lifePotion--;
                    player.life += 0.2 * player.maxLife;
                    player.life = player.life > player.maxLife ? player.maxLife : player.life;
                }
                break;
            case 2:
                if (this.magicPotion > 0) {
                    this.magicPotion--;
                    player.life += 0.2 * player.maxMagic;
                    player.life = player.life > player.maxMagic ? player.maxMagic : player.life;
                }
                break;
            case 2:
                this.powerPotion--;
                break;
        }
    }
    update(game) {
        if (this.transitionTimer == 20) {
            this.updateKeyboardinput(game);
            //limita valor da seleção
            if (this.sel < 0) {
                this.sel = 0;
            }
            if (this.sel > 10) {
                this.sel = 10;
            }
            if (this.status == "inventory") {
                if (this.sel < 7) {
                    this.sel = 7;
                }
            }
            if (this.status == "confirm") {
                if (this.sel < 5) {
                    this.sel = 5;
                }
                if (this.sel > 6) {
                    this.sel = 6;
                }
            }
            else if (this.status == "lvlUp") {
                if (this.sel > 4) {
                    this.sel = 4;
                }
            }
            if (this.game_saved_note > 0) {
                this.game_saved_note--;
            }
        }
    }
    updateKeyboardinput(game) {
        var sum = this.vitality + this.strength + this.defence + this.inteligence + this.magic_power;
        this.updateKeyPress();
        if (this.status == "confirm") {
            if (this.getKeyPress('d')) {
                this.sel++;
            }
            else if (this.getKeyPress('a')) {
                this.sel--;
            }
            else if (this.getKeyPress('k')) {
                if (this.sel == 5) {
                    this.status = 'lvlUp';
                }
                if (this.sel == 6) {
                    game.player.vitality += this.vitality;
                    game.player.strength += this.strength;
                    game.player.defence += this.defence;
                    game.player.inteligence += this.inteligence;
                    game.player.magic_power += this.magic_power;
                    game.player.powerPoints -= sum;
                    if (game.player.powerPoints == 0) {
                        game.player.life = game.player.maxLife;
                        game.player.magic = game.player.maxMagic;
                    }
                    this.reset('inventory');
                }
            }
        }
        if (this.status != "confirm") {
            if (this.getKeyPress('s')) {
                this.sel++;
            }
            else if (this.getKeyPress('w')) {
                this.sel--;
            }
            else if (this.getKeyPress("k") && this.sel == 10) {
                this.game_saved_note = 100;
            }
        }
        if (this.status == "inventory") {
            if (this.getKeyPress("k") && this.sel == 7 && this.lifePotion > 0 && game.player.life < game.player.maxLife) {
                this.lifePotion--;
                game.player.life += 5;
                game.player.life = game.player.life > game.player.maxLife ? game.player.maxLife : game.player.life;
            }
            else if (this.getKeyPress("k") && this.sel == 8 && this.magicPotion > 0 && game.player.magic < game.player.maxMagic) {
                this.magicPotion--;
                game.player.magic += 5;
                game.player.magic = game.player.magic > game.player.maxMagic ? game.player.maxMagic : game.player.magic;
            }
        }
        if (this.status == "lvlUp") {
            var bonus = 0;
            if (this.getKeyPress("k") && this.sel < 5) {
                this.status = "confirm";
                this.sel = 5;
            }
            else if (this.getKeyPress('d') && sum < game.player.powerPoints) {
                bonus = 1;
            }
            else if (this.getKeyPress('a')) {
                bonus = -1;
            }
            if (bonus != 0) {
                switch (this.sel) {
                    case 0:
                        this.vitality += bonus;
                        break;
                    case 1:
                        this.strength += bonus;
                        break;
                    case 2:
                        this.defence += bonus;
                        break;
                    case 3:
                        this.inteligence += bonus;
                        break;
                    case 4:
                        this.magic_power += bonus;
                        break;
                }
                if (this.vitality < 0) {
                    this.vitality = 0;
                }
                ;
                if (this.strength < 0) {
                    this.strength = 0;
                }
                ;
                if (this.defence < 0) {
                    this.defence = 0;
                }
                ;
                if (this.inteligence < 0) {
                    this.inteligence = 0;
                }
                ;
                if (this.magic_power < 0) {
                    this.magic_power = 0;
                }
                ;
            }
        }
    }
    renderInventory(game) {
        if (this.transitionTimer < 20) {
            this.transitionTimer++;
            this.renderMoldura(game, Math.floor(this.transitionTimer));
            return;
        }
        var sum = this.vitality + this.strength + this.defence + this.inteligence + this.magic_power;
        this.renderMoldura(game, Math.floor(this.transitionTimer));
        var line = new Vec2((this.inventoryPos.x + 1) * game.tilesize, (this.inventoryPos.y + 1) * game.tilesize);
        //calcula string bonus
        var str1 = this.vitality > 0 ? (" +" + this.vitality) : "";
        var str2 = this.strength > 0 ? (" +" + this.strength) : "";
        var str3 = this.defence > 0 ? (" +" + this.defence) : "";
        var str4 = this.inteligence > 0 ? (" +" + this.inteligence) : "";
        var str5 = this.magic_power > 0 ? (" +" + this.magic_power) : "";
        //Header
        game.drawTextNewLine("Zildo", line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine("Lvl: " + game.player.level, line);
        line.y += game.tilesize;
        //basic stats
        game.drawTextNewLine("HP: " + game.player.life + "/" + game.player.maxLife, line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine("MP: " + game.player.magic + "/" + game.player.maxMagic, line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine("XP: " + game.player.experience + "/" + game.player.ExpToLvlUp, line);
        line.y += game.tilesize;
        //player build
        game.drawTextNewLine((this.sel == 0 ? "> " : "  ") + "Vit: " + game.player.vitality + str1, line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine((this.sel == 1 ? "> " : "  ") + "Str: " + game.player.strength + str2, line);
        line.y += game.tilesize / 2;
        //Power pints
        line.x += game.tilesize * 8;
        game.drawTextNewLine("PP: " + (game.player.powerPoints - sum), line);
        line.x -= game.tilesize * 8;
        //player build cont
        game.drawTextNewLine((this.sel == 2 ? "> " : "  ") + "Def: " + game.player.defence + str3, line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine((this.sel == 3 ? "> " : "  ") + "Int: " + game.player.inteligence + str4, line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine((this.sel == 4 ? "> " : "  ") + "MgP: " + game.player.magic_power + str5, line);
        line.y += game.tilesize * 2;
        if (this.status == "confirm") {
            //Confirm to power Up
            game.drawTextNewLine("Confirm ?", line);
            line.y += game.tilesize;
            line.x += game.tilesize;
            game.drawTextNewLine((this.sel == 5 ? "> " : "  ") + "No", line);
            line.x += game.tilesize * 4;
            game.drawTextNewLine((this.sel == 6 ? "> " : "  ") + "Yes", line);
            line.x -= game.tilesize * 5;
            line.y += game.tilesize * 2;
        }
        else {
            line.y += game.tilesize * 3;
        }
        //inventory
        game.drawTextNewLine("Inventory", line);
        line.y += game.tilesize;
        game.drawTextNewLine((this.sel == 7 ? "> " : "  ") + "Health Potion: " + this.lifePotion, line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine((this.sel == 8 ? "> " : "  ") + "Magic Potion: " + this.magicPotion, line);
        line.y += game.tilesize / 2;
        game.drawTextNewLine((this.sel == 9 ? "> " : "  ") + "Power Potion: " + this.powerPotion, line);
        line.y += game.tilesize / 2;
        //Save
        line.y += game.tilesize * 5;
        line.x += game.tilesize;
        game.drawTextNewLine((this.sel == 10 ? "> " : "  ") + "Save", line);
        line.x += game.tilesize * 5;
        this.game_saved_note > 0 ? game.drawTextNewLine("Game saved!", line) : "";
    }
    renderMoldura(game, maxSize) {
        var max = maxSize < this.inventoryDim.y ? maxSize : this.inventoryDim.y;
        for (var i = 0; i < this.inventoryDim.x; i++) {
            for (var j = 0; j < max; j++) {
                var pos = new Vec2((this.inventoryPos.x + i) * game.tilesize, (this.inventoryPos.y + j) * game.tilesize);
                var dim = new Vec2(game.tilesize, game.tilesize);
                //Cantos
                if (i == 0 && j == 0) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(0, 32), new Vec2(16, 16));
                }
                else if (i == this.inventoryDim.x - 1 && j == 0) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(16, 32), new Vec2(16, 16));
                }
                else if (i == this.inventoryDim.x - 1 && j == this.inventoryDim.y - 1) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(48, 32), new Vec2(16, 16));
                }
                else if (i == 0 && j == this.inventoryDim.y - 1) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(32, 32), new Vec2(16, 16));
                }
                // meios externos
                else if (i > 0 && i < this.inventoryDim.y - 1 && j == 0) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(0, 48), new Vec2(16, 16));
                }
                else if (i > 0 && i < this.inventoryDim.y - 1 && j == this.inventoryDim.y - 1) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(16, 48), new Vec2(16, 16));
                }
                else if (i == this.inventoryDim.x - 1 && j > 0 && j < this.inventoryDim.y - 1) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(32, 48), new Vec2(16, 16));
                }
                else if (i == 0 && j > 0 && j < this.inventoryDim.y - 1) {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(48, 48), new Vec2(16, 16));
                }
                else {
                    game.draw.drawImage(game.ui_texture, pos, dim, new Vec2(64, 32), new Vec2(16, 16));
                }
            }
        }
    }
    renderStatusBar(game) {
        game.draw.fillRect(new Rect(new Vec2(0, 0), new Vec2(game.draw.width, game.globalPos.y)), 0, 0, 0);
        var line = game.tilesize;
        var ki_1 = game.player.inventory.blazeMedalion ? 0 : 1;
        var ki_2 = game.player.inventory.riverTunic ? 0 : 1;
        var ki_3 = game.player.inventory.blizardWisper ? 0 : 1;
        var ki_4 = game.player.inventory.ancientAmber ? 0 : 1;
        //Key items
        const ui_scale = 1.5;
        game.draw.drawImage(game.ui_texture, new Vec2(game.tilesize * 10, game.tilesize * 1.5), new Vec2(game.tilesize * ui_scale, game.tilesize * ui_scale), new Vec2(0, 0), new Vec2(16, 16));
        game.draw.drawImage(game.ui_texture, new Vec2(game.tilesize * 12.5, game.tilesize * 1.5), new Vec2(game.tilesize * ui_scale, game.tilesize * ui_scale), new Vec2(16, ki_1 * 16), new Vec2(16, 16));
        game.draw.drawImage(game.ui_texture, new Vec2(game.tilesize * 15, game.tilesize * 1.5), new Vec2(game.tilesize * ui_scale, game.tilesize * ui_scale), new Vec2(32, ki_2 * 16), new Vec2(16, 16));
        game.draw.drawImage(game.ui_texture, new Vec2(game.tilesize * 17.5, game.tilesize * 1.5), new Vec2(game.tilesize * ui_scale, game.tilesize * ui_scale), new Vec2(48, ki_3 * 16), new Vec2(16, 16));
        game.draw.drawImage(game.ui_texture, new Vec2(game.tilesize * 20, game.tilesize * 1.5), new Vec2(game.tilesize * ui_scale, game.tilesize * ui_scale), new Vec2(64, ki_4 * 16), new Vec2(16, 16));
        //Player stats
        game.draw.fillText("Lvl:" + game.player.level, new Vec2(20, line), 255, 255, 255, game.tilesize / 2 + "px Press_Start_2p");
        line += game.tilesize;
        game.draw.fillText("HP:" + game.player.life + " / " + game.player.maxLife, new Vec2(20, line), 255, 255, 255, game.tilesize / 2 + "px Press_Start_2p");
        line += game.tilesize / 2;
        game.draw.fillText("MP:" + game.player.magic + " / " + game.player.maxMagic, new Vec2(20, line), 255, 255, 255, game.tilesize / 2 + "px Press_Start_2p");
        line += game.tilesize / 2;
        game.draw.fillText("XP:" + game.player.experience + " / " + game.player.ExpToLvlUp, new Vec2(20, line), 255, 255, 255, game.tilesize / 2 + "px Press_Start_2p");
        line += game.tilesize / 2;
        game.draw.fillText("PP:" + game.player.powerPoints, new Vec2(20, line), 255, 255, 255, game.tilesize / 2 + "px Press_Start_2p");
    }
}
