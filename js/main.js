let printSound = new Audio('./assets/sounds/print.wav');
let s1 = new Audio('./assets/sounds/key1.wav'); // change this
let s2 = new Audio('./assets/sounds/key2.wav');
let s3 = new Audio('./assets/sounds/key3.wav');
let s4 = new Audio('./assets/sounds/key4.wav');
let s5 = new Audio('./assets/sounds/key5.wav');
let s6 = new Audio('./assets/sounds/key6.wav');
let s7 = new Audio('./assets/sounds/key7.wav');
let clickSounds = [s1, s2, s3, s4, s5, s6, s7];
printSound.loop = true;
let newIndex = null;
newIndex = makeIndex(newIndex);
let numLines = 17;
let numPiecesAcross = 12;
const words_10 = ["RECRUITING", "FLASHLIGHT", "BINOCULARS", "SUPPRESSOR", "DISPOSABLE", "CAMOUFLAGE", "TOOTHBRUSH", "INCENDIARY", "LIEUTENANT", "OCCUPATION", "ACTIVATING", "ENCOUNTERS", "STRETCHING", "FUTURISTIC", "APARTMENTS", "VEGETABLES", "RESTRICTED", "APOCALYPSE", "CONCERNING", "SCULPTURES", "CURRICULUM", "MECHANICAL", "THEREAFTER", "VANQUISHED", "DETERMINED", "FUNCTIONAL", "COMMISSION"];
const duds = ["[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]"]
let taken = [];
let takenCounter;
let keys;
let key;

function start() {
    document.getElementById('click-to-start').remove();
    const animated = document.querySelectorAll('.animated');
    playSound('./assets/sounds/login.wav');
    playBackgroundSounds();
    // remove active if animation ended
    for (let i = 0; i < animated.length; i++) {
        animated[i].addEventListener('animationstart', () => {
            printSound.play().then(r => (console.log(r + " sounds played")));
        })
        animated[i].addEventListener('animationend', () => {
            // animated[i + 1].classList.add('active');
            animated[i + 1].classList.toggle('active');
            printSound.pause();
        })
    }

    animated.item(0).classList.toggle('active');
    animated.item(animated.length - 1).addEventListener('animationend', () => {
        printSound.pause();
        setTimeout(function () {
            next();
        }, 3000);
    });
}

function next() {
    console.log("Intro finished");
    document.getElementById('opening').remove();
    let gameScreen = document.createElement('div');
    gameScreen.classList.add('gameScreen');
    keys = document.createElement('div');
    let keys_2 = document.createElement('div');
    for (let i = 0; i < numLines * numPiecesAcross + 170; i++) {
        keys.appendChild(makeGameNodes());
        keys_2.appendChild(makeGameNodes());
    }
    key = keys.childNodes;
    let key_2 = keys_2.childNodes;
    // for (let i = 0; i < numLines * numPiecesAcross; i++) {
    //     key[i].addEventListener('animationstart', () => {
    //         printSound.play();
    //     })
    //     key[i].addEventListener('animationend', () => {
    //         key[i + 1].classList.toggle('active');
    //         printSound.pause();
    //     })
    //     key_2[i].addEventListener('animationstart', () => {
    //         printSound.play();
    //     })
    //     key_2[i].addEventListener('animationend', () => {
    //         key_2[i + 1].classList.toggle('active');
    //         printSound.pause();
    //     })
    // }
    let keysChildren = keys.childNodes;
    let keys_2Children = keys_2.childNodes;
    for (let i = 0; i < 6; i++) {
        replaceWithFiller(keysChildren, "word");
        replaceWithFiller(keysChildren, "dud");
        replaceWithFiller(keys_2Children, "word");
        replaceWithFiller(keys_2Children, "dud");
    }
    gameScreen.appendChild(makeIndexLines());
    gameScreen.appendChild(keys);
    let space = document.createElement('div');
    gameScreen.appendChild(space);
    gameScreen.appendChild(makeIndexLines());
    gameScreen.appendChild(keys_2);
    document.getElementById('screen').appendChild(gameScreen);

    keys[0].classList.toggle('active');
    keys_2[0].classList.toggle('active');
    keys.item(keys.length - 1).addEventListener('animationend', () => {
        printSound.pause();
        // setTimeout(function () {
        //     next();
        // }, 3000);
    });
}

function makeIndexLines() {
    let line = document.createElement('div');
    for (let i = 0; i < numLines; i++) {
        let index = document.createElement('p');
        index.innerText = makeIndex(newIndex);
        line.append(index);
    }
    return line;
}

function replaceWithFiller(children, type) {
    let randomIndex = Math.floor(Math.random() * children.length);
    while (taken.includes(randomIndex)) { // stop having two fillers right beside each other
        randomIndex = Math.floor(Math.random() * children.length);
    }
    takenCounter += 2;
    taken[takenCounter] = randomIndex;
    taken[takenCounter + 1] = randomIndex + 1;
    children[randomIndex].childNodes[0].innerText = type === "word" ? words_10.pop() : duds.pop();
}

function makeGameNodes() {
    const extra = ["{", "}", "[", "]", "'", ":", ";", "/", "?", ".", ",", "<", ">", "(", ")", "-", "_", "*", "&", "^", "%", "$", "#", "@", "!", "~", "`", "|", "\\", "="];
    let piece = document.createElement('p');
    piece.classList.add('piece');
    let span = document.createElement('span');
    span.innerText = extra[Math.floor(Math.random() * extra.length)];
    span.addEventListener('mouseover', function () {
        clickSounds[Math.floor(Math.random() * clickSounds.length)].play();
    });
    piece.appendChild(span);
    return piece;
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function makeIndex(line) {
    if (line === null) {
        let line = "0x" + Math.random().toString(36).substring(2, 3).toUpperCase() + Math.random().toString(36).substring(2, 3).toUpperCase();
        for (let i = 0; i < 2; i++) {
            line += Math.random().toString(36).substring(2, 3).toUpperCase();
        }
        return line;
    } else {
        let temp = line.split("");
        temp[4] = Math.random().toString(36).substring(2, 3).toUpperCase();
        temp[5] = Math.random().toString(36).substring(2, 3).toUpperCase();
        line = temp.join("");
        return line;
    }
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


