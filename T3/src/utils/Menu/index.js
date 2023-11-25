class Menu {
    static open = true;

    static showStartMenu = () => {
        this.open = true;

        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.classList.remove("fade-out");
    };

    static enableStartMenuToStart = () => {
        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.transition = 0;

        const button = document.querySelector("button");
        button.classList.add("loaded");
        const buttonText = document.getElementById("buttonText");
        buttonText.innerHTML = "Click to Start";
        loadingScreen.addEventListener("click", this.hiddenMenu);
    };

    static hiddenMenu = () => {
        this.open = false;

        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.transition = 0;
        loadingScreen.classList.add("fade-out");
        // loadingScreen.addEventListener("transitionend", (e) => {
        //     const element = e.target;
        //     element.remove();
        // });
    };
}

export default Menu;
