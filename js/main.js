function start() {
    const animated = document.querySelectorAll('.animated');
    animated.item(0).classList.toggle('active');
    playSound('./assets/sounds/login.wav');
    setBackgroundSounds();
    // remove active if animation ended
    for (let i = 0; i < animated.length ; i++) {
        animated[i].addEventListener('animationend', () => {
            animated[i].classList.toggle('active');
            console.log("animation ended");
        })
    }

    // document.getElementById("opening").style.display = 'block';
    // let list = document.getElementById("opening").getElementsByTagName('p');
    // for (const listElement of list) {
    //     listElement.style.animationPlayState = 'running';
    //
    // }
    // backgroundMusic = new Sound("./assets/sounds/hum1.wav");
    // backgroundMusic.play();
    document.getElementsByClassName("screen").style = "display: none;"
}

function playSound(src) {
    let audio = new Audio(src);
    audio.play();
}

(function setBackgroundSounds() {
    let alternator = 0;
    if (alternator === 0) {
        let audio = new Audio('./assets/sounds/hum1.wav');
        audio.play();
        alternator++;
    } else {
        let audio = new Audio('./assets/sounds/hum2.wav');
        audio.play();
        alternator--;
    }
    setTimeout(setBackgroundSounds,2200);
}())

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
};

