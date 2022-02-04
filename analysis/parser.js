"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = void 0;
var fs_1 = require("fs");
var datatypes_1 = require("./datatypes");
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
function pruneProgram(prog, relevantLocs, relevant_vars) {
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
            /*
            if (SourceLocation.within_line(node.loc, lineNb)) {
                return false;
            }*/
            if (false) { }
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
function prune(progInPath, progOutPath, graph, execBreakLocs, executedBreakNodes, slicingCriterion) {
    var nodesAtCriterion = graph.nodes().filter(function (e, i) { return datatypes_1.SourceLocation.in_between_inclusive(slicingCriterion, e.data("loc")); });
    var startNodes = nodesAtCriterion.union(executedBreakNodes);
    var nodes = startNodes.union(startNodes.successors("node"));
    var locs = Array.from(new Set(nodes.map(function (node) { return node.data("loc"); })));
    var callerLocs = Array.from(new Set(nodes.map(function (node) { return node.data("callerLoc"); }).filter(function (x) { return x; })));
    var relevantVars = Array.from(new Set(nodes.map(function (node) { return node.data("varname"); }).filter(function (x) { return x; })));
    var prog = (0, fs_1.readFileSync)(progInPath).toString();
    var newprog = pruneProgram(prog, locs.concat(callerLocs), relevantVars);
    (0, fs_1.writeFileSync)(progOutPath, newprog.code);
}
exports.prune = prune;
//# sourceMappingURL=parser.js.map