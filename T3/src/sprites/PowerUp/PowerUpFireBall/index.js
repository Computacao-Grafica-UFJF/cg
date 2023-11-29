import PowerUp from "../index.js";

class PowerUpFireBall extends PowerUp {
    constructor(x, y, z, destroy, actionFunction) {
        super(x, y, z, destroy, actionFunction, "S");
    }
}

export default PowerUpFireBall;
