import { Game } from "./model/game/game.js";
import { Module } from "../libopenmpt.js";
import { ChiptuneJsConfig, ChiptuneJsPlayer } from "../chiptune2.js";

declare global {
    interface Window { libopenmpt: any; }
}

window.libopenmpt = Module;
window.libopenmpt.locateFile = function (filename: string) {
    return "./" + filename;
}
window.libopenmpt.onRuntimeInitialized = function () {
    setTimeout(
        () => {
            console.log("Init")
            init();
        },
        5000
    )
}

var player: ChiptuneJsPlayer

function onLoad(buffer: any) {
    //player.play(buffer);
    console.log(player.metadata())
}

function init() {

    if (player == undefined) {
        player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1, null, null, null));
    }
    console.log("Objetos criados")
    player.load("../assets/chip.it", onLoad);

}

let game = new Game();

game.run();