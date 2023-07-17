export class ChiptuneJsConfig {
    repeatCount: any
    stereoSeparation: any
    interpolationFilter: any
    context: any

    constructor(repeatCount, stereoSeparation, interpolationFilter, context) {

    }
}
export class ChiptuneJsPlayer {
    config: any
    context: any
    currentPlayingNode: any
    handlers: any
    touchLocked: any

    constructor(config) {

    }

    fireEvent: (eventName, response) => void
    addHandler: (eventName, handler) => void
    onEnded: (handler) => void
    onError: (handler) => void
    duration: () => void
    getCurrentRow: () => void
    getCurrentPattern: () => void
    getCurrentOrder: () => void
    getCurrentTime: () => void
    getTotalOrder: () => void
    getTotalPatterns: () => void
    metadata: () => void
    module_ctl_set: (ctl, value) => void
    unlock: () => void
    load: (input, callback) => void
    play: (buffer) => void
    stop: () => void
    togglePause: () => void
    createLibopenmptNode: (buffer, config) => void
}




