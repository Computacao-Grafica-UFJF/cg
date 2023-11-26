import PowerUp from "../index.js";

class PowerUpMultipleBalls extends PowerUp {
    constructor(x, y, z, destroy, actionFunction) {
        super(x, y, z, destroy, actionFunction, "orange");
    }
}

export default PowerUpMultipleBalls;
