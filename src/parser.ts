/* Import necessary modules */
var acorn = require('acorn');
var esc = require('escodegen')
var fs = require('fs');
var estrav = require('estraverse');
var location = require('./datatypes');

function toAst(filePathIn, filePathOut) {
    let prog = fs.readFileSync(filePathIn).toString();
    var ast = acorn.parse(prog, {ecmaVersion: 5, locations: true});
    let newprog = esc.generate(ast);
    fs.writeFileSync(filePathOut, newprog);
}

function pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars) {
    let ast = acorn.parse(prog, {ecmaVersion: 5, locations:true});
    let fbody_ast = ast.body[0].body;
    let filtered_fbody_ast = estrav.replace(fbody_ast, {
        enter: function(node, parent) {
            if(node.type == 'VariableDeclaration') {
                if(!relevant_vars.includes(node.declarations[0].id.name)) {
                    return this.remove();
                }
            }
            if (node.type == 'ExpressionStatement' || node.type == 'ReturnStatement') {
                if(relevant_locs.some(location => in_between_inclusive(node.loc, location))) {
                    return node;
                }
                if(within_line(node.loc, lineNb)) {
                    return node;
                }
                return this.remove();
            }
        }
    });
    ast.body[0].body = filtered_fbody_ast;
    let newprog = esc.generate(ast);
    return newprog;
}



function prune(progInPath, progOutPath, graph, lineNb) {
    const readsInLineNbCriterion = `node[type="r"][line=${lineNb}]`
    const readNodesInLine = graph.elements(readsInLineNbCriterion);
    const reachableNodes = readNodesInLine.successors("node");
    const relevant_locs = reachableNodes.map(node => node.data("loc"));
    const relevant_vars = reachableNodes.map(node => node.data("name"));
    /*relevant_locs.push(new location.SourceLocation(progInPath,
        new location.Position(lineNb, 0),
        new location.Position(lineNb, Number.POSITIVE_INFINITY)))*/
    const prog = fs.readFileSync(progInPath).toString();
    const newprog = pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars);
    fs.writeFileSync(progOutPath, newprog);
}

function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}

function in_between_inclusive(outer, inner) {
    return (outer.start.line <= inner.start.line &&
        outer.start.column <= inner.start.column &&
        inner.end.line <= outer.end.line&&
        inner.end.column <= outer.end.column)
}

module.exports = {
    prune
};