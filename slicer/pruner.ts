import { PathOrFileDescriptor, readFileSync, writeFileSync } from "fs";
import { SourceLocation } from "./datatypes";
import { parse, print } from "recast";
import { visit, namedTypes as n, builders as b } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";
import { Collection, Core } from "cytoscape";
import { PrintResultType } from "recast/lib/printer";

/**
 * General pruning startegy: Keep statements such as if or for when they contain relevant locs.
 * Do not go further down than ExpressionStament. Keep it as a whole when relevant or prune it.
 * @param prog program to slice
 * @param relevantLocs locations to be preserved in slice, not including relevant variable declarations
 * @param relevant_vars names of variables that must be in slice
 * @returns pruned program
 */
function prune(prog: string, relevantLocs: SourceLocation[], relevant_vars: string | unknown[]): PrintResultType {
    const ast = parse(prog);
    const sliceMeCallNode: n.ExpressionStatement = ast.program.body.pop();
    n.ExpressionStatement.assert(sliceMeCallNode);
    n.CallExpression.assert(sliceMeCallNode.expression);
    visit(ast, {
        visitStatement(path: NodePath<n.Statement>) {
            const node = path.node;
            // prevent recast from being to clever and negating an if condition when then branch is pruned
            if (path.name === "consequent") {
                if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))) {
                    path.replace(b.blockStatement([]));
                    return false;
                }
            } else if (
                !relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))
            ) {
                path.prune();
                return false;
            } else if (node.type === "ExpressionStatement") {
                // if it is an ExpressionStatement that has not been pruned, go no deeper
                return false;
            }
            // go deeper when it is a statement e.g. if that contains relevant nodes
            this.traverse(path);
        },
        visitIfStatement(path: NodePath<n.IfStatement>) {
            const node = path.node;
            if (this.isBreakMarker(node)) {
                if (relevantLocs.some((rloc: SourceLocation) => SourceLocation.locEq(node.loc, rloc))) {
                    path.replace(b.breakStatement());
                } else {
                    path.prune();
                }
                return false;
            } else {
                // if it is not a break marker if, handle it in general case
                return this.visitStatement(path);
            }
        },
        isBreakMarker(node: n.IfStatement): boolean {
            return (
                node.test.type === "Literal" && node.test.value === true && node.consequent.type === "BreakStatement"
            );
        },
        // special handling because jalangi does not give accurate locations for variable declarations, do it based on relevant_vars
        visitVariableDeclaration(path: NodePath<n.VariableDeclaration>) {
            const node = path.node;
            if (
                !relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc)) &&
                !relevant_vars.includes(node.declarations[0].id.name)
            ) {
                path.prune();
            }
            return false;
        },
        visitSwitchCase(path: NodePath<n.SwitchCase>) {
            if (
                !relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(path.node.loc, rloc))
            ) {
                path.prune();
                return false;
            }
            this.traverse(path);
        }
    });
    ast.program.body.push(sliceMeCallNode);
    return print(ast);
}

/**
 * Start from nodes at slicingCriterion and find all of their successors.
 * This is a reachability analysis.
 * @param graph full execution graph
 * @param slicingCriterion location of criterion
 * @returns collection of nodes at slicingCriterion, and all nodes reachable from them.
 */
function sliceNodes(graph: Core, slicingCriterion: SourceLocation): Collection {
    const nodesAtCriterion = graph
        .nodes()
        .filter((node) => node.data("loc") && SourceLocation.in_between_inclusive(slicingCriterion, node.data("loc")));
    return nodesAtCriterion.union(nodesAtCriterion.successors("node"));
}

/**
 * Each node corresponds to exactly one location. Map nodes to these.
 * @param nodes nodes relevant to slice
 * @param slicingCriterion location of criterion
 * @returns locations of nodes, additionally slicingCriterion.
 */
function sliceLocs(nodes: Collection, slicingCriterion: SourceLocation): SourceLocation[] {
    const locs: SourceLocation[] = Array.from(new Set(nodes.map((node) => node.data("loc")))).filter((x) => x);
    locs.push(slicingCriterion);
    return locs;
}

/**
 * Do reachability analysis on graph.
 * Then prune read the preprocessed program from progInPath, prune it and write it to progOutPath.
 * @param progInPath path of preprocessed program
 * @param progOutPath path to writer pruned program to
 * @param graph full graph constructed by dynamic analysis, each node corresponds to a SourceLocation
 * @param executedBreakNodes nodes in graph that correspond to executed graphs
 * @param slicingCriterion location of criterion
 */
function graphBasedPrune(
    progInPath: PathOrFileDescriptor,
    progOutPath: PathOrFileDescriptor,
    graph: Core,
    slicingCriterion: SourceLocation
): void {
    const nodes = sliceNodes(graph, slicingCriterion);
    const locs = sliceLocs(nodes, slicingCriterion);
    const vars: string[] = Array.from(new Set(nodes.map((node) => node.data("varname")).filter((x) => x)));
    const prog = readFileSync(progInPath).toString();
    const newprog = prune(prog, locs, vars);
    writeFileSync(progOutPath, newprog.code);
}

export { graphBasedPrune };
