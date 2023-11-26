import Loader from "../Loader/index.js";

class SoundPlayer {
    static playByKey = (type) => {
        if (Loader.sounds[type]) this.play(Loader.sounds[type]);
    };

    static play(sound) {
        if (sound) {
            if (sound.isPlaying) {
                sound.stop();
            }

            sound.play();
            sound.setLoop(false);
        }
    }
}

export default SoundPlayer;
