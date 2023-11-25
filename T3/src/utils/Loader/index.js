import * as THREE from "three";

class Loader {
    static manager;

    static sounds = {};
    static audioLoader;
    static audioPaths;

    static init() {
        this.manager = new THREE.LoadingManager(() => {
            const loadingScreen = document.getElementById("loading-screen");
            loadingScreen.transition = 0;

            const button = document.getElementById("myBtn");
            const buttonText = document.getElementById("buttonText");
            buttonText.innerHTML = "Click to Start";
            button.addEventListener("click", this.onButtonPressed);
        });

        this.loadSounds();
    }

    static onButtonPressed = () => {
        console.log("oi");
        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.transition = 0;
        loadingScreen.classList.add("fade-out");
        loadingScreen.addEventListener("transitionend", (e) => {
            const element = e.target;
            element.remove();
        });
    };

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
        };
    };
}

export default Loader;
