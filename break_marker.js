var fs = require('fs');
var location = require('./datatypes');
var esprima = require('esprima');
var { parse, print } = require("recast");
var astt = require("ast-types");
var estraverse = require("estraverse");
var acorn = require("acorn");


function insertBreakMarkers(prog) {
    const ast = parse(prog, {
        parser: esprima,
    });
    astt.visit(ast, {
        visitNode(path) {
            const node = path.node;
            if (node.type === "BreakStatement") {
                const pathToBreak = path.parent.get("body", parseInt(path.name));
                const iftruebreak = astt.builders.ifStatement(astt.builders.literal(true), astt.builders.breakStatement())
                pathToBreak.replace(iftruebreak);
                return false;
            }
            this.traverse(path);
            /*
            if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
                if (relevantLocs.some(nLoc => location.in_between_inclusive(node.loc, nLoc))) {
                    return false;
                }
                path.prune();
                return false;
            }
            if (node.type === "FunctionDeclaration" || node.type === "ExpressionStatement") {
                this.traverse(path);
            }
            if (within_line(node.loc, lineNb)) {
                return false;
            }
            if (node.type == 'VariableDeclaration') {
                if (relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    return false;
                }
                if (!relevant_vars.includes(node.declarations[0].id.name)) {
                    path.prune();
                    return false;
                }
            }
            if (node.type === "IfStatement") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.test.loc, rloc))) {
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
                }
            }
            if (node.type === "BlockStatement" && path.name === "consequent") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    const blockStatement = astt.builders.blockStatement([]);
                    blockStatement.isFiller = true;
                    path.parent.node[path.name] = blockStatement;
                    return false;
                }
            }
            if (node.type === "BlockStatement" && path.name === "alternate") {
                if (!relevantLocs.some(rloc => location.in_between_inclusive(node.loc, rloc))) {
                    path.parent.node[path.name] = null;
                    return false;
                }
            }*/
        }
    });
    return ast;
}

function findBreakMarkers(prog) {
    const ast = parse(prog, {
        parser: esprima,
    });
    const ifTrueBreakLocations = [];
    astt.visit(ast, {
        visitNode(path) {
            const node = path.node;
            if (this.isIfThenBreak(node)) {
                ifTrueBreakLocations.push(node.test.loc.start);
            }
            this.traverse(path);
        },
        isIfThenBreak(node) {
            return node.type === "IfStatement" && node.test.value === true && 
            node.consequent.type === "BreakStatement" && !node.alternate;
        }
    });
    return ifTrueBreakLocations;
}

function insertBreakMarkersFile(progInPath, progOutPath) {
    const prog = fs.readFileSync(progInPath).toString();
    const ast = insertBreakMarkers(prog)
    const newprog = print(ast).code
    fs.writeFileSync(progOutPath, newprog);

}


function within_line(location, line) {
    return location.start.line == location.end.line && location.end.line == line;
}




module.exports = {
    insertBreakMarkers,
    insertBreakMarkersFile,
    findBreakMarkers
};