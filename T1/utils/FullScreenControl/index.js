class FullScreenControl {
    constructor() {
        this.isFullScreen = false;
    }

    toggleFullScreen() {
        this.isFullScreen ? this.exitFullScreen() : this.goFullScreen();
        this.isFullScreen = !this.isFullScreen;
    }

    goFullScreen() {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            return;
        }

        if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
            return;
        }

        if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
            return;
        }
    }

    exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            return;
        }

        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            return;
        }

        if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            return;
        }
    }
}

export default FullScreenControl;
