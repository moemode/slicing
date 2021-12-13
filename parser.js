var fs = require('fs');
var location = require('./datatypes');
var esprima = require('esprima');
var { parse, print } = require("recast");
var astt = require("ast-types");


function pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars) {
    const ast = parse(prog, {
        parser: esprima,
    })
    astt.visit(ast, {
        visitNode(path) {
            const node = path.node;
            if(node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                return false;
            }
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
            }
            if (within_line(node.loc, lineNb)) {
                return false;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevant_locs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return false;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "IfStatement") {
                if (!relevant_locs.some(rloc => location.in_between_inclusive(node.test.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    path.prune();
                    return false;
                } /*else {
                    const branchPaths = [path.get("consequent"), path.get("alternate")].filter(x => x.value)
                    for (let branchPath of branchPaths) {
                        this.traverse(branchPath);
                    }
                    console.log(branchPaths);
                }*/
            }
            if (node.type == 'ExpressionStatement' || node.type == 'ReturnStatement') {
                if (relevant_locs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return false;
                } else {
                    path.prune();
                    return false;
                }
            }
            this.traverse(path);
        }
    });
    return print(ast);
}

function prune(progInPath, progOutPath, graph, lineNb) {
    const readsInLineNbCriterion = `node[type="read"][line=${lineNb}], node[type="getField"][line=${lineNb}]`
    const readNodesInLine = graph.nodes(readsInLineNbCriterion);
    const reachableNodes = readNodesInLine.successors("node");
    const relevant_locs = reachableNodes.map(node => node.data("loc"));
    const relevant_vars = reachableNodes.map(node => node.data("name"));
    /*relevant_locs.push(new location.SourceLocation(progInPath,
        new location.Position(lineNb, 0),
        new location.Position(lineNb, Number.POSITIVE_INFINITY)))*/
    const prog = fs.readFileSync(progInPath).toString();
    const newprog = pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars)
    fs.writeFileSync(progOutPath, newprog.code);

}


function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}


module.exports = {
    prune
};