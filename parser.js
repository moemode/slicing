var fs = require('fs');
var location = require('./datatypes');
var esprima = require('esprima');
var { parse, print } = require("recast");
var astt = require("ast-types");
var estraverse = require("estraverse");
var acorn = require("acorn");
var jscsh = require("jscodeshift");
const { findBreakMarkers } = require('./break_marker');


function pruneProgram(prog, lineNb, graph, relevantLocs, relevant_vars, conditionalStatistics) {
    const ast = parse(prog, {
        parser: esprima,
    });

    astt.visit(ast, {
        visitNode(path) {
            const node = path.node;
            if (this.isIfThenBreak(node)) {
                if(conditionalStatistics[location.positionToString(node.test.loc.start)]) {
                    //break reached -> remove enclosing if
                    const breakStatement = astt.builders.breakStatement();
                    breakStatement.isFiller = true;
                    path.replace(breakStatement);
                    return false;
                } else {
                    //break never reached
                    path.prune();
                    return false;
                }
            }
            if (node.isFiller) {
                return false;
            }
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
            if (node.type === "BlockStatement" && path.name === "consequent") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    const blockStatement = astt.builders.blockStatement([]);
                    blockStatement.isFiller = true;
                    path.parent.node[path.name] = blockStatement;
                    return false;
                }
            }
            if (node.type === "BlockStatement" && path.name === "alternate") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    path.parent.node[path.name] = null;
                    return false;
                }
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
        },
        isIfThenBreak(node) {
            return node.type === "IfStatement" && node.test.value === true && 
            node.consequent.type === "BreakStatement" && !node.alternate;
        }
    });
    return print(ast);
}


function prune(progInPath, progOutPath, graph, lineNb, conditionalStatistics) {
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
    //TODO: Include taken ifthenbreaks into relevantLocs
    //S1 find locations of all ifthenbreaks
    const ifTrueBreakLocs = findBreakMarkers(prog);
    //S2 keep ifthenbreaks when conditionalsStatistics shows it was executed
    const executedIfTrueBreakLocs = ifTrueBreakLocs.filter(testPos => conditionalStatistics[location.positionToString(testPos)]);
    const newprog = pruneProgram(prog, lineNb, graph, relevantLocs, relevantVars, conditionalStatistics)
    fs.writeFileSync(progOutPath, newprog.code);
}


function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}


module.exports = {
    prune
};