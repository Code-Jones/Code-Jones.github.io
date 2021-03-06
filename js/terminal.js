let input = document.getElementById("input");
let output = document.getElementById('output');
let pastCommandList = [];
let index = 0;
let tree;
let currentDir;
let first = true;
const defaultPrompt = "root@RoboTermLink>";
const s1 = new Audio('./assets/sounds/key1.wav');
const s2 = new Audio('./assets/sounds/key2.wav');
const s3 = new Audio('./assets/sounds/key3.wav');
const s4 = new Audio('./assets/sounds/key4.wav');
const s5 = new Audio('./assets/sounds/key5.wav');
const s6 = new Audio('./assets/sounds/key6.wav');
const s7 = new Audio('./assets/sounds/key7.wav');
const enter = new Audio('./assets/sounds/correct.wav');
const clickSounds = [s1, s2, s3, s4, s5, s6, s7];

// input.focus();
printHelp();
// checkInput("open ClickMe.txt");

fetch("./assets/json/directory.json").then(response => response.json()).then(data => {
    tree = data;
    currentDir = searchTree(data, "C:");
    changePrompt(currentDir);
});

function openHelp() {
    let help = document.getElementsByClassName('help').item(0);
    if (help.style.display === "none") {
        getPage()
        help.style.display = "block";
    } else {
        getPage()
        help.style.display = "none";
    }
}

function getPage() {
    let btn = document.getElementById('pageButton');
    if (btn.value === "Page 1") {
        fetch("./assets/readmes/TermHelpPage_1.txt").then(response => response.text()).then(text => document.getElementById('helpContent').innerText = text);
        btn.value = "Page 2";
        btn.innerText = "Page 1";
    } else {
        fetch("./assets/readmes/TermHelpPage_2.txt").then(response => response.text()).then(text => document.getElementById('helpContent').innerText = text);
        btn.value = "Page 1";
        btn.innerText = "Page 2"
    }

}


// input listeners
input.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let cmd = input.value;
        checkInput(cmd);
        pastCommandList.unshift(cmd);
        input.value = "";
        enter.play();
    } else if (event.key === 'ArrowUp') {
        if (pastCommandList.length !== 0 && index <= pastCommandList.length - 1 && index >= 0) {
            input.value = pastCommandList[index];
            index++;
        }
    } else if (event.key === 'ArrowDown') {
        if (pastCommandList.length !== 0 && index <= pastCommandList.length && index > 1) {
            input.value = pastCommandList[index - 2];
            index--;
        }
    }
    clickSounds[Math.floor(Math.random() * clickSounds.length)].play();
});

input.addEventListener("focusout", function () {
    index = 0;
});

document.getElementById("screen").addEventListener("click", function () {
    if (first) {
        playBackgroundSounds()
    }
    first = false;
})

document.getElementById("screen").addEventListener("click", function () {
    let help = document.getElementById('help');
    if (help.style.display === "block") {
        help.style.display = "none";
    } else {
        input.focus();
    }
});


function checkInput(str) {
    if (str.name === "pastcmd") {
        let pastCmd = str.innerText.split(".");
        switch (pastCmd[1]) {
            case "txt":
            case "html":
            case "exe":
                checkInput("open " + str.innerText);
                break;
            case "":
            case undefined:
                checkInput("cd " + str.innerText);
                break;
            default:
                checkInput(pastCmd[1]);
                break;
            }
        } else if (str !== "") {
        printToTerminal(defaultPrompt + currentDir.path + " " + str);
        let args = str.split(" ");
        switch (args[0].toLocaleLowerCase()) {
            case "cd":
                changeDirectory(args[1]);
                break;
            case "history":
            case "h":
                showHistory();
                break;
            case "help":
                if (args[1] === 'cd') {
                    printNavHelp();
                } else {
                    printHelp()
                }
                break;
            case "clear":
            case "clr":
                clearTerminal();
                break;
            case "pwd":
                printCurrentPath();
                break;
            case "ls":
                showDirectory();
                break;
            case "open":
                openFile(args[1]);
                break;
            default:
                printToTerminal(
                    "Command: '" + str + "' not recognized\n" +
                    "Enter 'help' for a list of commands\n\n");
                break;
        }
    }
}

