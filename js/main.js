let printSound = new Audio('./assets/sounds/print.wav');
const s1 = new Audio('./assets/sounds/key1.wav'); // change this
const s2 = new Audio('./assets/sounds/key2.wav');
const s3 = new Audio('./assets/sounds/key3.wav');
const s4 = new Audio('./assets/sounds/key4.wav');
const s5 = new Audio('./assets/sounds/key5.wav');
const s6 = new Audio('./assets/sounds/key6.wav');
const s7 = new Audio('./assets/sounds/key7.wav');
const clickSounds = [s1, s2, s3, s4, s5, s6, s7];
printSound.loop = true;
let newIndex = null;
newIndex = makeIndex(newIndex);
let numLines = 17;
let numPiecesAcross = 12;
const words_6 = ["PLAYER", "ARMIES", "WASTES", "PIECES", "BECOME", "TOSSED", "MIDDLE", "KIDNAP", "KINDLY", "THWART", "SECRET", "HIDDEN", "OFFERS", "BEFORE", "FORGES", "FORCES", "NEEDED", "MINUTE", "LEARNS", "ATTACK", "PERIOD", "INSANE", "ACCESS", "AFRESH", "DESERT", "HUNGRY"]
const words_10 = ["RECRUITING", "FLASHLIGHT", "BINOCULARS", "SUPPRESSOR", "DISPOSABLE", "CAMOUFLAGE", "TOOTHBRUSH", "INCENDIARY", "LIEUTENANT", "OCCUPATION", "ACTIVATING", "ENCOUNTERS", "STRETCHING", "FUTURISTIC", "APARTMENTS", "VEGETABLES", "RESTRICTED", "APOCALYPSE", "CONCERNING", "SCULPTURES", "CURRICULUM", "MECHANICAL", "THEREAFTER", "VANQUISHED", "DETERMINED", "FUNCTIONAL", "COMMISSION"];
const duds = ["[:^@]", "[}{]", "[<:)]", "[<>]", "[#.#]", "[%!`~]", "[*&$@*((@]", "[}[]", "[&#]", "[*##@)_]", "[:@;]", "[<:>]", "[><]", "[{}]", "[}{]", "[#:>]", "[*(@)]", "[)@:]", "[>{}<]", "[!@#]"]
let taken = [];
let takenCounter = 0;
let keysBox_1;
let animated = [];
const gameTopLines = ["ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL", "ENTER PASSWORD NOW", "4 ATTEMPT(S) LEFT : "];
let password = ""; // change this
let gameWords = [];
let gameDuds = [];
let attempts = 4;
let passwordLetters; // really shouldn't be a global variable
let fan;
let hardDrive;

checkBrowser()

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    let orn = document.getElementById('orientation')
    orn.classList.add('orientation');
    orn.style.display = 'block';
}


