let input = document.getElementById("input");
let output = document.getElementById('output');
let pastCommandList = [];
const commandList = ["ls", "pwd", "cd", "find", "chmod", "ping", "history", "man", "clear", "pushd"]
let index = 0;
let tree;

fetch("./assets/json/directory.json").then(response => response.json()).then(data => {
    tree = data;
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

input.addEventListener("focusout", function (event) {
    index = 0;
});

function checkInput(str) {
    if (str !== "") {
        switch (str) {
            case "history":
                for (let i = 0; i < pastCommandList.length - 1; i++) {
                    printToTerminal(pastCommandList[i]);
                }
                break;
            case "help":
            case "Help":
                printHelp()
            case "clear":
            case "clr":
                clearTerminal();
                break;
            default:
                printToTerminal("Command: '" + str + "' not recognized");
                printToTerminal("Enter 'help' for a list of commands");
                break;

        }
    }
}

function printToTerminal(str) {
    let line = document.createElement('span');
    line.innerText = str;
    output.appendChild(line);
}

function clearTerminal() {
    while(output.firstChild) {
        output.removeChild(output.lastChild);
    }
}

function printHelp() {
    printToTerminal("Welcome to RoboTermLink terminal");
    printToTerminal("This terminal has been repurposed to demonstrate the admins ability for front end development");
    printToTerminal("Please use the list of commands below");
    printToTerminal("to navigate the directory");
    printToTerminal("cd [path]: change directory");
}
