function println(line) {
    const screen = document.getElementById("screen");
    const para = document.createElement("p");
    const text = document.createTextNode(line);
    para.classList.add('type_effect')
    para.appendChild(text);
    screen.appendChild(para);
}

document.getElementsByClassName("css-typing").item(0).getElementsByTagName('p')
