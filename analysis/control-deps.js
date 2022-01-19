"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var esprima = __importStar(require("esprima"));
var datatypes_1 = require("./datatypes");
var cytoscape_1 = __importDefault(require("cytoscape"));
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
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
    var graph = (0, cytoscape_1.default)();
    var ast = (0, recast_1.parse)(prog, {
        parser: esprima,
    });
    var fbody_ast = ast.program.body[0];
    var controlDeps = [];
    var tests = [];
    var parentTest = [];
    (0, ast_types_1.visit)(fbody_ast, {
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
                controlDeps.push(new BranchDependency(node.discriminant.loc, new datatypes_1.SourceLocation(node.cases[0].loc.start, node.cases[caseCount - 1].loc.end), "switch-disc"));
                // track dependency of everything in a case body on that case
                for (var _i = 0, _a = node.cases; _i < _a.length; _i++) {
                    var scase = _a[_i];
                    console.log(scase);
                    var consequentLenght = scase.consequent.length;
                    if (consequentLenght > 0 && scase.test !== null) {
                        tests.push(new Test(scase.test.loc, "switch-test"));
                        controlDeps.push(new BranchDependency(scase.test.loc, new datatypes_1.SourceLocation(scase.consequent[0].loc.start, scase.consequent[consequentLenght - 1].loc.end), "switch-test"));
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
    var locDeps = controlDeps.filter(function (cD) { return datatypes_1.SourceLocation.in_between_inclusive(cD.branchLoc, loc); });
    //find smallest branchLoc
    if (locDeps.length > 0) {
        var locCD = locDeps.reduce(function (prev, curr) { return datatypes_1.Position.posIsSmallerEq(prev.branchLoc.start, curr.branchLoc.start) ? curr : prev; });
        return locCD;
    }
}
function controlDependencies(progInPath) {
    var prog = fs.readFileSync(progInPath).toString();
    var controlData = computeControlDeps(prog);
    return controlData;
}
module.exports = {
    computeControlDeps: computeControlDeps,
    controlDependencies: controlDependencies,
    findControlDep: findControlDep,
};
//# sourceMappingURL=control-deps.js.map