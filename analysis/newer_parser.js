"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = void 0;
var fs_1 = require("fs");
var datatypes_1 = require("./datatypes");
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
function pruneProgram(prog, lineNb, graph, relevantLocs, relevant_vars) {
    var ast = (0, recast_1.parse)(prog);
    /* {
        parser: esprima,
    })*/
    (0, ast_types_1.visit)(ast, {
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
            if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                path.prune();
                return false;
            }
            if (node.type != "ExpressionStatement") {
                this.traverse(path);
            }
            else {
                return false;
            }
        },
        visitSwitchCase: function (path) {
            if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(path.node.loc, rloc); })) {
                // if was not reached in execution -> remove fully
                path.prune();
            }
            return false;
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
//# sourceMappingURL=newer_parser.js.map