import Raycaster from "../../utils/Raycaster/index.js";
import { onWindowResize } from "../../../../libs/util/util.js";
import KeyboardCommands from "../../utils/KeyboardCommands/index.js";
import Pause from "../../sprites/Pause/index.js";
import Game from "../Game/index.js";

class Level {
    constructor() {
        this.paused = false;
        this.finished = false;

        this.raycaster = new Raycaster();
        this.keyboardCommands = new KeyboardCommands();
        this.startListeners(Game.camera, Game.renderer);

        this.init();
    }

    startListeners = (camera, renderer) => {
        window.addEventListener(
            "resize",
            () => {
                onWindowResize(camera, renderer, 31.5);
            },
            false
        );
        window.addEventListener("mousemove", (event) => {
            this.raycaster.onMouseMove(event, this, camera);
        });

        window.addEventListener("mousedown", (event) => {
            this.raycaster.onMouseDown(event, this);
        });
    };

    restart() {
        Game.scene.remove(...this.getElements());
        this.start();
        this.miniBall.resetPosition();
    }

    finish() {
        this.pause();

        this.finished = true;
    }

    pause() {
        if (this.finished) return;

        this.paused ? Game.scene.remove(...Game.scene.children.filter((child) => child instanceof Pause)) : Game.scene.add(new Pause());

        this.paused = !this.paused;

        if (this.miniBall) this.miniBall.pause();

        if (this.hitter) this.hitter.pause();
    }

    init() {
        if (this.finished || this.paused) return;

        if (this.miniBall && this.miniBall.isRaycasterMode) this.miniBall.start();
    }

    death() {
        this.miniBall.raycasterMode();
    }

    keyboardUpdate = (level) => {
        const keyboard = this.keyboardCommands.keyboardState;
        keyboard.update();
        this.keyboardCommands.listenCommands(level);
    };
}

export default Level;
