"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphBasedPrune = void 0;
var fs_1 = require("fs");
var datatypes_1 = require("./datatypes");
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
/**
 * General pruning startegy: Keep statements such as if or for when they contain relevant locs.
 * Do not go further down than ExpressionStament. Keep it as a whole when relevant or prune it.
 * @param prog program to slice
 * @param relevantLocs locations to be preserved in slice, not including relevant variable declarations
 * @param relevant_vars names of variables that must be in slice
 * @returns pruned program
 */
function prune(prog, relevantLocs, relevant_vars) {
    var ast = (0, recast_1.parse)(prog);
    var sliceMeCallNode = ast.program.body.pop();
    ast_types_1.namedTypes.ExpressionStatement.assert(sliceMeCallNode);
    ast_types_1.namedTypes.CallExpression.assert(sliceMeCallNode.expression);
    (0, ast_types_1.visit)(ast, {
        visitStatement: function (path) {
            var node = path.node;
            // prevent recast from being to clever and negating an if condition when then branch is pruned
            if (path.name === "consequent") {
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
                // if it is an ExpressionStatement that has not been pruned, go no deeper
                return false;
            }
            // go deeper when it is a statement e.g. if that contains relevant nodes
            this.traverse(path);
        },
        visitIfStatement: function (path) {
            var node = path.node;
            if (this.isBreakMarker(node)) {
                if (relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.locEq(node.loc, rloc); })) {
                    path.replace(ast_types_1.builders.breakStatement());
                }
                else {
                    path.prune();
                }
                return false;
            }
            else {
                // if it is not a break marker if, handle it in general case
                return this.visitStatement(path);
            }
        },
        isBreakMarker: function (node) {
            return (node.test.type === "Literal" && node.test.value === true && node.consequent.type === "BreakStatement");
        },
        // special handling because jalangi does not give accurate locations for variable declarations, do it based on relevant_vars
        visitVariableDeclaration: function (path) {
            var node = path.node;
            if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(node.loc, rloc); }) &&
                !relevant_vars.includes(node.declarations[0].id.name)) {
                path.prune();
            }
            return false;
        },
        visitSwitchCase: function (path) {
            if (!relevantLocs.some(function (rloc) { return datatypes_1.SourceLocation.in_between_inclusive(path.node.loc, rloc); })) {
                path.prune();
                return false;
            }
            this.traverse(path);
        }
    });
    ast.program.body.push(sliceMeCallNode);
    return (0, recast_1.print)(ast);
}
/**
 * Start from nodes at slicingCriterion and nodes of executed break statements and
 * find all of their successors. This is a reachability analysis.
 * @param graph full execution graph
 * @param executedBreakNodes nodes in graph that represent executed break statements
 * @param slicingCriterion location of criterion
 * @returns collection of nodes at slicingCriterion, executedBreakNodes and all nodes reachable from them.
 */
function sliceNodes(graph, executedBreakNodes, slicingCriterion) {
    var nodesAtCriterion = graph
        .nodes()
        .filter(function (node) { return node.data("loc") && datatypes_1.SourceLocation.in_between_inclusive(slicingCriterion, node.data("loc")); });
    var startNodes = nodesAtCriterion.union(executedBreakNodes);
    return startNodes.union(startNodes.successors("node"));
}
/**
 * Each node corresponds to exactly one location. Map nodes to these.
 * @param nodes nodes relevant to slice
 * @param slicingCriterion location of criterion
 * @returns locations of nodes together with slicingCriterion and locations of callers.
 */
function sliceLocs(nodes, slicingCriterion) {
    var locs = Array.from(new Set(nodes.map(function (node) { return node.data("loc"); }))).filter(function (x) { return x; });
    var callerLocs = Array.from(new Set(nodes.map(function (node) { return node.data("callerLoc"); }).filter(function (x) { return x; })));
    locs.push.apply(locs, callerLocs);
    locs.push(slicingCriterion);
    return locs;
}
/**
 * Do reachability analysis on graph.
 * Then prune read the preprocessed program from progInPath, prune it and write it to progOutPath.
 * @param progInPath path of preprocessed program
 * @param progOutPath path to writer pruned program to
 * @param graph full graph constructed by dynamic analysis
 * @param executedBreakNodes nodes in graph that correspond to executed graphs
 * @param slicingCriterion location of criterion
 */
function graphBasedPrune(progInPath, progOutPath, graph, executedBreakNodes, slicingCriterion) {
    var nodes = sliceNodes(graph, executedBreakNodes, slicingCriterion);
    var locs = sliceLocs(nodes, slicingCriterion);
    var vars = Array.from(new Set(nodes.map(function (node) { return node.data("varname"); }).filter(function (x) { return x; })));
    var prog = (0, fs_1.readFileSync)(progInPath).toString();
    var newprog = prune(prog, locs, vars);
    (0, fs_1.writeFileSync)(progOutPath, newprog.code);
}
exports.graphBasedPrune = graphBasedPrune;
//# sourceMappingURL=pruner.js.map