function start() {
    document.getElementById('click-to-start').remove();
    animated = document.querySelectorAll('.animated');
    playSound('./assets/sounds/login.wav');
    playBackgroundSounds();
    // remove active if animation ended
    for (let i = 0; i < animated.length; i++) {
        animated[i].addEventListener('animationstart', () => {
            printSound.play().then();
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

function makeAttemptBoxes() {
    let attemptBox = document.createElement('div');
    attemptBox.id = "attemptBox";
    attemptBox.classList.add('attemptBox');
    for (let i = 0; i < attempts; i++) {
        let attempt = document.createElement('span');
        attempt.innerText = ' ';
        attempt.classList.add('attempt');
        attemptBox.appendChild(attempt);
    }
    animated[animated.length - 1].appendChild(attemptBox);
    animated[animated.length - 1].style.display = "inline-flex";
}

function playPrintSoundEvent() {
    printSound.play().then();
}

function openGameScene() {
    // top text being printed
    animated = [];
    document.getElementById('opening').remove();
    let topText = document.createElement('div');
    topText.classList.add('gameTopText');
    for (let i = 0; i < gameTopLines.length; i++) {
        let line = document.createElement('p');
        if (i === 1) {
            line.id = "warning bar";
        }
        line.innerText = gameTopLines[i];
        animated[i] = line;
        topText.appendChild(line);
    }
    // attempt boxes
    makeAttemptBoxes();
    // animations
    for (let i = 0; i < animated.length; i++) {
        // animated[i].addEventListener('animationstart', playPrintSoundEvent);
        animated[i].addEventListener('animationend', () => {
            animated[i].classList.remove('active');
            animated[i].classList.add('afterActive');
            animated[i].style.opacity = '1';
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
    keysBox_1 = document.createElement('div');
    keysBox_1.classList.add('gamePcBox');
    let keysBox_2 = document.createElement('div');
    keysBox_2.classList.add('gamePcBox');
    for (let i = 0; i < 700; i++) {
        keysBox_1.appendChild(makeGameNodes());
        keysBox_2.appendChild(makeGameNodes());
    }
    let keysChildren = keysBox_1.childNodes;
    let keys_2Children = keysBox_2.childNodes;
    for (let i = 0; i < 7; i++) {
        replaceWithFiller(keysChildren, "word");
        replaceWithFiller(keysChildren, "dud");
        replaceWithFiller(keys_2Children, "word");
        replaceWithFiller(keys_2Children, "dud");
    }
    // for (let i = 0; i < keysChildren.length ; i++) {
    //     let inner = keysChildren[i].innerHTML;
    //     if (!inner.classList.contains('gameDud') || !inner.classList.contains('gameWord')) {
    //         // hacky solution
    //         keysChildren[i].addEventListener('click', () => {
    //             printToTerminal(inner.innerText);
    //             playSound('./assets/sounds/incorrect.wav');
    //         });
    //     }
    // }

    gameScreen.appendChild(makeIndexLines());
    gameScreen.appendChild(keysBox_1);
    gameScreen.appendChild(document.createElement('div'));
    gameScreen.appendChild(makeIndexLines());
    gameScreen.appendChild(keysBox_2);
    gameScreen.appendChild(makeSideTerminal());
    document.getElementById('screen').appendChild(gameScreen);
    // set password
    gameWords = document.getElementsByClassName('gameWord');
    gameDuds = document.getElementsByClassName('gameDud');
    let ran = Math.floor(Math.random() * gameWords.length);
    password = gameWords[ran]; // might remove password from list
    passwordLetters = password.innerText.split("");
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
    output.id = 'outputBox';
    for (let i = 0; i < 15; i++) {
        let line = document.createElement('span');
        line.appendChild(document.createElement('br'));
        output.appendChild(line);
    }
    output.classList.add('outputBox')

    sideTerm.appendChild(output);
    sideTerm.appendChild(inputBox);
    return sideTerm;
}

function printToTerminal(str, correct) {
    let outputBox = document.getElementById('outputBox');
    outputBox.childNodes.item(0).remove();
    outputBox.childNodes.item(0).remove();
    let line1 = document.createElement('span');
    let line2 = document.createElement('span');
    let line3 = document.createElement('span');
    // check input
    if (str.length === 1 || correct === -1) {
        line1.innerText = ">" + str;
        line2.innerText = ">ERROR";
        outputBox.appendChild(line1);
        outputBox.appendChild(line2);
    } else if (str.length === 10) { // rn only using 10 letter words will change later
        outputBox.childNodes.item(0).remove();
        if (correct === 10) {
            outputBox.childNodes.item(0).remove();
            outputBox.childNodes.item(0).remove();
            let line4 = document.createElement('span');
            let line5 = document.createElement('span');
            line1.innerText = ">" + str;
            line2.innerText = ">EXACT MATCH!";
            line3.innerText = ">PLEASE WAIT";
            line4.innerText = ">WHILE SYSTEM";
            line5.innerText = ">IS ACCESSED.";
            outputBox.appendChild(line1);
            outputBox.appendChild(line2);
            outputBox.appendChild(line3);
            outputBox.appendChild(line4);
            outputBox.appendChild(line5);
        } else {
            line1.innerText = ">" + str;
            line2.innerText = ">ENTRY DENIED";
            line3.innerText = ">" + correct + "/10 correct.";
            outputBox.appendChild(line1);
            outputBox.appendChild(line2);
            outputBox.appendChild(line3);
        }
    } else {
        line1.innerText = ">" + str;
        line2.innerText = ">DUD REMOVED";
        outputBox.appendChild(line1);
        outputBox.appendChild(line2);
    }
}

function winGame() {
    document.location.href = "Terminal.html";
}

function gameOver() {
    document.getElementById('screen').remove();
    let box = document.createElement('div');
    box.classList.add('centered-2');
    let overText = document.createElement('p');
    overText.innerText = "TERMINAL LOCKED";
    box.appendChild(overText);
    let sections = document.getElementsByTagName('section');
    sections[0].appendChild(box);
}

function removeAttempt() {
    if (attempts === 2) { // because it subtracts afterwards
        let num = document.getElementsByClassName('afterActive');
        num.item(num.length - 2).innerText = "!!! WARNING: LOCKOUT IMMINENT !!!";
        num.item(num.length - 2).classList.add('blinking');
        playSound('./assets/sounds/censor.wav'); // should be looped ?
    }
    if (attempts === 1) {
        playSound('./assets/sounds/locked.wav');
        gameOver();
    } else {
        let num = document.getElementsByClassName('afterActive');
        num.item(num.length - 1).innerText = (attempts - 1) + " ATTEMPT(S) LEFT : ";
        makeAttemptBoxes();
        let attemptList = document.getElementsByClassName('attempt');
        attemptList.item(attemptList.length - 1).remove();
        attempts--;
    }
}

function checkInput(innerText, type) {
    // checks input to see how it affects game and to print to terminal
    if (type === "dud" && !innerText.includes('.')) {
        let ran = Math.floor(Math.random() * gameWords.length);
        while (gameWords.item(ran) === password) { // messy but just trying to get it done at this point
            ran = Math.floor(Math.random() * gameWords.length);
        }
        gameWords[ran].innerText = '..........';
        printToTerminal(innerText);
    } else if (type === "word" && !innerText.includes('.')) {
        if (innerText === password.innerText) {
            // win game

            setTimeout(function () {
                sessionStorage.setItem("fanTime", fan.currentTime);
                sessionStorage.setItem("hardDriveTime", hardDrive.currentTime);
                winGame();
            }, 5000);
            printToTerminal(innerText, 10);
        } else {
            removeAttempt();
            let innerLetter = innerText.split("");
            let correct = 0;
            for (let i = 0; i < innerLetter.length; i++) {
                if (innerLetter[i] === passwordLetters[i]) {
                    correct++;
                }
            }
            printToTerminal(innerText, correct);
        }
    } else {
        printToTerminal(innerText, -1);
    }
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
            checkInput(children[randomIndex].childNodes[0].innerText, "word");
        });
        children[randomIndex].childNodes[0].classList.add('gameWord');
    } else if (type === "dud") {
        children[randomIndex].childNodes[0].innerText = duds[0];
        children[randomIndex].childNodes[0].classList.add('gameDud');
        children[randomIndex].childNodes[0].addEventListener("click", () => {
            checkInput(children[randomIndex].childNodes[0].innerText, "dud");
            children[randomIndex].childNodes[0].innerText = "...."
        });
    }
    children[randomIndex].childNodes[0].innerText = type === "word" ? words_10.pop() : duds.pop();
}

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
    span.addEventListener('click', () => {
        // printToTerminal(span.innerText);
        playSound('./assets/sounds/incorrect.wav');
    });
    // span.addEventListener('click', (function(passedInElement) {
    //     return function(e) {clickExtra(e, passedInElement); };
    // }) (this.span), false);
    //
    //
    // span.addEventListener('click',(function(span) {
    //     return function (e) {}
    // }) (this.span))
    // span.addEventListener('click', clickExtra);


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
    fan = new Audio('./assets/sounds/computer_fan.wav');
    hardDrive = new Audio('./assets/sounds/ibm_hard_drive.wav');
    fan.loop = true;
    fan.play();
    hardDrive.loop = true;
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

document.getElementById('screen').addEventListener("click", function () {
    let help = document.getElementById('help');
    if (help.style.display === "block") {
        help.style.display = "none";
    }
});

function openHelp() {
    let help = document.getElementsByClassName('help').item(0);
    if (help.style.display === "none"){
        getPage()
        help.style.display = "block";
    } else {
        getPage()
        help.style.display = "none";
    }
}

function getPage(){
    let btn = document.getElementById('pageButton');
    if (btn.value === "Page 1") {
        fetch("./assets/readmes/GameHelpPage_1.txt").then(response => response.text()).then(text => document.getElementById('helpContent').innerText = text);
        btn.value = "Page 2";
        btn.innerText = "Page 1";
    } else {
        fetch("./assets/readmes/GameHelpPage_2.txt").then(response => response.text()).then(text => document.getElementById('helpContent').innerText = text);
        btn.value = "Page 1";
        btn.innerText = "Page 2"
    }

}

function checkBrowser() {

    let userAgentString =
        navigator.userAgent;
    let chromeAgent =
        userAgentString.indexOf("Chrome") > -1;
    let IExplorerAgent =
        userAgentString.indexOf("MSIE") > -1 ||
        userAgentString.indexOf("rv:") > -1;
    let firefoxAgent =
        userAgentString.indexOf("Firefox") > -1;
    let safariAgent =
        userAgentString.indexOf("Safari") > -1;
    if ((chromeAgent) && (safariAgent))
        safariAgent = false;
    let operaAgent =
        userAgentString.indexOf("OP") > -1;
    if ((chromeAgent) && (operaAgent))
        chromeAgent = false;

    if (safariAgent) {
        alert("I've noticed issues with using safari I haven't been able to fix yet. Please use Chrome for the best experience")
    }
}
