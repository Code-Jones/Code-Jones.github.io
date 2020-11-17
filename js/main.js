let notMute = true;

function start() {
    document.getElementById('click-to-start').style.display = 'none';
    const animated = document.querySelectorAll('.animated');
    playSound('./assets/sounds/login.wav');
    playBackgroundSounds();
    // remove active if animation ended
    for (let i = 0; i < animated.length; i++) {
        animated[i].addEventListener('animationend', () => {
            // animated[i].classList.toggle('active');
            animated[i + 1].classList.toggle('active');
        })
    }
    let interval;
    animated.item(0).classList.toggle('active');
    playSound('./assets/sounds/print.wav');
    let time = function timeout() {
        setTimeout(function () {
            playSound('./assets/sounds/print.wav');
            timeout();
        }, 1000);
    }
    animated.item(animated.length - 1).addEventListener('animationend', () => {
        window.clearTimeout(time);
        next();
    });
}



function next() {
    const animated = document.querySelectorAll('.animated');
    

}

function playSound(src) {
    let audio = new Audio(src);
    audio.play();
}

function playBackgroundSounds() {
    let fan = new Audio("./assets/sounds/computer_fan.mp3");
    let hardDrive = new Audio("./assets/sounds/ibm_hard_drive.mp3");
    fan.play();
    hardDrive.loop = true;
    hardDrive.load();
    hardDrive.play();
}
// jQuery(document).ready(function (){
//     var audioArray = document.getElementsByClassName('songs');
//     var i = 0;
//     audioArray[i].play();
//     for (i = 0; i < audioArray.length - 1; ++i) {
//         audioArray[i].addEventListener('ended', function(e){
//             var currentSong = e.target;
//             var next = $(currentSong).nextAll('audio');
//             if (next.length) $(next[0]).trigger('play');
//         });
//     }
// });

function setBackgroundSounds(notMute) {
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
    setTimeout(setBackgroundSounds, 2200);

}

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
};

