export class KeybordController {

    private static vk = new Map<String, String>();
    private static vkReapeat = new Map<String, String>();

    static startKeybordListner() {

        document.addEventListener('keydown', (e) => {
            this.addKey(e.key);
        });

        document.addEventListener('keyup', (e) => {
            this.removeKey(e.key);
        });
    }

    static getKeyState(key: String) {
        return KeybordController.vk.get(key) ? true : false;
    }

    static getKeyPress(key: String) {

        if (!this.vkReapeat.get(key) && this.vk.get(key) == key) {
            KeybordController.vkReapeat.set(key, key)
            return true;
        }
        return false
    }

    private static addKey(key: String) {
        if (this.vk.get(key) == key) {
            KeybordController.vkReapeat.set(key, key);
        }
        else {
            KeybordController.vk.set(key, key);
        }

    }

    private static removeKey(key: String) {
        KeybordController.vk.delete(key);
        KeybordController.vkReapeat.delete(key);

    }

}