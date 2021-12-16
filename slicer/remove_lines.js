const { keepLines } = require("./parser");
const fs = require("fs");

function keepLinesFile(progInPath, progOutPath, lines) {
    const prog = fs.readFileSync(progInPath).toString();
    const newprog = keepLines(prog, lines);
    fs.writeFileSync(progOutPath, newprog);
}
keepLinesFile("./m1prog.js", "./m1prog_removed.js", [1, 2, 5, 6, 9, 10])
