/* Import necessary modules */
//var acorn = require('acorn');
var esc = require('escodegen')
var fs = require('fs');
var esprima = require('esprima');
var estrav = require('estraverse');
var location = require('./datatypes');
var cytoscape = require("cytoscape");
var { parse, print } = require("recast");
var astt = require("ast-types");

class BranchDependency {
    constructor(testLoc, branchLoc, type) {
        this.testLoc = testLoc;
        this.branchLoc = branchLoc;
        this.type = type;
    }
}

class Test {
    constructor(loc, type) {
        this.loc = loc;
        this.type = type;
    }
}

function computeControlDeps(prog) {
    const graph = cytoscape();
    const ast = parse(prog, {
        parser: esprima,
    })
    const fbody_ast = ast.program.body[0];
    const controlDeps = [];
    const tests = [];
    parentTest = [];
    astt.visit(fbody_ast, {
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
                    new location.SourceLocation(null, node.cases[0].loc.start, node.cases[caseCount - 1].loc.end),
                    "switch-disc"));
                // track dependency of everything in a case body on that case
                for (const scase of node.cases) {
                    console.log(scase);
                    const consequentLenght = scase.consequent.length;
                    if (consequentLenght > 0 && scase.test !== null) {
                        tests.push(new Test(scase.test.loc, "switch-test"));
                        controlDeps.push(new BranchDependency(scase.test.loc,
                            new location.SourceLocation(null, scase.consequent[0].loc.start, scase.consequent[consequentLenght - 1].loc.end),
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

function findControlDep(loc, controlDeps) {
    const locDeps = controlDeps.filter(cD => location.in_between_inclusive(cD.branchLoc, loc));
    //find smallest branchLoc
    if (locDeps.length > 0) {
        const locCD = locDeps.reduce((prev, curr) => location.posIsSmaller(prev.branchLoc.start, curr.branchLoc.start) ? curr : prev);
        return locCD;
    }
}


function findTest(loc, tests) {
    const test = tests.filter(test => location.in_between_inclusive(test.loc, loc));
    if (test.length > 1) {
        console.log("more than one test loc, this must never happen");
        throw "Fehler";
    } else if (test.length === 1) {
        return test[0];
    }
}

function computeForHeadLocation(potentialForExpressionNodes, forLoc) {
    const forExpressionNodes = potentialForExpressionNodes.filter(e => e != null);
    if (forExpressionNodes.length === 0) {
        return forLoc;
    } else {
        //const forExpressionLocs = forExpressionNodes.flatMap(n => [n.loc.start, n.loc.end]);
        const startPosition = forExpressionNodes[0].loc.start;
        const endPosition = forExpressionNodes[forExpressionNodes.length - 1].loc.end;
        return new location.SourceLocation(null, startPosition, endPosition);
    }
}


function controlDependencies(progInPath) {
    const prog = fs.readFileSync(progInPath).toString();
    const controlData = computeControlDeps(prog);
    //fs.writeFileSync("cgraph.json", graph);// JSON.stringify(graph.json()));
    return controlData;
}

//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/a8_in.js");
//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/b2_in.js");
//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/a9_in.js");
//const [cDeps, testLocs] = controlDependencies("/home/v/slicing/slicer/testcases/milestone3/b1_in.js");
const loc = new location.SourceLocation(null,
    new location.Position(10, 16),
    new location.Position(10, 32));
//findControlDep(loc, cDeps);


function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}

module.exports = {
    computeControlDeps,
    controlDependencies,
    findControlDep,
};