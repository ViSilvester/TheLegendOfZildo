
import { ChiptuneJsConfig, ChiptuneJsPlayer } from "../../chiptune2.js";
import { EzIO } from "../model/engine/EzIO.js"

export class SoundController {

    //audioCtx: AudioContext;
    dungeon!: AudioBuffer;
    chip!: ArrayBuffer;
    isPlaying: boolean;

    constructor() {
        //this.audioCtx = new AudioContext();
        this.isPlaying = false;
    }

    async loadSounds() {
        var buffer = await EzIO.loadArrayBufferFromUrl("./assets/dungeon.mp3");
        this.chip = await EzIO.loadArrayBufferFromUrl("./assets/chip.it");
        //this.audioCtx.decodeAudioData(buffer, (data) => { this.dungeon = data });
    }

    play() {
        // if (navigator.userActivation.hasBeenActive) {
        //     this.audioCtx.resume();
        //     if (this.audioCtx.state == "running") {
        //         const source = this.audioCtx.createBufferSource();
        //         source.buffer = this.dungeon;
        //         source.loop = true;
        //         source.connect(this.audioCtx.destination);
        //         source.start();
        //         this.isPlaying = true;
        //     }
        // }
    }
}

export class MusicPlayer {

    static player: any;

    static init() {
        setTimeout(() => {
            console.log("config running")
            MusicPlayer.player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1, null, null, null));
            this.loadURL("./assets/chip.it")

        }, 5000)

    };

    static loadURL(path: string) {
        MusicPlayer.player.load(path, this.afterLoad(path))
    }

    static afterLoad(buffer: any) {
        MusicPlayer.player.play(buffer);
    }

}
