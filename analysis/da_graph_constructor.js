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
Object.defineProperty(exports, "__esModule", { value: true });
var cytoscape = require("cytoscape");
var datatypes_1 = require("./datatypes");
var fs_1 = require("fs");
var pruner_1 = require("./pruner");
var control_deps_1 = require("./control-deps");
var path = __importStar(require("path"));
var graph_helper_1 = require("./graph_helper");
function iidToLoc(iid) {
    return datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
}
var GraphConstructor = /** @class */ (function () {
    function GraphConstructor() {
        /** Input Params */
        this.outFile = J$.initParams["outFile"];
        this.bmarkerPath = J$.initParams["bmarkerPath"];
        /** Static information about source program*/
        this.bmarkers = [];
        /** Analysis Global State: Graph + Most-Recent (i.e. 'last') Information */
        this.g = new graph_helper_1.GraphHelper(cytoscape()); // helper containing the graph itself
        this.nextObjectId = 1; // used by this.addId to make objects identifiable
        this.lastWrite = {}; // lastWrite[variableName] == most reent write-node for variableName 
        this.lastDeclare = {}; // lastDeclare[variableName] == declare-nodef for variableName
        this.lastPut = {}; // lastPut[objectId][offset] == most recent put-node
        this.lastTest = {}; // lastTest[testLoc.toString()] == most recent test-node
        /** Current Expression  State */
        this.readOnlyObjects = []; //ids of read objects which are not (yet) the base for subsequent getField/putField
    }
    GraphConstructor.prototype.initializeCriterion = function () {
        var start = new datatypes_1.Position(parseInt(J$.initParams["criterion-start-line"]), parseInt(J$.initParams["criterion-start-col"]));
        var end = new datatypes_1.Position(parseInt(J$.initParams["criterion-end-line"]), parseInt(J$.initParams["criterion-end-col"]));
        this.slicingCriterion = new datatypes_1.SourceLocation(start, end);
    };
    GraphConstructor.prototype.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
        var _a;
        this.initializeCriterion();
        var a = JSON.parse((0, fs_1.readFileSync)(this.bmarkerPath).toString());
        this.bmarkers = a.map(function (obj) { return datatypes_1.SourceLocation.fromJSON(obj); });
        _a = (0, control_deps_1.controlDependencies)(originalFileName), this.controlDeps = _a[0], this.tests = _a[1];
        this.executedBreakNodes = this.g.graph.collection();
        this.currentNode = this.g.addCurrentNode();
    };
    GraphConstructor.prototype.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
        //const declareNode = this.addDeclareNode(iid, name, val);
        var declareNode = this.addNode(this.g.createDeclareNode(iidToLoc(iid), name, val));
        this.lastDeclare[name] = declareNode;
    };
    GraphConstructor.prototype.literal = function (iid, val, hasGetterSetter) {
        if (typeof val === "object") {
            this.addId(val);
            for (var _i = 0, _a = Object.entries(val); _i < _a.length; _i++) {
                var _b = _a[_i], propertyName = _b[0], propertyValue = _b[1];
                if (propertyName != "__id__") {
                    this.putField(iid, val, propertyName, propertyValue, undefined, undefined);
                }
            }
            return { result: val };
        }
    };
    /**
     * Handle var = rhs;
     * Create node with edges to D(var = rhs) = declaration of var + D(rhs).
     * @param reference jalangi
     * @returns
     */
    GraphConstructor.prototype.write = function (iid, name, val) {
        var declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.g.addEdge(this.currentNode, declareNode);
        }
        this.lastWrite[name] = this.currentNode;
    };
    GraphConstructor.prototype.read = function (iid, name, val, isGlobal, isScriptLocal) {
        this.addId(val);
        var declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.g.addEdge(this.currentNode, declareNode);
        }
        //add edge to last write / declare of variable name
        //assert val is lastWrites val
        var readNode = this.currentNode;
        if (typeof val === "object") {
            this.readOnlyObjects.push(val.__id__);
        }
        var lastWriteNode = this.lastWrite[name];
        //read without write happens when undefined read
        if (lastWriteNode) {
            this.g.addEdge(readNode, lastWriteNode);
        }
    };
    GraphConstructor.prototype.addTestDependency = function (node) {
        //found whether the current location has a control dependency
        var branchDependency = (0, control_deps_1.cDepForLoc)(node.data.loc, this.controlDeps);
        if (branchDependency) {
            //Todo: not going to work because of hash bs
            var testNode = this.lastTest[datatypes_1.Position.toString(branchDependency.testLoc.start)];
            this.g.addEdge(node, testNode);
        }
    };
    GraphConstructor.prototype.findTestDependency = function (nodeLoc) {
        var branchDependency = (0, control_deps_1.cDepForLoc)(nodeLoc, this.controlDeps);
        if (branchDependency) {
            return this.lastTest[datatypes_1.Position.toString(branchDependency.testLoc.start)];
        }
    };
    GraphConstructor.prototype.addTestDependencyRefactor = function (node) {
        var testNode = this.findTestDependency(node.data().loc);
        if (testNode) {
            this.g.addEdge(node, testNode);
        }
    };
    GraphConstructor.prototype.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
        this.addId(base);
        this.addId(val);
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter(function (objectId) { return objectId != base.__id__; });
        if (this.lastPut[base.__id__] === undefined) {
            this.lastPut[base.__id__] = {};
        }
        this.lastPut[base.__id__][offset] = this.currentNode;
    };
    GraphConstructor.prototype.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
        this.addId(val);
        this.addId(base);
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter(function (objectId) { return objectId != base.__id__; });
        //Todo: This does not work for string objects
        var getFieldNode = this.currentNode;
        if (typeof val === "object") {
            this.readOnlyObjects.push(val.__id__);
        }
        //no retrievalNode if val is of primitive type not an object
        var baseObjectPuts = this.lastPut[base.__id__];
        if (baseObjectPuts !== undefined) {
            var putFieldNode = this.lastPut[base.__id__][offset];
            if (putFieldNode) {
                this.g.addEdge(getFieldNode, putFieldNode);
            }
        }
        this.addId(val);
    };
    GraphConstructor.prototype.conditional = function (iid, result) {
        var loc = iidToLoc(iid);
        if (this.handleBreak(loc)) {
            return;
        }
        else {
            var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
            if (test) {
                console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
                var testNode = this.g.addNode(this.g.createTestNode(test, result));
                //currentExprNodes were created for the for/if test
                this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode;
                //TODO: Only include read nodes?
                this.g.addEdge(testNode, this.currentNode);
                this.g.addEdge(this.currentNode, testNode);
            }
        }
    };
    GraphConstructor.prototype.functionEnter = function (iid) {
        this.endExpression(iid);
    };
    GraphConstructor.prototype.endExpression = function (iid) {
        var loc = iidToLoc(iid);
        //switch expression does not result in callback to this.conditional -> handle it here
        this.handleSwitch(loc);
        this.currentNode.data({
            loc: loc,
            lloc: loc.toString(),
            line: iidToLoc(iid).start.line,
            type: "expression"
        });
        this.addTestDependencyRefactor(this.currentNode);
        for (var _i = 0, _a = this.readOnlyObjects; _i < _a.length; _i++) {
            var objectId = _a[_i];
            for (var _b = 0, _c = Object.entries(this.lastPut[objectId]); _b < _c.length; _b++) {
                var _d = _c[_b], fieldName = _d[0], putFieldNode = _d[1];
                this.g.addEdge(this.currentNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        this.readOnlyObjects = [];
        this.currentNode = this.g.addCurrentNode();
    };
    GraphConstructor.prototype.handleSwitch = function (loc) {
        var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
        if (test && test.type === "switch-disc") {
            // todo duplicate of conditional
            console.log("Detected switch discriminant: at l " + test.loc.start.line);
            var testNode = this.addNode(this.g.createTestNode(test, "case-disc"));
            //currentExprNodes were created for the for/if test
            this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode;
            //TODO: Only include read nodes?
            this.g.addEdge(testNode, this.currentNode);
            return true;
        }
        return false;
    };
    GraphConstructor.prototype.handleBreak = function (wrappingIfPredicateLocation) {
        var loc = this.bmarkers.filter(function (bLoc) {
            return datatypes_1.SourceLocation.in_between_inclusive(bLoc, wrappingIfPredicateLocation);
        })[0];
        if (loc) {
            var breakNode = this.addNode(this.g.createBreakNode(loc));
            this.executedBreakNodes = this.executedBreakNodes.union(breakNode);
            return true;
        }
        return false;
    };
    GraphConstructor.prototype.endExecution = function () {
        //this.graph.remove(`node[id=${this.currentNode.id}]`);
        var inFilePath = J$.smap[1].originalCodeFileName;
        try {
            (0, fs_1.mkdirSync)("../graphs");
        }
        catch (e) {
            //this error is expected as it is thrown when the graphs directory esists already
        }
        (0, fs_1.writeFileSync)("../graphs/".concat(path.basename(inFilePath), "_graph.json"), JSON.stringify(this.g.graph.json()));
        (0, pruner_1.graphBasedPrune)(inFilePath, this.outFile, this.g.graph, this.executedBreakNodes, this.slicingCriterion);
    };
    GraphConstructor.prototype.addId = function (val) {
        if (typeof val !== "object") {
            return;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectId++;
        }
    };
    GraphConstructor.prototype.addNode = function (nodeDef) {
        return this.g.addNode(nodeDef, this.findTestDependency(nodeDef.data.loc));
    };
    return GraphConstructor;
}());
J$.analysis = new GraphConstructor();
//# sourceMappingURL=da_graph_constructor.js.map