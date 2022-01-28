import * as fs from "fs";
import { SourceLocation, Position } from "./datatypes";
import { parse } from "recast";
import { visit } from "ast-types";

class BranchDependency {
    constructor(public readonly testLoc: SourceLocation, public readonly branchLoc: SourceLocation, public readonly type: string) {}
}

class Test {
    constructor(public readonly loc: SourceLocation, public readonly type: string) {}
}

function computeControlDeps(prog): [BranchDependency[], Test[]]{
    const ast = parse(prog);
    const fbody_ast = ast.program.body[0];
    const controlDeps: BranchDependency[] = [];
    const tests: Test[] = [];
    visit(fbody_ast, {
        visitIfStatement(path) {
            const node = path.node;
            tests.push(new Test(node.test.loc, "if"));
            controlDeps.push(new BranchDependency(node.test.loc, node.consequent.loc, "ifthen"));
            if (node.alternate) {
                controlDeps.push(new BranchDependency(node.test.loc, node.alternate.loc, "ifelse"));
            }
            this.traverse(path)
        },
        visitForStatement(path) {
            const node = path.node;
            //const forHeadLoc = computeForHeadLocation([node.init, node.test, node.update], node.loc);
            tests.push(new Test(node.test.loc, "for"));
            controlDeps.push(new BranchDependency(node.test.loc, node.body.loc, "for"));
            controlDeps.push(new BranchDependency(node.test.loc, node.update.loc, "for"));
            this.traverse(path);
        },
        visitSwitchStatement(path) {
            const node = path.node;
            const caseCount = node.cases.length;
            if (caseCount > 0) {
                tests.push(new Test(node.discriminant.loc, "switch-disc"));
                // track dependency of everything in switch to the discriminant
                controlDeps.push(new BranchDependency(node.discriminant.loc,
                    new SourceLocation(node.cases[0].loc.start, node.cases[caseCount - 1].loc.end),
                    "switch-disc"));
                // track dependency of everything in a case body on that case
                for (const scase of node.cases) {
                    console.log(scase);
                    const consequentLenght = scase.consequent.length;
                    if (consequentLenght > 0 && scase.test !== null) {
                        tests.push(new Test(scase.test.loc, "switch-test"));
                        controlDeps.push(new BranchDependency(scase.test.loc,
                            new SourceLocation(scase.consequent[0].loc.start, scase.consequent[consequentLenght - 1].loc.end),
                            "switch-test"));
                    }
                }
            }
            this.traverse(path);
        },
        visitNode(path) {
            this.traverse(path);
        }
    })
    return [controlDeps, tests];
}

function findControlDep(loc: SourceLocation, controlDeps) {
    const locDeps = controlDeps.filter(cD => SourceLocation.in_between_inclusive(cD.branchLoc, loc));
    //find smallest branchLoc
    if (locDeps.length > 0) {
        const locCD = locDeps.reduce((prev, curr) => Position.posIsSmallerEq(prev.branchLoc.start, curr.branchLoc.start) ? curr : prev);
        return locCD;
    }
}



function controlDependencies(progInPath): [BranchDependency[], Test[]]{
    const prog = fs.readFileSync(progInPath).toString();
    const controlData = computeControlDeps(prog);
    return controlData;
}

export {
    computeControlDeps,
    controlDependencies,
    findControlDep,
};