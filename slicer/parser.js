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
function keepLocations(program, locations) {
    var ast = acorn.parse(program, {ecmaVersion: 5, locations:true});
    filtered_ast = estrav.replace(ast, {
        leave: function(node, parent) {
            if(!locations.includes(node.loc.start.line)) {
                return this.remove();
            }
        }
    });
    let newprog = esc.generate(filtered_ast);
    return newprog;
}

function removeLines(progInPath, progOutPath, linesToKeep) {
    let prog = fs.readFileSync(progInPath).toString();
    let newprog = keepLocations(prog, linesToKeep);
    fs.writeFileSync(progOutPath, newprog);
}

//toAst("./slicer/m1prog.js", "./slicer/m1prog_trans.js")
let linesToKeep = [1, 2, 5, 6, 9, 10]
removeLines("./slicer/m1prog.js", "./slicer/m1prog_removed.js", linesToKeep)
