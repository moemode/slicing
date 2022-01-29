"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = void 0;
var fs_1 = require("fs");
var datatypes_1 = require("./datatypes");
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
function pruneProgram(prog, lineNb, relevantLocs, relevant_vars) {
    var ast = (0, recast_1.parse)(prog);
    (0, ast_types_1.visit)(ast, {
        visitIfStatement: function (path) {
            var node = path.node;
            if (node.test.type === "Literal" && node.test.value === true && node.consequent.type === "BreakStatement") {
                if (relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.locEq(node.loc, rloc); })) {
                    path.replace(ast_types_1.builders.breakStatement());
                }
                else {
                    path.prune();
                }
                return false;
            }
            else {
                return this.visitStatement(path);
            }
        },
        visitVariableDeclaration: function (path) {
            var node = path.node;
            if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); }) &&
                !relevant_vars.includes(node.declarations[0].id.name)) {
                path.prune();
            }
            return false;
        },
        visitStatement: function (path) {
            var node = path.node;
            if (datatypes_1.SourceLocation.within_line(node.loc, lineNb)) {
                return false;
            }
            else if (path.name === "consequent") {
                if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                    path.replace(ast_types_1.builders.blockStatement([]));
                    return false;
                }
            }
            else if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                path.prune();
                return false;
            }
            else if (node.type === "ExpressionStatement") {
                return false;
            }
            this.traverse(path);
        },
        visitSwitchCase: function (path) {
            if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(path.node.loc, rloc); })) {
                path.prune();
                return false;
            }
            this.traverse(path);
        },
    });
    return (0, recast_1.print)(ast);
}
function prune(progInPath, progOutPath, graph, execBreakLocs, executedBreakNodes, lineNb) {
    var readsInLineNbCriterion = "node[type=\"write\"][line=".concat(lineNb, "], node[type=\"read\"][line=").concat(lineNb, "], node[type=\"getField\"][line=").concat(lineNb, "]");
    var testsInLineNbCriterion = "node[type=\"if-test\"][line=".concat(lineNb, "], node[type=\"for-test\"][line=").concat(lineNb, "], node[type=\"switch-test-test\"][line=").concat(lineNb, "], node[type=\"switch-disc-test\"][line=").concat(lineNb, "]");
    var endExpressionCrit = "node[type=\"end-expression\"][line=".concat(lineNb, "]");
    var relevantNodesInLine = graph.nodes(readsInLineNbCriterion + ", " + testsInLineNbCriterion + ", " + endExpressionCrit);
    var reachableNodes = relevantNodesInLine.successors("node");
    var allRelevantNodes = reachableNodes.union(relevantNodesInLine).union(relevantBreakNodesAndDeps(executedBreakNodes));
    var nodeLocs = Array.from(new Set(allRelevantNodes.map(function (node) { return node.data("loc"); })));
    var callerLocs = Array.from(new Set(allRelevantNodes.map(function (node) { return node.data("callerLoc"); }).filter(function (x) { return x; })));
    var relevantVars = Array.from(new Set(allRelevantNodes.map(function (node) { return node.data("varname"); }).filter(function (x) { return x; })));
    var relevantLocs = nodeLocs.concat(callerLocs); //.concat(execBreakLocs);
    var prog = (0, fs_1.readFileSync)(progInPath).toString();
    var newprog = pruneProgram(prog, lineNb, relevantLocs, relevantVars);
    (0, fs_1.writeFileSync)(progOutPath, newprog.code);
}
exports.prune = prune;
function relevantBreakNodesAndDeps(executedBreakNodes) {
    return executedBreakNodes.union(executedBreakNodes.successors("node"));
}
//# sourceMappingURL=parser.js.map