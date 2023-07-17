export class KeybordController {

    private static vk = new Map<String, String>();

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

    private static addKey(key: String) {
        KeybordController.vk.set(key, key);
    }

    private static removeKey(key: String) {
        KeybordController.vk.delete(key);
    }

}