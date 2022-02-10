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
function iidToLoc(iid) {
    return datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
}
var GraphConstructor = /** @class */ (function () {
    function GraphConstructor() {
        this.graph = cytoscape();
        this.nextNodeId = 1;
        this.nextEdgeId = 1;
        this.outFile = J$.initParams["outFile"];
        this.bmarkerPath = J$.initParams["bmarkerPath"];
        this.bmarkers = [];
        this.executedIfTrueBreaks = [];
        //ids of objects that have been read without being the base for a getField/putField
        this.readOnlyObjects = [];
        this.lastWrites = {};
        this.lastDeclare = {};
        //lastPut[objectId][offset] = putNode
        this.lastPut = {};
        this.nextObjectIds = 1;
        //lastTest[location] = testNode
        this.lastTest = {};
        this.isConditional = false;
    }
    GraphConstructor.prototype.initializeCriterion = function () {
        var start = new datatypes_1.Position(parseInt(J$.initParams["criterion-start-line"]), parseInt(J$.initParams["criterion-start-col"]));
        var end = new datatypes_1.Position(parseInt(J$.initParams["criterion-end-line"]), parseInt(J$.initParams["criterion-end-col"]));
        this.slicingCriterion = new datatypes_1.SourceLocation(start, end);
    };
    GraphConstructor.prototype.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
        var _a;
        this.initializeCriterion();
        var bmarkerJSON = (0, fs_1.readFileSync)(this.bmarkerPath).toString();
        var a = JSON.parse(bmarkerJSON);
        this.bmarkers = a.map(function (obj) { return datatypes_1.SourceLocation.fromJSON(obj); });
        _a = (0, control_deps_1.controlDependencies)(originalFileName), this.controlDeps = _a[0], this.tests = _a[1];
        this.executedBreakNodes = this.graph.collection();
        var node = {
            group: "nodes",
            data: { id: "n".concat(this.nextNodeId++) },
        };
        this.currentNode = node;
        this.currentNodeInGraph = this.graph.add(node);
    };
    GraphConstructor.prototype.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
        var rhs_line = iidToLoc(iid).start.line;
        var declareNode = this.addNode({
            line: rhs_line,
            name: name,
            varname: name,
            val: String(val),
            type: "declare"
        });
        //const declareNode = this.addDeclareNode(iid, name, val);
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
            this.addEdge(this.currentNode, declareNode);
        }
        this.lastWrites[name] = this.currentNode;
    };
    GraphConstructor.prototype.read = function (iid, name, val, isGlobal, isScriptLocal) {
        this.addId(val);
        var declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.addEdge(this.currentNode, declareNode);
        }
        //add edge to last write / declare of variable name
        //assert val is lastWrites val
        var readNode = this.currentNode;
        if (typeof val === "object") {
            this.readOnlyObjects.push(val.__id__);
        }
        var lastWriteNode = this.lastWrites[name];
        //read without write happens when undefined read
        if (lastWriteNode) {
            this.addEdge(readNode, lastWriteNode);
        }
    };
    GraphConstructor.prototype.addTestDependency = function (node) {
        //found whether the current location has a control dependency
        var branchDependency = (0, control_deps_1.cDepForLoc)(node.data.loc, this.controlDeps);
        if (branchDependency) {
            //Todo: not going to work because of hash bs
            var testNode = this.lastTest[datatypes_1.Position.toString(branchDependency.testLoc.start)];
            this.addEdge(node, testNode);
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
                this.addEdge(getFieldNode, putFieldNode);
            }
        }
        this.addId(val);
    };
    GraphConstructor.prototype.conditional = function (iid, result) {
        this.isConditional = true;
        var loc = iidToLoc(iid);
        if (this.handleBreak(loc)) {
            return;
        }
        else {
            var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
            if (test) {
                console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
                var testNode = this.addTestNode(test, result);
                //currentExprNodes were created for the for/if test
                this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode;
                //TODO: Only include read nodes?
                this.addEdge(testNode, this.currentNode);
                this.addEdge(this.currentNode, testNode);
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
        this.currentNodeInGraph.data({
            loc: loc,
            lloc: loc.toString(),
            line: iidToLoc(iid).start.line,
            type: "expression"
        });
        for (var _i = 0, _a = this.readOnlyObjects; _i < _a.length; _i++) {
            var objectId = _a[_i];
            for (var _b = 0, _c = Object.entries(this.lastPut[objectId]); _b < _c.length; _b++) {
                var _d = _c[_b], fieldName = _d[0], putFieldNode = _d[1];
                this.addEdge(this.currentNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        this.addTestDependency(this.currentNode);
        this.readOnlyObjects = [];
        var node = {
            group: "nodes",
            data: { id: "n".concat(this.nextNodeId++) }
        };
        this.currentNode = node;
        this.currentNodeInGraph = this.graph.add(node);
    };
    GraphConstructor.prototype.handleSwitch = function (loc) {
        var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
        if (test && test.type === "switch-disc") {
            // todo duplicate of conditional
            console.log("Detected switch discriminant: at l " + test.loc.start.line);
            var testNode = this.addTestNode(test, "case-disc");
            //currentExprNodes were created for the for/if test
            this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode;
            //TODO: Only include read nodes?
            this.addEdge(testNode, this.currentNode);
            return true;
        }
        return false;
    };
    GraphConstructor.prototype.handleBreak = function (wrappingIfPredicateLocation) {
        var loc = this.bmarkers.filter(function (bLoc) {
            return datatypes_1.SourceLocation.in_between_inclusive(bLoc, wrappingIfPredicateLocation);
        })[0];
        if (loc) {
            this.executedIfTrueBreaks.push(loc);
            var breakNode = this.addBreakNode(loc);
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
        (0, fs_1.writeFileSync)("../graphs/".concat(path.basename(inFilePath), "_graph.json"), JSON.stringify(this.graph.json()));
        (0, pruner_1.graphBasedPrune)(inFilePath, this.outFile, this.graph, this.executedBreakNodes, this.slicingCriterion);
    };
    GraphConstructor.prototype.addId = function (val) {
        if (typeof val !== "object") {
            return;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
        }
    };
    GraphConstructor.prototype.addNode = function (data) {
        var node = this.createNode(data);
        this.graph.add(node);
        return node;
    };
    GraphConstructor.prototype.addEdge = function (source, target) {
        this.graph.add({
            group: "edges",
            data: {
                id: "e".concat(this.nextEdgeId++),
                source: source.data.id,
                target: target.data.id
            }
        });
    };
    GraphConstructor.prototype.createNode = function (data) {
        var node = {
            group: "nodes",
            data: data
        };
        node.data.id = "n".concat(this.nextNodeId++);
        return node;
    };
    GraphConstructor.prototype.createTestNode = function (test, result) {
        return this.createNode({
            loc: test.loc,
            lloc: test.loc.toString(),
            val: result,
            line: test.loc.start.line,
            type: "".concat(test.type, "-test"),
            name: "".concat(test.type, "-test"),
        });
    };
    GraphConstructor.prototype.createDeclareNode = function (line, name, val) {
        return this.createNode({
            line: line,
            name: name,
            varname: name,
            val: String(val),
            type: "declare"
        });
    };
    GraphConstructor.prototype.createBreakNode = function (loc) {
        return this.createNode({
            loc: loc,
            lloc: loc.toString(),
            line: loc.start.line,
            name: "break"
        });
    };
    GraphConstructor.prototype.addNodeNew = function (node) {
        var c = this.graph.add(node);
        this.addTestDependency(node);
        return c.nodes()[0];
    };
    GraphConstructor.prototype.addDeclareNode = function (iid, name, val) {
        var declareNode = this.createDeclareNode(iidToLoc(iid).start.line, name, val);
        this.addNodeNew(declareNode);
        return declareNode;
    };
    GraphConstructor.prototype.addTestNode = function (test, result) {
        var testNode = this.createTestNode(test, result);
        this.addNodeNew(testNode);
        return testNode;
    };
    GraphConstructor.prototype.addBreakNode = function (loc) {
        var breakNode = this.createBreakNode(loc);
        return this.addNodeNew(breakNode);
    };
    return GraphConstructor;
}());
J$.analysis = new GraphConstructor();
//# sourceMappingURL=da_graph_constructor.js.map