import * as THREE from "three";
import Menu from "../Menu/index.js";

class Loader {
    static manager;

    static sounds = {};
    static audioLoader;
    static audioPaths;

    static init() {
        this.manager = new THREE.LoadingManager(() => Menu.enableStartMenuToStart());

        this.loadSounds();
    }

    static loadSounds = () => {
        const loadSoundsPackages = (paths) => {
            return paths.map((path) => {
                const sound = new THREE.Audio(new THREE.AudioListener());
                this.audioLoader.load(path, function (buffer) {
                    sound.setBuffer(buffer);
                    sound.setLoop(true);
                });
                return sound;
            });
        };

        this.audioLoader = new THREE.AudioLoader(this.manager);
        this.audioPaths = [
            "../../../assets/sounds/rebatedor.mp3",
            "../../../assets/sounds/bloco1.mp3",
            "../../../assets/sounds/bloco2.mp3",
            "../../../assets/sounds/bloco3.mp3",
        ];

        const soundsPackages = loadSoundsPackages(this.audioPaths);

        this.sounds = {
            normalBlock: soundsPackages[1],
            durableBlock: soundsPackages[2],
            indestructibleBlock: soundsPackages[2],
            hitter: soundsPackages[0],
            fireBall: soundsPackages[3],
        };
    };
}

export default Loader;
