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
        this.bmarkers = JSON.parse((0, fs_1.readFileSync)(this.bmarkerPath).toString()).map(function (obj) { return datatypes_1.SourceLocation.fromJSON(obj); });
        _a = (0, control_deps_1.controlDependencies)(originalFilePath), this.controlDeps = _a[0], this.tests = _a[1];
        this.executedBreakNodes = this.g.graph.collection();
        this.readOnlyObjects = [];
        this.currentNode = this.g.addCurrentNode();
    };
    /**
     * Handle var name = rhs; and declaration caused by a function parameter.
     * Dependencies: None
     * State Changes: lastDeclare
     * @param iid static, unique instruction identifier
     * @param name variable name
     * @param val if parameter undefined else value of rhs if exists
     * @param _isArgument
     * @param _argumentIndex
     * @param _isCatchParam
     */
    GraphConstructor.prototype.declare = function (iid, name, val, _isArgument, _argumentIndex, _isCatchParam) {
        var declareNode = this.addNode(this.g.createDeclareNode(iidToLoc(iid), name, val));
        // State changes
        this.lastDeclare[name] = declareNode;
    };
    /**
     * Handle be a string literal like 'hi' or an object literal amongst other.
     * Dependencies: None
     * State Changes: None
     * @param iid static, unique instruction identifier
     * @param val value of literal
     * @param _hasGetterSetter
     * @returns if not object literal nothing -> program uses original val.
     * If object literal -> return val with an uniquely set __id__ field
     * The analyzed program then uses this val istead.
     */
    GraphConstructor.prototype.literal = function (iid, val, _hasGetterSetter) {
        if (typeof val === "object") {
            this.isIdentifiable(val);
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
     * Dependencies: declaration node for variable name
     * State Changes: lastWrite
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
     * Dependencies: declaration node for variable name + write node of last write to variable
     * State Changes: readOnlyObjects (if typeof(val) === object)
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
        if (this.isIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
    };
    /**
     * Handle base.offset = val.
     * Dependencies: None
     * State: readOnlyObjects, lastPut
     * @param _iid
     * @param base base object
     * @param offset property name
     * @param val value to be stored in base[offset]
     * @param _isComputed
     * @param _isOpAssign
     */
    GraphConstructor.prototype.putField = function (_iid, base, offset, val, _isComputed, _isOpAssign) {
        this.isIdentifiable(val);
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter(function (objectId) { return objectId != base.__id__; });
        //this always succeeds because typoef base === "object"
        if (this.isIdentifiable(base)) {
            if (this.lastPut[base.__id__] === undefined) {
                this.lastPut[base.__id__] = {};
            }
            this.lastPut[base.__id__][offset] = this.currentNode;
        }
    };
    /**
     * Handle get of base[offset]
     * @dependencies putField-node at this.lastPut[base.__id__][offset] if exists
     * @state-changes readOnlyObjects
     */
    GraphConstructor.prototype.getField = function (_iid, base, offset, val, _isComputed, _isOpAssign, _isMethodCall) {
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter(function (objectId) { return objectId != base.__id__; });
        if (this.isIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
        if (this.isIdentifiable(base)) {
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
            var testNode = this.g.addNode(this.g.createTestNode(loc, result, test === null || test === void 0 ? void 0 : test.type));
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
     * @dependencies test-node the expression depends on if exists,
     * all put-nodes for all objects in readOnlyObjects
     * @state-changes reset readOnlyObject, currentNode
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
        });
        this.addTestDependency(this.currentNode);
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
    GraphConstructor.prototype.handleSwitch = function (iid) {
        var loc = iidToLoc(iid);
        var test = this.tests.find(function (t) { return datatypes_1.SourceLocation.locEq(t.loc, loc); });
        if (test && test.type === "switch-disc") {
            var testNode = this.addNode(this.g.createTestNode(test.loc, true, "switch-disc"));
            this.lastTest[datatypes_1.Position.toString(test.loc.start)] = testNode;
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
    GraphConstructor.prototype.isIdentifiable = function (val) {
        if (typeof val !== "object") {
            return false;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectId++;
        }
        return true;
    };
    GraphConstructor.prototype.findTestDependency = function (nodeLoc) {
        var branchDependency = (0, control_deps_1.cDepForLoc)(nodeLoc, this.controlDeps);
        if (branchDependency) {
            return this.lastTest[datatypes_1.Position.toString(branchDependency.testLoc.start)];
        }
    };
    GraphConstructor.prototype.addNode = function (nodeDef) {
        return this.g.addNode(nodeDef, this.findTestDependency(nodeDef.data.loc));
    };
    GraphConstructor.prototype.addTestDependency = function (node) {
        var testNode = this.findTestDependency(node.data().loc);
        this.g.addEdgeIfBothExist(node, testNode);
    };
    return GraphConstructor;
}());
J$.analysis = new GraphConstructor();
//# sourceMappingURL=da_graph_constructor.js.map