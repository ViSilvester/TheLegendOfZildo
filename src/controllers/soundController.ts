
import { ChiptuneJsConfig, ChiptuneJsPlayer } from "../../chiptune2.js";
import { EzIO } from "../model/engine/EzIO.js"

export class SoundController {

    audioCtx: AudioContext;
    overworld!: AudioBuffer;
    source!: AudioBufferSourceNode;
    chip!: ArrayBuffer;
    isPlaying: boolean;

    constructor() {
        this.audioCtx = new AudioContext();
        this.isPlaying = false;
    }

    async loadSounds() {
        var buffer = await EzIO.loadArrayBufferFromUrl("./assets/sound/bgm/overworld.ogg");
        this.audioCtx.decodeAudioData(buffer, (data) => { this.overworld = data });
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