function printToTerminal(str, cmd) {
    let line = document.createElement('span');
    line.innerText = str;
    if (cmd) {
        line.classList.add('selector');
        line.name = "pastcmd";
        line.addEventListener("click", function () {
            checkInput(line);
            enter.play();
        });
    }
    output.appendChild(line);
    document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
}

function printHelp() {
    fetch("./assets/readmes/TermHelpPage_1.txt").then(response => response.text()).then(text => printToTerminal(text));
}

function printNavHelp() {
    fetch("./assets/readmes/TermHelpPage_2.txt").then(response => response.text()).then(text => printToTerminal(text));
}

function changeDirectory(arg) {
    switch (arg) {
        case "":
            printToTerminal("Error: Blank path");
            break;
        case currentDir.name:
            printToTerminal("Error: Currently in this directory");
            break;
        case "..":
            goToParentDir(arg);
            break;
        case "~":
            currentDir = searchTree(tree, "C:");
            showDirectory()
            changePrompt();
            break;
        default:
            currentDir = searchChildrenForDirectories(currentDir, arg);
            showDirectory()
            changePrompt();
            break;
    }
}

function searchTree(dir, desired) {
    if (dir.name === desired) {
        return dir;
    } else if (dir.children != null) {
        let result = null;
        for (let i = 0; result == null && i < dir.children.length; i++) {
            result = searchTree(dir.children[i], desired);
        }
        return result;
    }
    return null;
}

function searchChildrenForDirectories(currentDir, desired) {
    for (let children of currentDir.children) {
        if (children.name === desired && children.type === "directory") {
            return children;
        }
    }
    return currentDir;
}

function searchChildrenForFiles(currentDir, desired) {
    for (let children of currentDir.children) {
        if (children.name === desired && children.type !== "directory") {
            return children;
        }
    }
    return -1;
}

function showDirectory() {
    if (currentDir.name !== "C:") {
        printToTerminal("..", true);
    }
    for (let children of currentDir.children) {
        printToTerminal(children.name, true);
    }

}

function clearTerminal() {
    while (output.firstChild) {
        output.removeChild(output.lastChild);
    }
}

function showHistory() {
    for (let i = 0; i < pastCommandList.length; i++) {
        printToTerminal(pastCommandList[i]);
    }
}

function printCurrentPath() {
    printToTerminal(currentDir.path);
}

function openFile(args) {
    if (args === "") {
        printToTerminal("Error: Blank path");
    } else {
        let file = searchChildrenForFiles(currentDir, args);
        switch (file.type) {
            case "txt":
                fetch(file.local).then(response => response.text()).then(text => printToTerminal(text));
                break;
            case "html":
                window.open(file.url);
                break;
            case "exe":
                let t = new Function(file.function.body);
                // todo set timer and play sound.
                t()
                break;
            case -1:
                printToTerminal("Error: File could not be found");
                break;
            default:
                printToTerminal("Error: File could not be found");
                break;
        }
    }
}

function goToParentDir() {
    if (currentDir.name === "C:") {
        printToTerminal("In root directory");
    } else {
        let tempPath = currentDir.path.split("/");
        currentDir = searchTree(tree, tempPath[tempPath.length - 2])
        changePrompt();
        showDirectory()
    }
}

function changePrompt() {
    document.getElementById('prompt').innerText = currentDir.path;
}

async function playBackgroundSounds() {
    // This plays the background sounds
    let fan = new Audio("./assets/sounds/computer_fan.wav");
    let hardDrive = new Audio("./assets/sounds/ibm_hard_drive.wav");
    try {
        let fanTime = sessionStorage.getItem("fanTime");
        let hardDriveTime = sessionStorage.getItem("hardDriveTime");
        fan.currentTime = parseFloat(fanTime);
        hardDrive.currentTime = parseFloat(hardDriveTime);
    } catch (e) {
        console.log("Could not find sound times. Playing regardless");
    } finally {
        first = false;
        fan.loop = true;
        hardDrive.loop = true;
        await fan.play();
        await hardDrive.play();
    }
}