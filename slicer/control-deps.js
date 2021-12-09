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
    var ast = acorn.parse(prog, {ecmaVersion: 5, locations: true});
    let newprog = esc.generate(ast);
    fs.writeFileSync(filePathOut, newprog);
}

class Test {
    constructor(testLoc, branchLoc) {
        this.testLoc = testLoc;
        this.branchLoc = branchLoc;
        this.children = [];
    }
}

function computeControlDeps(prog) {
    const graph = cytoscape();
    const ast = parse(prog)
    const fbody_ast = ast.program.body[0];
    const controlDeps = [];
    parentTest = [];
    astt.visit(fbody_ast, {
        visitIfStatement(path) {
            const node = path.node;
            if (path.parent && path.parent.__cdep){
                node.__cdep = path.parent.__cdep;
            }
            path.__cdep = node.test.loc;
            controlDeps.push([node.test.loc, node.consequent.loc]);
            this.traverse(path)
        },
        visitNode(path) {
            console.log(path);
            const node = path.node;
            if (path.parent && path.parent.__cdep){
                path.__cdep = path.parent.__cdep;
                node.__cdep = path.parent.__cdep;
            }
            this.traverse(path);
        }

    })
    return controlDeps;
}



function controlDependencies(progInPath) {
    const prog = fs.readFileSync(progInPath).toString();
    const graph = computeControlDeps(prog);
    fs.writeFileSync("cgraph.json", graph);// JSON.stringify(graph.json()));
}

controlDependencies("/home/v/slicing/slicer/testcases/milestone3/a10_in.js");


function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}

function in_between_inclusive(outer, inner) {
    return (outer.start.line <= inner.start.line &&
        outer.start.column <= inner.start.column &&
        inner.end.line <= outer.end.line&&
        inner.end.column <= outer.end.column)
}

module.exports = {
    computeControlDeps: computeControlDeps
};