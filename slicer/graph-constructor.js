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
var graph_helper_1 = require("./graph-helper");
function iidToLoc(iid) {
    return datatypes_1.SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
}
/**
 * Builds, expression by expression, a graph of data- and control-dependencies.
 * this.currentNode captures dependencies of the current expression on former
 * currentNode(s) and on helper nodes for declare-, break- and test-nodes.
 * In contrast to these the currentNode is carried through the whole expression.
 */
var GraphConstructor = /** @class */ (function () {
    function GraphConstructor() {
        /** Input Params */
        this.outFile = J$.initParams["outFile"];
        this.bmarkerPath = J$.initParams["bmarkerPath"];
        this.slicingCriterion = datatypes_1.SourceLocation.fromParts(J$.initParams["criterion-start-line"], J$.initParams["criterion-start-col"], J$.initParams["criterion-end-line"], J$.initParams["criterion-end-col"]);
        /** Static information about source program*/
        this.bmarkers = [];
        /** Analysis Global State: Graph + Most-Recent (i.e. 'last') Information */
        this.g = new graph_helper_1.GraphHelper(cytoscape()); // helper containing the graph itself
        this.nextObjectId = 1; // used by this.addId to make objects identifiable
        this.lastWrite = {}; // lastWrite[variableName] == most reent write-node for variableName
        this.lastDeclare = {}; // lastDeclare[variableName] == declare-nodef for variableName
        this.lastPut = {}; // lastPut[objectId][offset] == most recent put-node
        this.lastTest = {}; // lastTest[testLoc.toString()] == most recent test-node
        this.criterionOnce = false; // code within slicingCriterion has been executed once during analysis
    }
    /**
     * Load and compute static program information.
     * Initialize current expression state of readOnlyObjects + currentNode
     * @param _iid static, unique instruction identifier
     * @param _instrumentedFileName
     * @param originalFilePath path of preprocessed file
     */
    GraphConstructor.prototype.scriptEnter = function (_iid, _instrumentedFileName, originalFilePath) {
        var _a;
        this.bmarkers = JSON.parse((0, fs_1.readFileSync)(this.bmarkerPath).toString()).map(function (obj) {
            return datatypes_1.SourceLocation.fromJSON(obj);
        });
        _a = (0, control_deps_1.controlDependencies)(originalFilePath), this.controlDeps = _a[0], this.tests = _a[1];
        this.executedBreakNodes = this.g.graph.collection();
        this.readOnlyObjects = [];
        this.currentNode = this.g.addCurrentNode();
    };
    /**
     * Handle var name = rhs; and declaration caused by a function parameter.
     * @node-deps: None
     * @changes-state: lastDeclare
     * @param iid static, unique instruction identifier
     * @param name variable name
     * @param val if parameter undefined else value of rhs if exists
     * @param _isArgument
     * @param _argumentIndex
     * @param _isCatchParam
     */
    GraphConstructor.prototype.declare = function (iid, name, val, _isArgument, _argumentIndex, _isCatchParam) {
        var declareNode = this.addNode(this.g.createDeclareNode(iidToLoc(iid), name, val));
        this.lastDeclare[name] = declareNode;
    };
    /**
     * Handle be a string literal like 'hi' or an object literal amongst other.
     * @node-deps: None
     * @changes-state: None
     * @param iid static, unique instruction identifier
     * @param val value of literal
     * @param _hasGetterSetter
     * @returns if not object literal nothing -> program uses original val.
     * If object literal -> return val with an uniquely set __id__ field
     * The analyzed program then uses this val istead.
     */
    GraphConstructor.prototype.literal = function (iid, val, _hasGetterSetter) {
        if (typeof val === "object") {
            this.makeIdentifiable(val);
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
     * Handle write of value into variable called name.
     * @node-deps: declaration node for variable name
     * @changes-state: lastWrite
     * @param _iid
     * @param name variable name
     * @param _val
     */
    GraphConstructor.prototype.write = function (_iid, name, _val) {
        this.g.addEdgeIfBothExist(this.currentNode, this.lastDeclare[name]);
        this.lastWrite[name] = this.currentNode;
    };
    /**
     * Handle read of variable called name.
     * @node-deps: declaration node for variable name + write node of last write to variable
     * @changes-state: readOnlyObjects (if typeof(val) === object)
     * @param _iid
     * @param name variable name
     * @param val read value
     * @param _isGlobal
     * @param _isScriptLocal
     */
    GraphConstructor.prototype.read = function (_iid, name, val, _isGlobal, _isScriptLocal) {
        //add edges to declare- & last write-node for variable
        this.g.addEdgeIfBothExist(this.currentNode, this.lastDeclare[name]);
        this.g.addEdgeIfBothExist(this.currentNode, this.lastWrite[name]);
        if (this.makeIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
    };
    /**
     * Handle base.offset = val.
     * @node-deps: None
     * State: readOnlyObjects, lastPut
     * @param _iid
     * @param base base object
     * @param offset property name
     * @param val value to be stored in base[offset]
     * @param _isComputed
     * @param _isOpAssign
     */
    GraphConstructor.prototype.putField = function (_iid, base, offset, val, _isComputed, _isOpAssign) {
        this.makeIdentifiable(val);
        // TOdo: BUG only remove last one
        (0, datatypes_1.removeLast)(this.readOnlyObjects, base.__id__);
        //this always succeeds because typoef base === "object"
        if (this.makeIdentifiable(base)) {
            if (this.lastPut[base.__id__] === undefined) {
                this.lastPut[base.__id__] = {};
            }
            this.lastPut[base.__id__][offset] = this.currentNode;
        }
    };
    /**
     * Handle get of base[offset]
     * @node-deps putField-node at this.lastPut[base.__id__][offset] if exists
     * @changes-state readOnlyObjects
     */
    GraphConstructor.prototype.getField = function (_iid, base, offset, val, _isComputed, _isOpAssign, _isMethodCall) {
        (0, datatypes_1.removeLast)(this.readOnlyObjects, base.__id__);
        if (this.makeIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
        if (this.makeIdentifiable(base)) {
            var baseObjectPuts = this.lastPut[base.__id__];
            // there might not have been any puts
            if (baseObjectPuts !== undefined) {
                var putFieldNode = this.lastPut[base.__id__][offset];
                // there might not have been a put for offset
                if (putFieldNode) {
                    this.g.addEdge(this.currentNode, putFieldNode);
                }
            }
        }
    };
    /**
     * Handle a condition check before branching.
     * Branching can happen in various statements including if-then-else, switch-case, while, for, ||, &&, ?:.
     * @param iid static, unique instruction identifier
     * @param result true iff branch is taken
     * @returns
     */
    GraphConstructor.prototype.conditional = function (iid, result) {
        var loc = iidToLoc(iid);
        // break markers are of form if(true) break; -> detect them in conditional
        if (this.handleBreak(loc)) {
            return;
        }
        else {
            var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
            var testNode = this.addNode(this.g.createTestNode(loc, result, test === null || test === void 0 ? void 0 : test.type));
            //currentExprNodes were created for the for/if test
            this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode;
            //TODO: Only include read nodes?
            this.g.addEdge(testNode, this.currentNode);
            this.g.addEdge(this.currentNode, testNode);
        }
    };
    /**
     * On entering the function there is a read of the function name
     * Get a new currentNode for the first line in the function body.
     * @param iid static, unique instruction identifier
     */
    GraphConstructor.prototype.functionEnter = function (iid) {
        this.endExpression(iid);
    };
    /**
     * @node-deps test-node the expression depends on if exists,
     * all put-nodes for all objects in readOnlyObjects
     * @changes-state reset readOnlyObject, currentNode
     * @param iid
     */
    GraphConstructor.prototype.endExpression = function (iid) {
        this.handleSwitch(iid); // handle if its a switch-discriminator
        /**
         * update currentNode which represents the current expression which has no finished
         * only here we learn its location and use it to find control deps
         */
        var loc = iidToLoc(iid);
        this.currentNode.data({
            loc: loc,
            lloc: loc.toString(),
            line: loc.start.line,
            name: "".concat(loc.start.line, ": exp")
        });
        this.addControlDependencies(this.currentNode);
        if (datatypes_1.SourceLocation.in_between_inclusive(this.slicingCriterion, loc)) {
            this.criterionOnce = true;
        }
        // currentNode depends on  all put-nodes for all objects in readOnlyObjects
        for (var _i = 0, _a = this.readOnlyObjects; _i < _a.length; _i++) {
            var objectId = _a[_i];
            for (var _b = 0, _c = Object.entries(this.lastPut[objectId]); _b < _c.length; _b++) {
                var _d = _c[_b], fieldName = _d[0], putFieldNode = _d[1];
                this.g.addEdge(this.currentNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        // reset current expression state
        this.readOnlyObjects = [];
        this.currentNode = this.g.addCurrentNode();
    };
    /**
     * @node-deps test-node representing switch discriminant depends on currentNode
     * @changes-state lastTest
     * @param iid static, unique instruction identifier
     * @returns
     */
    GraphConstructor.prototype.handleSwitch = function (iid) {
        var loc = iidToLoc(iid);
        var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
        if (test && test.type === "switch-disc") {
            var testNode = this.addNode(this.g.createTestNode(test.loc, true, "switch-disc"));
            this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode;
            // the switch-discriminant depends on the reads, writes currentNode depends on
            this.g.addEdge(testNode, this.currentNode);
            return true;
        }
        return false;
    };
    /**
     * Check if a break marker is being executed, if so record that
     * @depends nothing
     * @changes-state executedBreakNodes
     * @param wrappingIfPredicateLocation location of a normal if or the break marker i.e. "if(true) break; ""
     * @returns true iff a break marker is present
     */
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
    /**
     * Write the constructed graph into a .json file.
     * Invoke the pruning phase and pass the graph,
     * and the source-mapped slicing criterion to the pruning stage.
     */
    GraphConstructor.prototype.endExecution = function () {
        var _this = this;
        if (this.criterionOnce) {
            var node_1 = this.g.addNode(this.g.createNode({ loc: this.slicingCriterion }));
            if (datatypes_1.SourceLocation.in_between_inclusive(this.slicingCriterion, node_1.data().loc)) {
                this.executedBreakNodes.nodes().forEach(function (bNode) { return _this.g.addEdge(node_1, bNode); });
            }
        }
        else {
            console.log("hi");
        }
        var inFilePath = J$.smap[1].originalCodeFileName;
        try {
            (0, fs_1.mkdirSync)("../graphs");
        }
        catch (e) {
            //this error is expected as it is thrown when the graphs directory esists already
        }
        (0, fs_1.writeFileSync)("../graphs/".concat(path.basename(inFilePath), "_graph.json"), JSON.stringify(this.g.graph.json()));
        (0, pruner_1.graphBasedPrune)(inFilePath, this.outFile, this.g.graph, this.slicingCriterion);
    };
    /**
     * Augment val by unique number __id__ field for object tracking
     * @param val thing to be made identifiable, impossible for primitive types
     * @returns true iff typeof(val) === object
     */
    GraphConstructor.prototype.makeIdentifiable = function (val) {
        if (typeof val !== "object") {
            return false;
        }
        var valObj = val;
        if (valObj.__id__ === undefined) {
            valObj.__id__ = this.nextObjectId++;
        }
        return true;
    };
    /**
     * Given nodeLoc find most recent test-node for the test it depends on.
     * @param nodeLoc location of node
     * @returns test-node, on which node depends immediately (by control-dependency) if such exists
     */
    GraphConstructor.prototype.findTestDependency = function (nodeLoc) {
        var branchDependency = (0, control_deps_1.cDepForLoc)(nodeLoc, this.controlDeps);
        if (branchDependency) {
            return this.lastTest[datatypes_1.Position.toString(branchDependency.testLoc.start)];
        }
    };
    /**
     * Add node acc. to nodeDef to graph, and create edge to test-node
     * iff node is control-dependent on some test.
     * @param nodeDef description of node to add
     * @returns 'living' node in graph
     */
    GraphConstructor.prototype.addNode = function (nodeDef) {
        var _this = this;
        var node = this.g.addNode(nodeDef, this.findTestDependency(nodeDef.data.loc));
        if (datatypes_1.SourceLocation.in_between_inclusive(this.slicingCriterion, node.data().loc)) {
            this.criterionOnce = true;
            this.executedBreakNodes.nodes().forEach(function (bNode) { return _this.g.addEdge(node, bNode); });
        }
        return node;
    };
    /**
     * Add control-dependencies of node to graph
     * @param node node in graph
     * @returns true iff node is control-dependent on a test and has been connected
     * to most recent test-node of that test.
     */
    GraphConstructor.prototype.addControlDependencies = function (node) {
        var _this = this;
        var testNode = this.findTestDependency(node.data().loc);
        if (datatypes_1.SourceLocation.in_between_inclusive(this.slicingCriterion, node.data().loc)) {
            this.executedBreakNodes.nodes().forEach(function (bNode) { return _this.g.addEdge(node, bNode); });
        }
        return this.g.addEdgeIfBothExist(node, testNode) || this.executedBreakNodes.size() != 0;
    };
    return GraphConstructor;
}());
J$.analysis = new GraphConstructor();
//# sourceMappingURL=graph-constructor.js.map