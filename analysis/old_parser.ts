import {PathOrFileDescriptor, readFileSync, writeFileSync} from "fs";
import { SourceLocation } from "./datatypes";
import { parse, print } from "recast";
import * as esprima from "esprima";
import {visit} from "ast-types";


function pruneProgram(prog: string, lineNb: number, graph: any, relevantLocs: any[], relevant_vars: string | unknown[]) {
    const ast = parse(prog);
    visit(ast, {
        visitNode(path) {
            const node = path.node;
            if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                if (relevantLocs.some((nLoc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, nLoc))) {
                    return false;
                }
                path.prune();
                return false;
            }
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
            }
            if (SourceLocation.within_line(node.loc, lineNb)) {
                return false;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))) {
                    return false;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "IfStatement") {
                if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.test.loc, rloc))) {
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
                if (relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))) {
                    return false;
                } else {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "SwitchStatement") {
                if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    path.prune();
                    return false;
                }
            }
            if (node.type === "SwitchCase") {
                if (!relevantLocs.some((rloc: SourceLocation) => SourceLocation.in_between_inclusive(node.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    path.prune();
                    return false;
                }
            }
            this.traverse(path);
        }
    });
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