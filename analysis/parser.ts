import { PathOrFileDescriptor, readFileSync, writeFileSync } from "fs";
import { SourceLocation } from "./datatypes";
import { parse, print } from "recast";
import * as esprima from "esprima";
import { visit, namedTypes as n, builders as b} from "ast-types";
import { NodePath } from "ast-types/lib/node-path";


function pruneProgram(prog: string, lineNb: number, graph: any, relevantLocs: any[], relevant_vars: string | unknown[]) {
    const ast = parse(prog);
    const pruningVisitor = {
        visitVariableDeclaration(path: NodePath<n.VariableDeclaration>) {
            const node = path.node;
            if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc)) &&
                !relevant_vars.includes(node.declarations[0].id.name)) {
                path.prune();
            }
            return false;
        },
        visitStatement(path: NodePath<n.Statement>) {
            const node = path.node;
            if (SourceLocation.within_line(node.loc, lineNb)) {
                return false;
            } 
            else if (path.name === "consequent") {
                if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))) {
                        path.replace(b.blockStatement([]));
                        return false;
                }
            }
            else if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))) {
                path.prune();
                return false;
            }
            else if (node.type === "ExpressionStatement") {
                return false;
            }
            this.traverse(path);
        },
        
        visitSwitchCase(path: NodePath<n.SwitchCase>) {
            if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(path.node.loc, rloc))) {
                path.prune();
            }
            return false;
        }
    };
    visit(ast, pruningVisitor);
    return print(ast);
}

function prune(progInPath: PathOrFileDescriptor, progOutPath: PathOrFileDescriptor, graph: { nodes: (arg0: string) => any; }, lineNb: number) {
    const readsInLineNbCriterion = `node[type="write"][line=${lineNb}], node[type="read"][line=${lineNb}], node[type="getField"][line=${lineNb}]`
    const testsInLineNbCriterion = `node[type="if-test"][line=${lineNb}], node[type="for-test"][line=${lineNb}], node[type="switch-test-test"][line=${lineNb}], node[type="switch-disc-test"][line=${lineNb}]`;
    const endExpressionCrit = `node[type="end-expression"][line=${lineNb}]`
    const relevantNodesInLine = graph.nodes(readsInLineNbCriterion + ", " + testsInLineNbCriterion + ", " + endExpressionCrit);
    const reachableNodes = relevantNodesInLine.successors("node");
    const allRelevantNodes = reachableNodes.union(relevantNodesInLine);
    const nodeLocs = Array.from(new Set(allRelevantNodes.map((node: { data: (arg0: string) => any; }) => node.data("loc"))));
    const callerLocs = Array.from(new Set(allRelevantNodes.map((node: { data: (arg0: string) => any; }) => node.data("callerLoc")).filter((x: any) => x)));
    const relevantLocs = nodeLocs.concat(callerLocs);
    const relevantVars = Array.from(new Set(allRelevantNodes.map((node: { data: (arg0: string) => any; }) => node.data("varname")).filter((x: any) => x)));
    /*relevant_locs.push(new location.SourceLocation(progInPath,
        new location.Position(lineNb, 0),
        new location.Position(lineNb, Number.POSITIVE_INFINITY)))*/
    const prog = readFileSync(progInPath).toString();
    const newprog = pruneProgram(prog, lineNb, graph, relevantLocs, relevantVars)
    writeFileSync(progOutPath, newprog.code);
}


export {
    prune
};