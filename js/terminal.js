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

input.focus();
printHelp();

fetch("./assets/json/directory.json").then(response => response.json()).then(data => {
    tree = data;
    currentDir = searchTree(data, "C:");
    changePrompt(currentDir);
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
       playBackgroundSounds();
       first = false;
   }
   let help = document.getElementById('help');
   if (help.style.display === "block") {
       help.style.display = "none";
   }
    input.focus();
});



function checkInput(str) {
    printToTerminal(defaultPrompt + currentDir.path + " " + str);
    if (str !== "") {
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

function printToTerminal(str) {
    let line = document.createElement('span');
    line.innerText = str;
    output.appendChild(line);
    document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
}

function printHelp() {
    fetch("./assets/readmes/TermHelpPage_1.txt").then(response => response.text()).then(text => printToTerminal(text));
    // printToTerminal(
    //     "Welcome to RoboTermLink terminal\n" +
    //     "This terminal has been repurposed to demonstrate the admins ability for front end development\n" +
    //     "Please use the list of commands below\n" +
    //     "to navigate the directory and explore\n\n" +
    //     "cd [path]: change directory ex: cd Projects\n" +
    //     "ls: show directory\n" +
    //     "clear: clears screen\n" +
    //     "history: shows history of commands\n" +
    //     "pwd: print working directory\n" +
    //     "open [filename]: open file ex: open start_game.exe\n" +
    //     "help: shows list of commands\n\n" +
    //     "press the up and down arrows to retrieve the last commands\n\n" +
    //     "For extra help with navigating directories please type 'help cd'\n"
    // );
}

function printNavHelp() {
    fetch("./assets/readmes/TermHelpPage_2.txt").then(response => response.text()).then(text => printToTerminal(text));
    // printToTerminal(
    //     "Welcome to RoboTermLink terminal\n\n" +
    //     "Navigation help\n\n" +
    //     "To navigate directories please type the command cd followed by the directory you would like to access\n" +
    //     "For example 'cd School_Stuff' / 'cd Fun_Side_Projects'\n" +
    //     "To go the the parent directory (preceding directory) please type 'cd ..' as .. is the symbol for parent directory\n" +
    //     "To go back to the home directory please type 'cd ~' as ~ is the symbol for the home directory\n" +
    //     "When changing directories, the terminal is case sensitive and spelling has to be correct\n\n" +
    //     "Display directory help\n\n" +
    //     "To display the contents of the current directory please type ls\n" +
    //     "This will show all the files and directory within the pwd (present working directory)\n" +
    //     "Files without an extension such as .html or .txt are directories and can be opened\n"
    // );
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
            changePrompt();
            break;
        default:
            currentDir = searchChildrenForDirectories(currentDir, arg);
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
        printToTerminal("..");
    }
    for (let children of currentDir.children) {
        printToTerminal(children.name);
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
    }
}

function changePrompt() {
    document.getElementById('prompt').innerText = currentDir.path;
}

function playBackgroundSounds() {
    // This plays the background sounds
    let fan = new Audio("./assets/sounds/computer_fan.mp3");
    let hardDrive = new Audio("./assets/sounds/ibm_hard_drive.mp3");
    try {
        let fanTime = sessionStorage.getItem("fanTime");
        let hardDriveTime = sessionStorage.getItem("hardDriveTime");
        fan.currentTime = parseFloat(fanTime);
        hardDrive.currentTime = parseFloat(hardDriveTime);

    } catch (e) {
        console.log("Could not find sound times. Playing regardless");
    } finally {
        fan.loop = true;
        hardDrive.loop = true;
        fan.play();
        hardDrive.play();
    }
}