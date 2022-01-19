/* Import necessary modules */
var acorn = require('acorn');
var esc = require('escodegen');
var fs = require('fs');
var estrav = require('estraverse');
var location = require('./datatypes');
var esprima = require('esprima');
var _a = require("recast"), parse = _a.parse, print = _a.print;
var astt = require("ast-types");
function toAst(filePathIn, filePathOut) {
    var prog = fs.readFileSync(filePathIn).toString();
    var ast = acorn.parse(prog, { ecmaVersion: 5, locations: true });
    var newprog = esc.generate(ast);
    fs.writeFileSync(filePathOut, newprog);
}
function pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars) {
    var ast = acorn.parse(prog, { ecmaVersion: 5, locations: true });
    var fbody_ast = ast.body[0].body;
    var filtered_fbody_ast = estrav.replace(fbody_ast, {
        enter: function (node, parent) {
            if (within_line(node.loc, lineNb)) {
                return node;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevant_locs.some(function (rloc) { return location.in_between_inclusive(node.loc, rloc); })) {
                    return node;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    return this.remove();
                }
            }
            if (node.type == 'ExpressionStatement' || node.type == 'ReturnStatement') {
                if (relevant_locs.some(function (rloc) { return location.in_between_inclusive(node.loc, rloc); })) {
                    return node;
                }
                return this.remove();
            }
        }
    });
    ast.body[0].body = filtered_fbody_ast;
    var newprog = esc.generate(ast, { format: { preserveBlankLines: true } });
    return newprog;
}
function pruneProgram2(prog, lineNb, graph, relevant_locs, relevant_vars) {
    var ast = parse(prog, {
        parser: esprima,
    });
    astt.visit(ast, {
        /*
        visitFunctionDeclaration(path) {
            this.traverse(path);
        },
        visitCallExpression(path) {
            this.traverse(path);
        },
        */
        visitNode: function (path) {
            var node = path.node;
            if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                return false;
            }
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
                return;
            }
            if (within_line(node.loc, lineNb)) {
                return false;
            }
            if (node.type == 'VariableDeclaration') {
                if (!relevant_locs.some(function (rloc) { return location.in_between_inclusive(node.loc, rloc); }) &&
                    !relevant_vars.includes(node.declarations[0].id.name)) {
                    path.prune();
                }
                return false;
            }
            if (node.type === "IfStatement") {
                /*
                                if (!relevant_locs.some(rloc => location.in_between_inclusive(node.test.loc, rloc))) {
                    // if was not reached in execution -> remove fully
                    path.prune();
                    return false;
                } else {
                    this.traverse(path);
                    return;
                }*/
                var branchPaths = [path.get("consequent"), path.get("alternate")].filter(function (x) { return x.value; });
                for (var _i = 0, branchPaths_1 = branchPaths; _i < branchPaths_1.length; _i++) {
                    var branchPath = branchPaths_1[_i];
                    this.traverse(branchPath);
                    var prunedBranchNode = branchPath.node;
                    if (!relevant_locs.some(function (rloc) { return location.in_between_inclusive(branchNode.loc, rloc); })) {
                        branchPath.prune();
                    }
                    else {
                        both_pruned = false;
                    }
                }
                /*
                const branchPaths = [path.get("consequent"), path.get("alternate")].filter(x => x.value)
                let both_pruned = true;
                for (let branchPath of branchPaths) {
                    const branchNode = branchPath.node;
                    if (!relevant_locs.some(rloc => location.in_between_inclusive(branchNode.loc, rloc))) {
                        branchPath.prune();
                    } else {
                        both_pruned = false;
                    }
                }
                if (both_pruned) {
                    path.prune();
                    return false;
                }
                return;
                */
            }
            if (node.type == 'ExpressionStatement' || node.type == 'ReturnStatement') {
                if (relevant_locs.some(function (rloc) { return location.in_between_inclusive(node.loc, rloc); })) {
                    return false;
                }
                else {
                    path.prune();
                    return false;
                }
            }
            this.traverse(path);
        }
    });
    return print(ast);
}
function prune(progInPath, progOutPath, graph, lineNb) {
    var readsInLineNbCriterion = "node[type=\"read\"][line=".concat(lineNb, "], node[type=\"getField\"][line=").concat(lineNb, "]");
    var readNodesInLine = graph.nodes(readsInLineNbCriterion);
    var reachableNodes = readNodesInLine.successors("node");
    var relevant_locs = reachableNodes.map(function (node) { return node.data("loc"); });
    var relevant_vars = reachableNodes.map(function (node) { return node.data("varname"); }).filter(function (x) { return x; });
    /*relevant_locs.push(new location.SourceLocation(progInPath,
        new location.Position(lineNb, 0),
        new location.Position(lineNb, Number.POSITIVE_INFINITY)))*/
    var prog = fs.readFileSync(progInPath).toString();
    //const newprog = pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars);
    var newprog2 = pruneProgram2(prog, lineNb, graph, relevant_locs, relevant_vars);
    //fs.writeFileSync(progOutPath, newprog);
    fs.writeFileSync(progOutPath, newprog2.code);
}
function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}
module.exports = {
    prune: prune
};
