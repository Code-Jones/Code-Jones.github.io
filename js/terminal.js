let input = document.getElementById("input");
let output = document.getElementById('output');
let commandList = [];


input.addEventListener("keyup", function(event) {
    let index = 0;
    if (event.key === 'Enter') {
        event.preventDefault();
        let cmd = input.value;
        printToTerminal(cmd);
        commandList.unshift(cmd);
        input.value = "";
    } else if (event.key === 'ArrowUp') {
        if (commandList.length !== 0) {
            input.value = commandList.indexOf(index);
            index++;
        }
    } else if (event.key === 'ArrowDown') {
        if (commandList.length !== 0 || index >= 1) {
            input.value = commandList.indexOf(index);
            index--;
        }
    }
});



function printTerminalBlank() {
    // calc the size of the screen to get correct size // might not needed now

    let output = document.getElementById('output');
    for (let i = 0; i < 19; i++) {
        let line = document.createElement('span');
        line.appendChild(document.createElement('br'));
        output.appendChild(line);
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

