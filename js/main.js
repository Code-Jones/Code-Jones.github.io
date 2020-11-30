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
const duds = ["[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]", "[<>]"]
let taken = [];
let takenCounter = 0;
let keysBox;
let key;
let animated = [];
const gameTopLines = ["ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL", "ENTER PASSWORD NOW", "4 ATTEMPT(S) LEFT : "];

function start() {
    document.getElementById('click-to-start').remove();
    animated = document.querySelectorAll('.animated');
    playSound('./assets/sounds/login.wav');
    playBackgroundSounds();
    // remove active if animation ended
    for (let i = 0; i < animated.length; i++) {
        animated[i].addEventListener('animationstart', () => {
            printSound.play().then(r => (console.log(r + " sounds played")));
        });
        animated[i].addEventListener('animationend', () => {
            // animated[i + 1].classList.add('active');
            animated[i + 1].classList.toggle('active');
            printSound.pause();
        });
    }

    animated.item(0).classList.toggle('active');
    animated.item(animated.length - 1).addEventListener('animationend', () => {
        printSound.pause();
        setTimeout(function () {
            openGameScene();
        }, 3000);
    });

}

function openGameScene() {
    // top text being printed
    console.log("Intro finished");
    animated = [];
    document.getElementById('opening').remove();
    let topText = document.createElement('div');
    topText.classList.add('gameTopText');
    for (let i = 0; i < gameTopLines.length; i++) {
        let line = document.createElement('p');
        line.innerText = gameTopLines[i];
        animated[i] = line;
        topText.appendChild(line);
    }

    // attempt boxes
    let attemptBox = document.createElement('div');
    attemptBox.id = "attemptBox";
    attemptBox.classList.add('attemptBox');``
    for (let i = 0; i < 4; i++) {
        let attempt = document.createElement('span');
        attempt.innerText = ' ';
        attempt.classList.add('attempt');
        attemptBox.appendChild(attempt);
    }
    animated[animated.length - 1].appendChild(attemptBox);
    animated[animated.length - 1].style.display = "inline-flex";

    // animations
    for (let i = 0; i < animated.length; i++) {
        animated[i].addEventListener('animationstart', () => {
            printSound.play().then(r => (console.log(r + " sounds played")));
        });
        animated[i].addEventListener('animationend', () => {
            animated[i + 1].classList.toggle('active');
            printSound.pause();
        });
    }
    document.getElementById('screen').appendChild(topText);
    animated[0].classList.toggle('active');
    animated[animated.length - 1].addEventListener('animationend', () => {
        printSound.pause();
        setTimeout(function () {
            printGameBoard();
        }, 3400);
    });
}

function printGameBoard() {
    // no fancy animations yet
    let gameScreen = document.createElement('div');
    gameScreen.classList.add('gameScreen');
    keysBox = document.createElement('div');
    keysBox.classList.add('gamePcBox');
    let keys_2 = document.createElement('div');
    keys_2.classList.add('gamePcBox');
    for (let i = 0; i < numLines * numPiecesAcross + 180; i++) {
        keysBox.appendChild(makeGameNodes());
        keys_2.appendChild(makeGameNodes());
    }
    let keysChildren = keysBox.childNodes;
    let keys_2Children = keys_2.childNodes;
    for (let i = 0; i < 6; i++) {
        replaceWithFiller(keysChildren, "word");
        replaceWithFiller(keysChildren, "dud");
        replaceWithFiller(keys_2Children, "word");
        replaceWithFiller(keys_2Children, "dud");
    }
    gameScreen.appendChild(makeIndexLines());
    gameScreen.appendChild(keysBox);
    gameScreen.appendChild(document.createElement('div'));
    gameScreen.appendChild(makeIndexLines());
    gameScreen.appendChild(keys_2);
    gameScreen.appendChild(makeSideTerminal());
    document.getElementById('screen').appendChild(gameScreen);
}

function makeSideTerminal() {
    // over all box
    let sideTerm = document.createElement('div');
    sideTerm.classList.add('sideTermBox');
    // bottom input
    let inputBox = document.createElement('div');
    inputBox.classList.add('inputBox');
    let arrow = document.createElement('p');
    let input = document.createElement('p');
    input.id = 'input';
    arrow.innerText = ">";
    inputBox.appendChild(arrow);
    inputBox.appendChild(input);
    // output
    let output = document.createElement('div');
    let outputText = document.createElement('p');
    output.classList.add('outputBox')
    output.appendChild(outputText);

    sideTerm.appendChild(output);
    sideTerm.appendChild(inputBox);
    return sideTerm;
}

function replaceWithFiller(children, type) {
    // replaces random indexes with words & duds
    shuffle(words_10);
    let randomIndex = Math.floor(Math.random() * children.length);
    while (taken.includes(randomIndex)) { // stop having two fillers right beside each other
        randomIndex = Math.floor(Math.random() * children.length);
    }
    taken[takenCounter] = randomIndex;
    taken[takenCounter + 1] = randomIndex + 1;
    takenCounter = takenCounter + 2;
    if (type === "word") {
        children[randomIndex].childNodes[0].innerText = words_10.pop();
        children[randomIndex].childNodes[0].addEventListener("click", () => {
           console.log(children[randomIndex].childNodes[0].innerText + " clicked");
           // try word for solution
        });
        children[randomIndex].childNodes[0].classList.add('gameWord');
    } else if (type === "dud") {
        children[randomIndex].childNodes[0].innerText = duds[0];
        children[randomIndex].childNodes[0].classList.add('gameDud');
        children[randomIndex].childNodes[0].addEventListener("click", () => {
            console.log("dud clicked");
            children[randomIndex].childNodes[0].innerText = "...."
            // trys up or word changed to ...
        });
    }
    children[randomIndex].childNodes[0].innerText = type === "word" ? words_10.pop() : duds.pop();
} // good for now but come back to when your are doing game logic

function makeGameNodes() {
    // makes the base nodes for the game
    const extra = ["{", "}", "[", "]", "'", ":", ";", "/", "?", ".", ",", "<", ">", "(", ")", "-", "_", "*", "&", "^", "%", "$", "#", "@", "!", "~", "`", "|", "\\", "="];
    let piece = document.createElement('p');
    piece.classList.add('piece');
    let span = document.createElement('span');
    span.innerText = extra[Math.floor(Math.random() * extra.length)];
    span.addEventListener('mouseover', function () {
        document.getElementById('input').innerText = span.innerText;
        clickSounds[Math.floor(Math.random() * clickSounds.length)].play();
    });
    piece.appendChild(span);
    return piece;
}

function makeIndexLines() {
    //randomizes the last two characters while keeping the first the same
    let line = document.createElement('div');
    for (let i = 0; i < numLines; i++) {
        let index = document.createElement('p');
        index.innerText = makeIndex(newIndex);
        line.append(index);
    }
    return line;
}

function makeIndex(line) {
    // this is what makes the indexes and randomizes them
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

function playBackgroundSounds() {
    // This plays the background sounds that play throughout the game.
    let fan = new Audio("./assets/sounds/computer_fan.mp3");
    let hardDrive = new Audio("./assets/sounds/ibm_hard_drive.mp3");
    fan.play();
    hardDrive.loop = true;
    hardDrive.load();
    hardDrive.play();
}

function playSound(src) {
    // util function to play whichever sounds given
    let audio = new Audio(src);
    audio.play();
}

function shuffle(a) {
    // just a shuffle method
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


