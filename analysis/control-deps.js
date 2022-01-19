/* Import necessary modules */
//var acorn = require('acorn');
var esc = require('escodegen');
var fs = require('fs');
var esprima = require('esprima');
var estrav = require('estraverse');
var location = require('./datatypes');
var cytoscape = require("cytoscape");
var _a = require("recast"), parse = _a.parse, print = _a.print;
var astt = require("ast-types");
var BranchDependency = /** @class */ (function () {
    function BranchDependency(testLoc, branchLoc, type) {
        this.testLoc = testLoc;
        this.branchLoc = branchLoc;
        this.type = type;
    }
    return BranchDependency;
}());
var Test = /** @class */ (function () {
    function Test(loc, type) {
        this.loc = loc;
        this.type = type;
    }
    return Test;
}());
function computeControlDeps(prog) {
    var graph = cytoscape();
    var ast = parse(prog, {
        parser: esprima,
    });
    var fbody_ast = ast.program.body[0];
    var controlDeps = [];
    var tests = [];
    parentTest = [];
    astt.visit(fbody_ast, {
        visitIfStatement: function (path) {
            var node = path.node;
            tests.push(new Test(node.test.loc, "if"));
            controlDeps.push(new BranchDependency(node.test.loc, node.consequent.loc, "ifthen"));
            if (node.alternate) {
                controlDeps.push(new BranchDependency(node.test.loc, node.alternate.loc, "ifelse"));
            }
            this.traverse(path);
        },
        visitForStatement: function (path) {
            var node = path.node;
            //const forHeadLoc = computeForHeadLocation([node.init, node.test, node.update], node.loc);
            tests.push(new Test(node.test.loc, "for"));
            controlDeps.push(new BranchDependency(node.test.loc, node.body.loc, "for"));
            controlDeps.push(new BranchDependency(node.test.loc, node.update.loc, "for"));
            this.traverse(path);
        },
        visitSwitchStatement: function (path) {
            var node = path.node;
            var caseCount = node.cases.length;
            if (caseCount > 0) {
                tests.push(new Test(node.discriminant.loc, "switch-disc"));
                // track dependency of everything in switch to the discriminant
                controlDeps.push(new BranchDependency(node.discriminant.loc, new location.SourceLocation(null, node.cases[0].loc.start, node.cases[caseCount - 1].loc.end), "switch-disc"));
                // track dependency of everything in a case body on that case
                for (var _i = 0, _a = node.cases; _i < _a.length; _i++) {
                    var scase = _a[_i];
                    console.log(scase);
                    var consequentLenght = scase.consequent.length;
                    if (consequentLenght > 0 && scase.test !== null) {
                        tests.push(new Test(scase.test.loc, "switch-test"));
                        controlDeps.push(new BranchDependency(scase.test.loc, new location.SourceLocation(null, scase.consequent[0].loc.start, scase.consequent[consequentLenght - 1].loc.end), "switch-test"));
                    }
                }
            }
            this.traverse(path);
        },
        visitNode: function (path) {
            this.traverse(path);
        }
    });
    return [controlDeps, tests];
}
function findControlDep(loc, controlDeps) {
    var locDeps = controlDeps.filter(function (cD) { return location.in_between_inclusive(cD.branchLoc, loc); });
    //find smallest branchLoc
    if (locDeps.length > 0) {
        var locCD = locDeps.reduce(function (prev, curr) { return location.posIsSmaller(prev.branchLoc.start, curr.branchLoc.start) ? curr : prev; });
        return locCD;
    }
}
function findTest(loc, tests) {
    var test = tests.filter(function (test) { return location.in_between_inclusive(test.loc, loc); });
    if (test.length > 1) {
        console.log("more than one test loc, this must never happen");
        throw "Fehler";
    }
    else if (test.length === 1) {
        return test[0];
    }
}
function computeForHeadLocation(potentialForExpressionNodes, forLoc) {
    var forExpressionNodes = potentialForExpressionNodes.filter(function (e) { return e != null; });
    if (forExpressionNodes.length === 0) {
        return forLoc;
    }
    else {
        //const forExpressionLocs = forExpressionNodes.flatMap(n => [n.loc.start, n.loc.end]);
        var startPosition = forExpressionNodes[0].loc.start;
        var endPosition = forExpressionNodes[forExpressionNodes.length - 1].loc.end;
        return new location.SourceLocation(null, startPosition, endPosition);
    }
}
function controlDependencies(progInPath) {
    var prog = fs.readFileSync(progInPath).toString();
    var controlData = computeControlDeps(prog);
    //fs.writeFileSync("cgraph.json", graph);// JSON.stringify(graph.json()));
    return controlData;
}
//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/a8_in.js");
//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/b2_in.js");
//controlDependencies("/home/v/slicing/slicer/testcases/milestone3/a9_in.js");
//const [cDeps, testLocs] = controlDependencies("/home/v/slicing/slicer/testcases/milestone3/b1_in.js");
var loc = new location.SourceLocation(null, new location.Position(10, 16), new location.Position(10, 32));
//findControlDep(loc, cDeps);
function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}
module.exports = {
    computeControlDeps: computeControlDeps,
    controlDependencies: controlDependencies,
    findControlDep: findControlDep,
};
