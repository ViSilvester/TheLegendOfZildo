export class KeybordController {
    static startKeybordListner() {
        document.addEventListener('keydown', (e) => {
            this.addKey(e.key);
        });
        document.addEventListener('keyup', (e) => {
            this.removeKey(e.key);
        });
    }
    static getKeyState(key) {
        return KeybordController.vk.get(key) ? true : false;
    }
    static addKey(key) {
        KeybordController.vk.set(key, key);
    }
    static removeKey(key) {
        KeybordController.vk.delete(key);
    }
}
KeybordController.vk = new Map();
