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
        this.currentExprNodes = [];
        this.lastWrites = {};
        this.lastDeclare = {};
        //lastPut[objectId][offset] = putNode
        this.lastPut = {};
        this.nextObjectIds = 1;
        //lastTest[location] = testNode
        this.lastTest = {};
        this.currentObjectReads = [];
        this.callStack = [];
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
        this.currentObjectReads = [];
        this.executedBreakNodes = this.graph.collection();
    };
    GraphConstructor.prototype.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
        var rhs_line = datatypes_1.JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)));
        var declareNode = this.addNode({
            loc: datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            line: rhs_line,
            name: name,
            varname: name,
            val: String(val),
            type: "declare"
        });
        this.lastDeclare[name] = declareNode;
    };
    GraphConstructor.prototype.literal = function (iid, val, hasGetterSetter) {
        if (typeof val === "object") {
            if (val.__id__ === undefined) {
                val.__id__ = this.nextObjectIds++;
            }
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
        var _this = this;
        var declareNode = this.lastDeclare[name] ? [this.lastDeclare[name]] : [];
        var rhsLoc = iidToLoc(iid);
        var rhsNodes = this.getNodesAt(this.currentExprNodes, rhsLoc);
        var writeNode = this.addWriteNode(iid, rhsLoc, name, val);
        declareNode.concat(rhsNodes).forEach(function (node) { return _this.addEdge(writeNode, node); });
        this.currentExprNodes.push(writeNode);
        this.lastWrites[name] = writeNode;
    };
    GraphConstructor.prototype.addWriteNode = function (iid, rhsLoc, name, val) {
        return this.addNode({
            loc: rhsLoc,
            name: name,
            varname: name,
            val: val,
            type: "write",
            line: datatypes_1.JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
    };
    GraphConstructor.prototype.getNodesAt = function (nodes, loc) {
        return nodes.filter(function (node) {
            return datatypes_1.SourceLocation.in_between_inclusive(loc, node.data.loc);
        });
    };
    GraphConstructor.prototype.read = function (iid, name, val, isGlobal, isScriptLocal) {
        //add edge to last write / declare of variable name
        //assert val is lastWrites val
        var readNode = this.addNode({
            loc: datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: name,
            varname: name,
            val: String(val),
            type: "read",
            line: datatypes_1.JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
        if (typeof val === "object") {
            this.addObjectRead(val, readNode);
            this.readOnlyObjects.push(val.__id__);
        }
        this.currentExprNodes.push(readNode);
        var declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.addEdge(readNode, declareNode);
        }
        else {
            console.log("Read without declare");
        }
        var lastWriteNode = this.lastWrites[name];
        if (lastWriteNode) {
            this.addEdge(readNode, lastWriteNode);
        }
        else {
            console.log("Read without write");
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
        var _this = this;
        this.readOnlyObjects = this.readOnlyObjects.filter(function (objectId) { return objectId != base.__id__; });
        var retrievalNode = this.currentObjectReads[base.__id__];
        var putFieldNode = this.addNode({
            loc: datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: "putfield ".concat(offset, ":").concat(val),
            val: val,
            type: "putField",
            line: datatypes_1.JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
        //no retrieval node if called via literal
        if (retrievalNode) {
            this.addEdge(putFieldNode, retrievalNode);
        }
        var readsForPut = this.currentExprNodes.filter(function (node) {
            return datatypes_1.SourceLocation.in_between_inclusive(putFieldNode.data.loc, node.data.loc);
        });
        readsForPut.forEach(function (node) { return _this.addEdge(putFieldNode, node); });
        this.currentExprNodes.push(putFieldNode);
        // initialize if first put
        if (this.lastPut[base.__id__] === undefined) {
            this.lastPut[base.__id__] = {};
        }
        this.lastPut[base.__id__][offset] = putFieldNode;
    };
    GraphConstructor.prototype.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
        this.readOnlyObjects = this.readOnlyObjects.filter(function (objectId) { return objectId != base.__id__; });
        //Todo: This does not work for string objects
        var retrievalNode = this.currentObjectReads[base.__id__];
        var getFieldNode = this.addNode({
            loc: datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: "getfield ".concat(offset, ":").concat(val),
            val: val,
            type: "getField",
            line: datatypes_1.JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
        this.currentExprNodes.push(getFieldNode);
        //no retrievalNode if val is of primitive type not an object
        if (retrievalNode) {
            this.addEdge(getFieldNode, retrievalNode);
        }
        var baseObjectPuts = this.lastPut[base.__id__];
        /*
        When there is no put for this field on the object it might have been created by a literal.
        But then we must have read a variable containing this object and the read node
        transitively depends on this write of the  into a original variable
        */
        if (baseObjectPuts == undefined) {
            console.log("baseObjectPuts undefined");
        }
        if (baseObjectPuts !== undefined) {
            var putFieldNode = this.lastPut[base.__id__][offset];
            if (putFieldNode) {
                this.addEdge(getFieldNode, putFieldNode);
            }
        }
        return this.addObjectRead(val, retrievalNode);
    };
    GraphConstructor.prototype.addObjectRead = function (val, retrievalNode) {
        if (typeof val !== "object") {
            return;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
        }
        this.currentObjectReads[val.__id__] = retrievalNode;
        return { result: val };
    };
    GraphConstructor.prototype.addNode = function (data) {
        var node = {
            group: "nodes",
            data: data
        };
        node.data.id = "n".concat(this.nextNodeId++);
        if (this.currentCallerLoc) {
            node.data.callerLoc = this.currentCallerLoc;
        }
        this.graph.add(node);
        this.addTestDependency(node);
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
    GraphConstructor.prototype.addTestNode = function (test, result) {
        var testNode = {
            group: "nodes",
            data: {
                id: "n".concat(this.nextNodeId++),
                loc: test.loc,
                val: result,
                line: test.loc.start.line,
                type: "".concat(test.type, "-test"),
                name: "".concat(test.type, "-test")
            }
        };
        this.graph.add(testNode);
        this.addTestDependency(testNode);
        return testNode;
    };
    GraphConstructor.prototype.addBreakNode = function (loc) {
        var breakNode = {
            group: "nodes",
            data: {
                id: "n".concat(this.nextNodeId++),
                loc: loc,
                line: loc.start.line,
                name: "break"
            }
        };
        var bNode = this.graph.add(breakNode);
        this.addTestDependency(breakNode);
        return bNode;
    };
    GraphConstructor.prototype.conditional = function (iid, result) {
        var _this = this;
        var loc = datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
        if (this.handleBreak(loc)) {
            return;
        }
        else {
            var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
            if (test) {
                console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
                var testNode_1 = this.addTestNode(test, result);
                //currentExprNodes were created for the for/if test
                this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode_1;
                //TODO: Only include read nodes?
                this.currentExprNodes.forEach(function (node) { return _this.addEdge(testNode_1, node); });
            }
        }
    };
    GraphConstructor.prototype.endExpression = function (iid) {
        var loc = datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
        //switch expression does not result in callback to this.conditional -> handle it here
        this.handleSwitch(loc);
        var graphLoc = loc;
        if (this.currentExprNodes.length > 0) {
            graphLoc = datatypes_1.SourceLocation.boundingLocation(this.currentExprNodes.map(function (n) { return n.data.loc; }));
        }
        this.addNode({
            loc: graphLoc,
            line: datatypes_1.JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid))),
            type: "end-expression"
        });
        for (var _i = 0, _a = this.readOnlyObjects; _i < _a.length; _i++) {
            var objectId = _a[_i];
            for (var _b = 0, _c = Object.entries(this.lastPut[objectId]); _b < _c.length; _b++) {
                var _d = _c[_b], fieldName = _d[0], putFieldNode = _d[1];
                var readNode = this.currentObjectReads[objectId];
                this.addEdge(readNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        this.readOnlyObjects = [];
        this.currentExprNodes = [];
        this.currentObjectReads = [];
    };
    GraphConstructor.prototype.handleSwitch = function (loc) {
        var _this = this;
        var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
        if (test && test.type === "switch-disc") {
            // todo duplicate of conditional
            console.log("Detected switch discriminant: at l " + test.loc.start.line);
            var testNode_2 = this.addTestNode(test, "case-disc");
            //currentExprNodes were created for the for/if test
            this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode_2;
            //TODO: Only include read nodes?
            this.currentExprNodes.forEach(function (node) { return _this.addEdge(testNode_2, node); });
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
    GraphConstructor.prototype.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
        var callerLoc = datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.sid, iid));
        var calleeLoc = J$.iidToLocation(functionSid, functionIid);
        if (calleeLoc !== "undefined") {
            calleeLoc = datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(functionSid, functionIid));
        }
        this.callStack.push(new datatypes_1.CallStackEntry(callerLoc, calleeLoc));
        this.currentCallerLoc = callerLoc;
        this.currentCalleeLoc = calleeLoc;
    };
    GraphConstructor.prototype.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
        this.callStack.pop();
        if (this.callStack.length > 0) {
            var topCallStackEntry = this.callStack[this.callStack.length - 1];
            this.currentCallerLoc = topCallStackEntry.callerLoc;
            this.currentCalleeLoc = topCallStackEntry.calleeLoc;
        }
    };
    return GraphConstructor;
}());
J$.analysis = new GraphConstructor();
//# sourceMappingURL=da_graph_constructor.js.map