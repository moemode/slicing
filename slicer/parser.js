/* Import necessary modules */
var acorn = require('acorn');
var esc = require('escodegen')
var fs = require('fs');

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
    var ast = acorn.parse(prog, {ecmaVersion: 5, locations:true});
    
    let newprog = esc.generate(ast);
    return 
}

toAst("./slicer/m1prog.js", "./slicer/m1prog_trans.js")