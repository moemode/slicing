"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = void 0;
var fs_1 = require("fs");
var datatypes_1 = require("./datatypes");
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
var acorn_walk_1 = require("acorn-walk");
function pruneProgram(prog, lineNb, graph, relevantLocs, relevant_vars) {
    var ast = (0, recast_1.parse)(prog, { range: true });
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
            else if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); })) {
                path.prune();
                return false;
            }
            else if (node.type === "IfStatement") {
                var n_1 = (0, acorn_walk_1.findNodeAfter)(ast.program, node.range[1]);
                console.log(n_1);
                var _loop_1 = function (branchPath) {
                    if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(branchPath.node.loc, rloc); })) {
                        if (branchPath.name === "consequent") {
                            branchPath.replace(ast_types_1.builders.blockStatement([]));
                        }
                        else {
                            branchPath.prune();
                        }
                        //branchPath.node = b.blockStatement([]);
                    }
                    else {
                        this_1.traverse(branchPath);
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = [path.get("consequent"), path.get("alternate")].filter(function (x) { return x.value; }); _i < _a.length; _i++) {
                    var branchPath = _a[_i];
                    _loop_1(branchPath);
                }
            }
            else if (node.type != "ExpressionStatement") {
                this.traverse(path);
            }
            return false;
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
//# sourceMappingURL=parser.js.map