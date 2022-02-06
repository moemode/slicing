import * as fs from "fs";
import { SourceLocation, Position } from "./datatypes";
import { parse } from "recast";
import { visit, namedTypes as n } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";
import * as esprima from "esprima";


class ControlDependency {
    constructor(
        public readonly testLoc: SourceLocation,
        public readonly branchLoc: SourceLocation,
        public readonly type: string
    ) { }
}

class Test {
    constructor(public readonly loc: SourceLocation, public readonly type: string) { }
}

/**
 * This is not a full PDG computation. Walks the AST of the program to find
 * control dependencies.
 * @param prog program text
 * @returns control dependencies introduced by if-, for- and switch statements and
 * information about every test e.g. if condition.
 */
function computeControlDependencies(prog: string): [ControlDependency[], Test[]] {
    const ast = parse(prog, {
        parser: esprima
    });
    const fbody_ast = ast.program.body[0];
    const controlDeps: ControlDependency[] = [];
    const tests: Test[] = [];
    visit(fbody_ast, {
        visitIfStatement(path: NodePath<n.IfStatement>) {
            const node = path.node;
            tests.push(new Test(node.test.loc, "if"));
            controlDeps.push(new ControlDependency(node.test.loc, node.consequent.loc, "ifthen"));
            if (node.alternate) {
                controlDeps.push(new ControlDependency(node.test.loc, node.alternate.loc, "ifelse"));
            }
            this.traverse(path);
        },
        visitForStatement(path: NodePath<n.ForStatement>) {
            const node = path.node;
            //const forHeadLoc = computeForHeadLocation([node.init, node.test, node.update], node.loc);
            tests.push(new Test(node.test.loc, "for"));
            controlDeps.push(new ControlDependency(node.test.loc, node.body.loc, "for"));
            controlDeps.push(new ControlDependency(node.test.loc, node.update.loc, "for"));
            this.traverse(path);
        },
        visitSwitchStatement(path: NodePath<n.SwitchStatement>) {
            const node = path.node;
            const caseCount = node.cases.length;
            if (caseCount > 0) {
                tests.push(new Test(node.discriminant.loc, "switch-disc"));
                // track dependency of everything in switch to the discriminant
                controlDeps.push(
                    new ControlDependency(
                        node.discriminant.loc,
                        new SourceLocation(node.cases[0].loc.start, node.cases[caseCount - 1].loc.end),
                        "switch-disc"
                    )
                );
                // track dependency of everything in a case body on that case
                for (const scase of node.cases) {
                    console.log(scase);
                    const consequentLenght = scase.consequent.length;
                    if (consequentLenght > 0 && scase.test !== null) {
                        tests.push(new Test(scase.test.loc, "switch-test"));
                        controlDeps.push(
                            new ControlDependency(
                                scase.test.loc,
                                new SourceLocation(
                                    scase.consequent[0].loc.start,
                                    scase.consequent[consequentLenght - 1].loc.end
                                ),
                                "switch-test"
                            )
                        );
                    }
                }
            }
            this.traverse(path);
        },
        visitNode(path) {
            this.traverse(path);
        }
    });
    return [controlDeps, tests];
}

/**
 * 
 * @param loc a location that might be in a conditional block, e.g. in body of for
 * @param deps all control depenendencies as computed by computeControlDependencies
 * @returns data about innermost control dependency. Thus, if loc is within if which is within
 * for, only information about if is returned. If there is no dependency, return value is undefined.
 */
function cDepForLoc(loc: SourceLocation, deps: ControlDependency[]): ControlDependency | undefined {
    const enclosingDeps = deps.filter((d) => SourceLocation.in_between_inclusive(d.branchLoc, loc));
    if (enclosingDeps.length > 0) {
        const innermost = enclosingDeps.reduce((prev, curr) =>
            Position.posIsSmallerEq(prev.branchLoc.start, curr.branchLoc.start) ? curr : prev
        );
        return innermost;
    }
}

/**
 * Open program at progInPath an call computeControlDependencies on it.
 * @param progInPath path of program
 * @returns control dependencies introduced by if-, for- and switch statements and
 * information about every test e.g. if condition.
 */
function controlDependencies(progInPath: string): [ControlDependency[], Test[]] {
    const prog = fs.readFileSync(progInPath).toString();
    const controlData = computeControlDependencies(prog);
    return controlData;
}

export {ControlDependency, Test ,controlDependencies, cDepForLoc };
