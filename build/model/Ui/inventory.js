export class Inventory {
    constructor() {
        this.lifePotion = 0;
        this.magicPotion = 0;
        this.powerPotion = 0;
        //relics
        this.blazeMedalion = false;
        this.riverTunic = false;
        this.blizardWisper = false;
        this.ancientAmber = false;
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
}
