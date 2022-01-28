"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = void 0;
var fs_1 = require("fs");
var datatypes_1 = require("./datatypes");
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
function pruneProgram(prog, lineNb, graph, relevantLocs, relevant_vars) {
    var ast = (0, recast_1.parse)(prog);
    (0, ast_types_1.visit)(ast, {
        visitNode: function (path) {
            var node = path.node;
            if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                if (relevantLocs.some(function (nLoc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, nLoc); })) {
                    return false;
                }
                path.prune();
                return false;
            }
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
            }
            if (datatypes_1.SourceLocation.within_line(node.loc, lineNb)) {
                return false;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                    return false;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "IfStatement") {
                if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.test.loc, rloc); })) {
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
                if (relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                    return false;
                }
                else {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "SwitchStatement") {
                if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                    // if was not reached in execution -> remove fully
                    path.prune();
                    return false;
                }
            }
            if (node.type === "SwitchCase") {
                if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                    // if was not reached in execution -> remove fully
                    path.prune();
                    return false;
                }
            }
            this.traverse(path);
        }
    });
    return (0, recast_1.print)(ast);
}
function prune(progInPath, progOutPath, graph, lineNb) {
    var readsInLineNbCriterion = "node[type=\"write\"][line=".concat(lineNb, "], node[type=\"read\"][line=").concat(lineNb, "], node[type=\"getField\"][line=").concat(lineNb, "]");
    var testsInLineNbCriterion = "node[type=\"if-test\"][line=".concat(lineNb, "], node[type=\"for-test\"][line=").concat(lineNb, "], node[type=\"switch-test-test\"][line=").concat(lineNb, "], node[type=\"switch-disc-test\"][line=").concat(lineNb, "]");
    var endExpressionCrit = "node[type=\"end-expression\"][line=".concat(lineNb, "]");
    var relevantNodesInLine = graph.nodes(readsInLineNbCriterion + ", " + testsInLineNbCriterion + ", " + endExpressionCrit);
    var reachableNodes = relevantNodesInLine.successors("node");
    var allRelevantNodes = reachableNodes.union(relevantNodesInLine);
    var nodeLocs = Array.from(new Set(allRelevantNodes.map(function (node) { return node.data("loc"); })));
    var callerLocs = Array.from(new Set(allRelevantNodes.map(function (node) { return node.data("callerLoc"); }).filter(function (x) { return x; })));
    var relevantLocs = nodeLocs.concat(callerLocs);
    var relevantVars = Array.from(new Set(allRelevantNodes.map(function (node) { return node.data("varname"); }).filter(function (x) { return x; })));
    /*relevant_locs.push(new location.SourceLocation(progInPath,
        new location.Position(lineNb, 0),
        new location.Position(lineNb, Number.POSITIVE_INFINITY)))*/
    var prog = (0, fs_1.readFileSync)(progInPath).toString();
    var newprog = pruneProgram(prog, lineNb, graph, relevantLocs, relevantVars);
    (0, fs_1.writeFileSync)(progOutPath, newprog.code);
}
exports.prune = prune;
//# sourceMappingURL=old_parser.js.map