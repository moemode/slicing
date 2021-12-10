/* Import necessary modules */
var acorn = require('acorn');
var esc = require('escodegen')
var fs = require('fs');
var estrav = require('estraverse');
var location = require('./datatypes');
var cytoscape = require("cytoscape");
const { parse, print } = require("recast");
const astt = require("ast-types");

function toAst(filePathIn, filePathOut) {
    let prog = fs.readFileSync(filePathIn).toString();
    var ast = acorn.parse(prog, { ecmaVersion: 5, locations: true });
    let newprog = esc.generate(ast);
    fs.writeFileSync(filePathOut, newprog);
}

class BranchDependency {
    constructor(testLoc, branchLoc, type) {
        this.testLoc = testLoc;
        this.branchLoc = branchLoc;
        this.type = type;
    }
}

class Test {
    constructor(testLoc, type) {
        this.testLoc = testLoc;
        this.type = type;
    }
}

function computeControlDeps(prog) {
    const graph = cytoscape();
    const ast = parse(prog)
    const fbody_ast = ast.program.body[0];
    const controlDeps = [];
    const testLocs = [];
    parentTest = [];
    astt.visit(fbody_ast, {
        visitIfStatement(path) {
            const node = path.node;
            testLocs.push(new Test(node.test.loc, "if"));
            controlDeps.push(new BranchDependency(node.test.loc, node.consequent.loc, "ifthen"));
            if (node.alternate) {
                controlDeps.push(new BranchDependency(node.test.loc, node.alternate.loc, "ifelse"));
            }
            this.traverse(path)
        },
        visitForStatement(path) {
            const node = path.node;
            const forHeadLoc = computeForHeadLocation([node.init, node.test, node.update], node.loc);
            testLocs.push(new Test(forHeadLoc, "for"));
            controlDeps.push(new BranchDependency(forHeadLoc, node.body.loc, "for"));
            this.traverse(path);
        },
        visitSwitchStatement(path) {
            const node = path.node;
            const caseCount = node.cases.length;
            if (caseCount > 0) {
                testLocs.push(new Test(node.discriminant.loc, "switch"));
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
    return [controlDeps, testLocs];
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
    const graph = computeControlDeps(prog);
    fs.writeFileSync("cgraph.json", graph);// JSON.stringify(graph.json()));
}

//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/a8_in.js");
//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/b2_in.js");
//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/a9_in.js");
controlDependencies("/home/v/slicing/slicer/testcases/milestone3/b1_in.js");



function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}

function in_between_inclusive(outer, inner) {
    return (outer.start.line <= inner.start.line &&
        outer.start.column <= inner.start.column &&
        inner.end.line <= outer.end.line &&
        inner.end.column <= outer.end.column)
}

module.exports = {
    computeControlDeps: computeControlDeps
};