/* Import necessary modules */
//var acorn = require('acorn');
var esc = require('escodegen')
var fs = require('fs');
var estrav = require('estraverse');
var location = require('./datatypes');
var cytoscape = require("cytoscape");
var recast = require("recast");
var astt = require("ast-types");

/*
function toAst(filePathIn, filePathOut) {
    let prog = fs.readFileSync(filePathIn).toString();
    var ast = acorn.parse(prog, { ecmaVersion: 5, locations: true });
    let newprog = esc.generate(ast);
    fs.writeFileSync(filePathOut, newprog);
}
*/

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
    const ast = recast.parse(prog)
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
                tests.push(new Test(node.discriminant.loc, "switch"));
                controlDeps.push(new BranchDependency(node.discriminant.loc,
                    new location.SourceLocation(null, node.cases[0].loc.start, node.cases[caseCount - 1].loc.end),
                    "switch"));
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
    const locCD = locDeps.reduce((prev, curr) => location.posIsSmaller(prev.branchLoc.start, curr.branchLoc.start) ? curr : prev);
    return locCD;
}

function findTest(loc, tests) {
    const test = tests.filter(test => location.in_between_inclusive(test.loc, loc));
    if (test.length > 1) {
        console.log("more than one test loc, this must never happen");
        throw "Fehler";
    } else if(test.length === 1) {
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
    controlDependencies
};