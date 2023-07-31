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
    static getKeyPress(key) {
        if (!this.vkReapeat.get(key) && this.vk.get(key) == key) {
            KeybordController.vkReapeat.set(key, key);
            return true;
        }
        return false;
    }
    static addKey(key) {
        if (this.vk.get(key) == key) {
            KeybordController.vkReapeat.set(key, key);
        }
        else {
            KeybordController.vk.set(key, key);
        }
    }
    static removeKey(key) {
        KeybordController.vk.delete(key);
        KeybordController.vkReapeat.delete(key);
    }
}
KeybordController.vk = new Map();
KeybordController.vkReapeat = new Map();
