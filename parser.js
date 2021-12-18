var fs = require('fs');
var location = require('./datatypes');
var esprima = require('esprima');
var { parse, print } = require("recast");
var astt = require("ast-types");
var estraverse = require("estraverse");
var acorn = require("acorn");


function pruneProgram(prog, lineNb, graph, relevantLocs, relevant_vars) {
    /*const ast = parse(prog, {
        parser: esprima,
    })*/
    const ast = acorn.parse(prog, {locations: true, ecmaVersion: 5});
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                if (relevantLocs.some(nLoc => location.in_between_inclusive(node.loc, nLoc))) {
                    this.skip();
                }
                this.remove();
            }
            /*
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
            }*/
            if (within_line(node.loc, lineNb)) {
                this.skip();
            }
            if (node.type == 'VariableDeclaration') {
                if (relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    this.skip();
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    this.remove();
                }
            }
            if (node.type === "IfStatement") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.test.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    // Todo: this is wrong what if if was reached without relevant nodes?
                    this.remove();
                } /*else {
                    const branchPaths = [path.get("consequent"), path.get("alternate")].filter(x => x.value)
                    for (let branchPath of branchPaths) {
                        this.traverse(branchPath);
                    }
                    console.log(branchPaths);
                }*/
            }
            if (node.type == 'ExpressionStatement' || node.type == 'ReturnStatement') {
                if (relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    this.skip();
                } else {
                   this.remove();
                }
            }
            if (node.type === "SwitchStatement") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    this.remove();
                }
            }
            if (node.type === "SwitchCase") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    this.remove();
                }
            }
        }
    });
    astt.visit(ast, {
        visitNode(path) {
            const node = path.node;
            if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                if (relevantLocs.some(nLoc => location.in_between_inclusive(node.loc, nLoc))) {
                    return false;
                }
                path.prune();
                return false;
            }
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
            }
            if (within_line(node.loc, lineNb)) {
                return false;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return false;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "IfStatement") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.test.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    // Todo: this is wrong what if if was reached without relevant nodes?
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
                if (relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return false;
                } else {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "SwitchStatement") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    path.prune();
                    return false;
                }
            }
            if (node.type === "SwitchCase") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    // if was not reached in execution -> remove fully
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
    const readsInLineNbCriterion = `node[type="write"][line=${lineNb}], node[type="read"][line=${lineNb}], node[type="getField"][line=${lineNb}]`
    const testsInLineNbCriterion = `node[type="if-test"][line=${lineNb}], node[type="for-test"][line=${lineNb}], node[type="switch-test-test"][line=${lineNb}], node[type="switch-disc-test"][line=${lineNb}]`;
    const endExpressionCrit = `node[type="end-expression"][line=${lineNb}]`
    const relevantNodesInLine = graph.nodes(readsInLineNbCriterion + ", " + testsInLineNbCriterion + ", " + endExpressionCrit);
    const reachableNodes = relevantNodesInLine.successors("node");
    const allRelevantNodes = reachableNodes.union(relevantNodesInLine);
    const nodeLocs = Array.from(new Set(allRelevantNodes.map(node => node.data("loc"))));
    const callerLocs = Array.from(new Set(allRelevantNodes.map(node => node.data("callerLoc")).filter(x => x)));
    const relevantLocs = nodeLocs.concat(callerLocs);
    const relevantVars = Array.from(new Set(allRelevantNodes.map(node => node.data("varname")).filter(x => x)));
    /*relevant_locs.push(new location.SourceLocation(progInPath,
        new location.Position(lineNb, 0),
        new location.Position(lineNb, Number.POSITIVE_INFINITY)))*/
    const prog = fs.readFileSync(progInPath).toString();
    const newprog = pruneProgram(prog, lineNb, graph, relevantLocs, relevantVars)
    fs.writeFileSync(progOutPath, newprog.code);

}


function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}


module.exports = {
    prune
};