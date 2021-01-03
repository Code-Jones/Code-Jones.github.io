let input = document.getElementById("input");
let output = document.getElementById('output');
let pastCommandList = [];
const commandList = ["ls", "pwd", "cd", "find", "chmod", "ping", "history", "man", "clear", "pushd"]
let index = 0;
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

input.addEventListener("focusout", function (event){
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
            case "clear":
            case "clr":
                while (output.firstChild) {
                    output.removeChild(output.lastChild);
                }
                break;
            default:
                printToTerminal(str);
                printToTerminal("Command not recognized");
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


// function printToTerminal(str, correct) {
//     let outputBox = document.getElementById('outputBox');
//     outputBox.childNodes.item(0).remove();
//     outputBox.childNodes.item(0).remove();
//     let line1 = document.createElement('span');
//     let line2 = document.createElement('span');
//     let line3 = document.createElement('span');
// // check input
//     if (str.length === 1 || correct === -1) {
//         line1.innerText = ">" + str;
//         line2.innerText = ">ERROR";
//         outputBox.appendChild(line1);
//         outputBox.appendChild(line2);
//     } else if (str.length === 10) { // rn only using 10 letter words will change later
//         outputBox.childNodes.item(0).remove();
//         if (correct === 10) {
//             outputBox.childNodes.item(0).remove();
//             outputBox.childNodes.item(0).remove();
//             let line4 = document.createElement('span');
//             let line5 = document.createElement('span');
//             line1.innerText = ">" + str;
//             line2.innerText = ">EXACT MATCH!";
//             line3.innerText = ">PLEASE WAIT";
//             line4.innerText = ">WHILE SYSTEM";
//             line5.innerText = ">IS ACCESSED.";
//             outputBox.appendChild(line1);
//             outputBox.appendChild(line2);
//             outputBox.appendChild(line3);
//             outputBox.appendChild(line4);
//             outputBox.appendChild(line5);
//         } else {
//             line1.innerText = ">" + str;
//             line2.innerText = ">ENTRY DENIED";
//             line3.innerText = ">" + correct + "/10 correct.";
//             outputBox.appendChild(line1);
//             outputBox.appendChild(line2);
//             outputBox.appendChild(line3);
//         }
//     } else {
//         line1.innerText = ">" + str;
//         line2.innerText = ">DUD REMOVED";
//         outputBox.appendChild(line1);
//         outputBox.appendChild(line2);
//     }
// }

