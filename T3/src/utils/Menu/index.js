class Menu {
    static open = true;
    static died = false;

    static showStartMenu = () => {
        this.open = true;

        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.classList.remove("fade-out");
    };

    static showGameOverMenu = () => {
        this.open = true;
        this.died = true;

        const gameOverScreen = document.getElementById("loading-screen");
        gameOverScreen.classList.remove("fade-out");

        const astronaut = document.getElementById("astronaut");
        astronaut.classList.add("fade-in");

        const universe = document.getElementById("universe");
        universe.classList.add("fade-out");

        const buttonText = document.getElementById("buttonText");
        buttonText.innerHTML = "Try Again";
        gameOverScreen.addEventListener("click", this.hiddenMenu);
    };

    static enableStartMenuToStart = () => {
        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.transition = 0;

        const button = document.querySelector("button");
        button.classList.add("loaded");
        const buttonText = document.getElementById("buttonText");
        buttonText.innerHTML = !this.died ? "Click to Start" : "Try Again";
        loadingScreen.addEventListener("click", this.hiddenMenu);
    };

    static hiddenMenu = () => {
        this.open = false;

        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.transition = 0;
        loadingScreen.classList.add("fade-out");
    };
}

export default Menu;
