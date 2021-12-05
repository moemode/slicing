/* Import necessary modules */
var acorn = require('acorn');
var esc = require('escodegen')
var fs = require('fs');
var estrav = require('estraverse');

function toAst(filePathIn, filePathOut) {
    let prog = fs.readFileSync(filePathIn).toString();
    var ast = acorn.parse(prog, {ecmaVersion: 5, locations: true});
    let newprog = esc.generate(ast);
    fs.writeFileSync(filePathOut, newprog);
}

/**
 * 
 * @param {string} program 
 * @param {array of positive int} locations 
 */
function keepLines(program, lines) {
    var ast = acorn.parse(program, {ecmaVersion: 5, locations:true});
    fbody_ast = ast.body[0].body;
    filtered_fbody_ast = estrav.replace(fbody_ast, {
        enter: function(node, parent) {
            if(!lines.some(location => in_between_inclusive(location, node.loc.start.line, node.loc.end.line))) {
                this.remove();
            }
        }
    });
    ast.body[0].body = filtered_fbody_ast;
    let newprog = esc.generate(ast);
    return newprog;
}

const keepLines2 = (data, lines = []) => {
    return data
        .split('\n')
        .filter((val, idx) => lines.includes(idx))
        .join('\n');
}

function removeLines2(progInPath, progOutPath, linesToKeep) {
    let prog = fs.readFileSync(progInPath).toString();
    linesToKeep = linesToKeep.map(l => l - 1);
    fs.writeFileSync(progOutPath,  keepLines2(prog, linesToKeep));
}


function in_between_inclusive(x, start, end) {
    return start <= x && x <= end;
}

function prune(progInPath, progOutPath, graph, lineNb) {
    readsInLineNbCriterion = `node[type="r"][line="${lineNb}"]`
    readNodesInLine = graph.elements(readsInLineNbCriterion);
    reachableNodes = readNodesInLine.successors("node");
    linesToKeep = reachableNodes.map(node => parseInt(node.data("line")));
    linesToKeep.push(parseInt(lineNb));
    console.log("linesToKeep: " + linesToKeep.toString());
    let prog = fs.readFileSync(progInPath).toString();
    let newprog = keepLines(prog, linesToKeep);
    fs.writeFileSync(progOutPath, newprog);
}

class Pruner {
    constructor(progInPath, progOutPath, graph, lineNb){
        this.progInPath = progInPath;
        this.progOutPath = progOutPath;
        this.graph = graph;
        this.lineNb = lineNb;
    }

}
//toAst("./slicer/m1prog.js", "./slicer/m1prog_trans.js")
//let linesToKeep = [1, 2, 5, 6, 9, 10]
//removeLines("./slicer/m1prog.js", "./slicer/m1prog_removed.js", linesToKeep)

module.exports = {
    prune
};