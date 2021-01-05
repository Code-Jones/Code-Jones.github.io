let input = document.getElementById("input");
let output = document.getElementById('output');
let pastCommandList = [];
let index = 0;
let tree;
let currentDir;
const defaultPrompt = "root@RoboTermLink>";

// todo
//  - fix bottom box effect
//  - finish readmes
//  - add to json
//  - add sounds effects
//  - change to json
//  - fix responsive
//  - test
//  - clean code
//  - check with aaron

fetch("./assets/json/directory.json").then(response => response.json()).then(data => {
    tree = data;
    currentDir = searchTree(data, "C:");
    changePrompt(currentDir);
});

input.focus();

// input listeners
input.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let cmd = input.value;
        checkInput(cmd);
        pastCommandList.unshift(cmd);
        input.value = "";
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
});

input.addEventListener("focusout", function () {
    index = 0;
});

document.getElementById("screen").addEventListener("click", function (event) {
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
    output.scrollTop = output.scrollHeight;
}

function printHelp() {
    printToTerminal(
        "Welcome to RoboTermLink terminal\n" +
        "This terminal has been repurposed to demonstrate the admins ability for front end development\n" +
        "Please use the list of commands below\n" +
        "to navigate the directory and explore\n" +
        "cd [path]: change directory ex: cd Projects\n" +
        "ls: show directory\n" +
        "clear: clears screen\n" +
        "history: shows history of commands\n" +
        "pwd: print working directory\n" +
        "open [filename]: open file ex: open start_game.exe\n" +
        "help: shows list of commands\n\n" +
        "press the up and down arrows to retrieve the last commands\n\n" +
        "For extra help with navigating directories please type 'help cd'\n"
    );
}

function printNavHelp() {
    printToTerminal(
        "Welcome to RoboTermLink terminal\n\n" +
        "Navigation help\n\n" +
        "To navigate directories please type the command cd followed by the directory you would like to access\n" +
        "For example 'cd School_Stuff' / 'cd Fun_Side_Projects'\n" +
        "To go the the parent directory (preceding directory) please type 'cd ..' as .. is the symbol for parent directory\n" +
        "To go back to the home directory please type 'cd ~' as ~ is the symbol for the home directory\n" +
        "When changing directories, the terminal is case sensitive and spelling has to be correct\n\n" +
        "Display directory help\n\n" +
        "To display the contents of the current directory please type ls\n" +
        "This will show all the files and directory within the pwd (present working directory)\n" +
        "Files without an extension such as .html or .txt are directories and can be opened\n"
    );
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