import { PathOrFileDescriptor, readFileSync, writeFileSync } from "fs";
import { SourceLocation } from "./datatypes";
import { parse, print } from "recast";
import { visit, namedTypes as n, builders as b } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";
import { Collection, Core } from "cytoscape";
import { PrintResultType } from "recast/lib/printer";

function pruneProgram(prog: string, relevantLocs: SourceLocation[], relevant_vars: string | unknown[]): PrintResultType {
    const ast = parse(prog);
    visit(ast, {
        visitIfStatement(path: NodePath<n.IfStatement>) {
            const node = path.node;
            if (node.test.type === "Literal" && node.test.value === true && node.consequent.type === "BreakStatement") {
                if (relevantLocs.some((rloc: SourceLocation) => SourceLocation.locEq(node.loc, rloc))) {
                    path.replace(b.breakStatement());
                } else {
                    path.prune();
                }
                return false;
            } else {
                return this.visitStatement(path);
            }
        },
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
        visitStatement(path: NodePath<n.Statement>) {
            const node = path.node;
            /*
            if (SourceLocation.within_line(node.loc, lineNb)) {
                return false;
            }*/
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
                return false;
            }
            this.traverse(path);
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
    return print(ast);
}

function prune(
    progInPath: PathOrFileDescriptor,
    progOutPath: PathOrFileDescriptor,
    graph: Core,
    execBreakLocs: SourceLocation[],
    executedBreakNodes: Collection,
    slicingCriterion: SourceLocation
): void {
    const nodesAtCriterion = graph
        .nodes()
        .filter((node) => SourceLocation.in_between_inclusive(slicingCriterion, node.data("loc")));
    const startNodes = nodesAtCriterion.union(executedBreakNodes);
    const nodes = startNodes.union(startNodes.successors("node"));
    const locs: SourceLocation[] = Array.from(new Set(nodes.map((node) => node.data("loc"))));
    const callerLocs = Array.from(new Set(nodes.map((node) => node.data("callerLoc")).filter((x) => x)));
    const relevantVars: string[] = Array.from(new Set(nodes.map((node) => node.data("varname")).filter(x => x)));
    const prog = readFileSync(progInPath).toString();
    const newprog = pruneProgram(prog, locs.concat(callerLocs), relevantVars);
    writeFileSync(progOutPath, newprog.code);
}

export { prune };
