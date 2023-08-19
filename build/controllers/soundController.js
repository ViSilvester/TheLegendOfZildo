var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EzIO } from "../model/engine/EzIO.js";
export class SoundController {
    constructor() {
        this.audioCtx = new AudioContext();
        this.isPlaying = false;
    }
    loadSounds() {
        return __awaiter(this, void 0, void 0, function* () {
            var buffer = yield EzIO.loadArrayBufferFromUrl("./assets/sound/bgm/overworld.ogg");
            this.audioCtx.decodeAudioData(buffer, (data) => { this.overworld = data; });
        });
    }
    play() {
        if (navigator.userActivation.hasBeenActive) {
            this.audioCtx.resume();
            if (this.audioCtx.state == "running") {
                this.source = this.audioCtx.createBufferSource();
                this.source.buffer = this.overworld;
                this.source.loop = true;
                this.source.connect(this.audioCtx.destination);
                this.source.start();
                this.isPlaying = true;
            }
        }
    }
    pause() {
        this.source.stop();
    }
}
// export class MusicPlayer {
//     static player: any;
//     static init() {
//         setTimeout(() => {
//             console.log("config running")
//             MusicPlayer.player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1, null, null, null));
//             this.loadURL("./assets/chip.it")
//         }, 5000)
//     };
//     static loadURL(path: string) {
//         MusicPlayer.player.load(path, this.afterLoad(path))
//     }
//     static afterLoad(buffer: any) {
//         MusicPlayer.player.play(buffer);
//     }
// }
