/* Import necessary modules */
var acorn = require('acorn');
var esc = require('escodegen')
var fs = require('fs');
var estrav = require('estraverse');
var location = require('./datatypes');
var esprima = require('esprima');
var { parse, print } = require("recast");
var astt = require("ast-types");


function toAst(filePathIn, filePathOut) {
    let prog = fs.readFileSync(filePathIn).toString();
    var ast = acorn.parse(prog, { ecmaVersion: 5, locations: true });
    let newprog = esc.generate(ast);
    fs.writeFileSync(filePathOut, newprog);
}

function pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars) {
    let ast = acorn.parse(prog, { ecmaVersion: 5, locations: true });
    let fbody_ast = ast.body[0].body;
    let filtered_fbody_ast = estrav.replace(fbody_ast, {
        enter: function (node, parent) {
            if (within_line(node.loc, lineNb)) {
                return node;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevant_locs.some(rloc => in_between_inclusive(node.loc, rloc))) {
                    return node;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    return this.remove();
                }
            }
            if (node.type == 'ExpressionStatement' || node.type == 'ReturnStatement') {
                if (relevant_locs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return node;
                }
                return this.remove();
            }
        }
    });
    ast.body[0].body = filtered_fbody_ast;
    let newprog = esc.generate(ast, { format: { preserveBlankLines: true } });
    return newprog;
}

function pruneProgram2(prog, lineNb, graph, relevant_locs, relevant_vars) {
    const ast = parse(prog, {
        parser: esprima,
    })
    astt.visit(ast, {
        /*
        visitFunctionDeclaration(path) {
            this.traverse(path);
        },
        visitCallExpression(path) {
            this.traverse(path);
        },
        */
        visitNode(path) {
            const node = path.node;
            if(node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                return false;
            }
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
            }
            if (within_line(node.loc, lineNb)) {
                return false;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevant_locs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return false;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    path.prune();
                    return false;
                }
            }
            if (node.type == 'ExpressionStatement' || node.type == 'ReturnStatement') {
                if (relevant_locs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return false;
                } else {
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
    const readsInLineNbCriterion = `node[type="read"][line=${lineNb}], node[type="getField"][line=${lineNb}]`
    const readNodesInLine = graph.nodes(readsInLineNbCriterion);
    const reachableNodes = readNodesInLine.successors("node");
    const relevant_locs = reachableNodes.map(node => node.data("loc"));
    const relevant_vars = reachableNodes.map(node => node.data("name"));
    /*relevant_locs.push(new location.SourceLocation(progInPath,
        new location.Position(lineNb, 0),
        new location.Position(lineNb, Number.POSITIVE_INFINITY)))*/
    const prog = fs.readFileSync(progInPath).toString();
    //const newprog = pruneProgram(prog, lineNb, graph, relevant_locs, relevant_vars);
    const newprog2 = pruneProgram2(prog, lineNb, graph, relevant_locs, relevant_vars)
    //fs.writeFileSync(progOutPath, newprog);
    fs.writeFileSync(progOutPath, newprog2.code);

}


function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}


module.exports = {
    prune
};