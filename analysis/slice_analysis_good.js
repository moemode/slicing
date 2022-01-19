var cytoscape = require("cytoscape");
var fs = require("fs");
var pruner = require("./parser.js");
var location = require("./datatypes");
var controlDepsHelper = require("./control-deps");
var path = require("path");
(function (jalangi) {
    function SliceAnalysis() {
        this.writtenValues = [];
        this.graph = cytoscape();
        this.fs = fs;
        this.nextNodeId = 1;
        this.nextEdgeId = 1;
        this.outFile = J$.initParams["outFile"];
        // the specified line is 0-based but we use 1-based internally
        this.lineNb = parseInt(J$.initParams["lineNb"]);
        this.readsForWrite = [];
        this.currentExprNodes = [];
        this.lastWrites = {};
        //this.lastPut[objectId][offset] = putNode
        this.lastPut = {};
        this.nextObjectIds = 1;
        //this.lastTest[location] = testNode
        this.lastTest = {};
        this.currentObjectRetrievals = [];
        this.callStack = [];
        this.currentCallerLoc = null;
        this.currentCalleeLoc = null;
        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            var _a;
            _a = controlDepsHelper.controlDependencies(originalFileName), this.controlDeps = _a[0], this.tests = _a[1];
            this.currentObjectRetrievals = [];
        };
        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            this.writtenValues.push(val);
            rhs_line = location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)));
            var declareNode = this.addNode({
                loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                line: rhs_line, name: name, varname: name, val: String(val), type: "declare"
            });
            this.lastWrites[name] = declareNode;
            if (typeof val === "object" && val.__id__ === undefined) {
                val.__id__ = this.nextObjectIds++;
                return { result: val };
            }
        };
        this.literal = function (iid, val, hasGetterSetter) {
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
        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            var _this = this;
            var lhsLocation = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
            var writeNode = this.addNode({
                loc: lhsLocation, name: name, varname: name, val: val, type: "write",
                line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
            });
            this.currentExprNodes.push(writeNode);
            this.lastWrites[name] = writeNode;
            var readsForWrite = this.currentExprNodes.filter(function (node) { return location.in_between_inclusive(lhsLocation, node.data.loc); });
            readsForWrite.forEach(function (node) { return _this.addEdge(writeNode, node); });
            if (typeof val === "object" && val.__id__ === undefined) {
                val.__id__ = this.nextObjectIds++;
                return { result: val };
            }
        };
        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            //add edge to last write / declare of variable name
            //assert val is lastWrites val
            var readNode = this.addNode({
                loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                name: name, varname: name,
                val: String(val), type: "read",
                line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
            });
            this.currentExprNodes.push(readNode);
            var lastWriteNode = this.lastWrites[name];
            if (lastWriteNode) {
                this.addEdge(readNode, lastWriteNode);
            }
            else {
                console.log("Read without write");
            }
            return this.addObjectRetrieval(val, readNode);
        };
        this.addTestDependency = function (node) {
            //found whether the current location has a control dependency
            var branchDependency = controlDepsHelper.findControlDep(node.data.loc, this.controlDeps);
            if (branchDependency) {
                //Todo: not going to work because of hash bs
                var testNode = this.lastTest[location.positionToString(branchDependency.testLoc.start)];
                this.addEdge(node, testNode);
            }
        };
        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            var _this = this;
            var retrievalNode = this.currentObjectRetrievals[base.__id__];
            var putFieldNode = this.addNode({
                loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                name: "putfield ".concat(offset, ":").concat(val), val: val, type: "putField",
                line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
            });
            //no retrieval node if called via literal
            if (retrievalNode) {
                this.addEdge(putFieldNode, retrievalNode);
            }
            var readsForPut = this.currentExprNodes.filter(function (node) { return location.in_between_inclusive(putFieldNode.data.loc, node.data.loc); });
            readsForPut.forEach(function (node) { return _this.addEdge(putFieldNode, node); });
            this.currentExprNodes.push(putFieldNode);
            // initialize if first put
            if (this.lastPut[base.__id__] === undefined) {
                this.lastPut[base.__id__] = {};
            }
            this.lastPut[base.__id__][offset] = putFieldNode;
        };
        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            //Todo: This does not work for string objects
            var retrievalNode = this.currentObjectRetrievals[base.__id__];
            var getFieldNode = this.addNode({
                loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                name: "getfield ".concat(offset, ":").concat(val), val: val, type: "getField",
                line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
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
            if (baseObjectPuts !== undefined) {
                var putFieldNode = this.lastPut[base.__id__][offset];
                if (putFieldNode) {
                    this.addEdge(getFieldNode, putFieldNode);
                }
            }
            return this.addObjectRetrieval(val, retrievalNode);
        };
        this.addObjectRetrieval = function (val, retrievalNode) {
            if (typeof val !== "object") {
                return;
            }
            if (val.__id__ === undefined) {
                val.__id__ = this.nextObjectIds++;
            }
            this.currentObjectRetrievals[val.__id__] = retrievalNode;
            return { result: val };
        };
        this.addNode = function (data) {
            var node = {
                group: 'nodes',
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
        this.addEdge = function (source, target) {
            this.graph.add({
                group: 'edges',
                data: {
                    id: "e".concat(this.nextEdgeId++),
                    source: source.data.id,
                    target: target.data.id,
                },
            });
        };
        this.addTestNode = function (test, result) {
            var testNode = {
                group: 'nodes',
                data: {
                    id: "n".concat(this.nextNodeId++),
                    loc: test.loc,
                    val: result,
                    line: test.loc.start.line,
                    type: "".concat(test.type, "-test"),
                    name: "".concat(test.type, "-test"),
                },
            };
            this.graph.add(testNode);
            this.addTestDependency(testNode);
            return testNode;
        };
        this.conditional = function (iid, result) {
            var _this = this;
            var loc = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
            var test = this.tests.find(function (t) { return location.locEq(t.loc, loc); });
            if (test) {
                console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
                var testNode_1 = this.addTestNode(test, result);
                //currentExprNodes were created for the for/if test
                this.lastTest[location.positionToString(test.loc.start)] = testNode_1;
                //TODO: Only include read nodes?
                this.currentExprNodes.forEach(function (node) { return (_this.addEdge(testNode_1, node)); });
            }
        };
        this.endExpression = function (iid) {
            var _this = this;
            var loc = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
            //switch expression does not result in callback to this.conditional -> handle it here
            var test = this.tests.find(function (t) { return location.locEq(t.loc, loc); });
            if (test && test.type === "switch-disc") {
                // todo duplicate of conditional
                console.log("Detected switch discriminant: at l " + test.loc.start.line);
                var testNode_2 = this.addTestNode(test, "case-disc");
                //currentExprNodes were created for the for/if test
                this.lastTest[location.positionToString(test.loc.start)] = testNode_2;
                //TODO: Only include read nodes?
                this.currentExprNodes.forEach(function (node) { return (_this.addEdge(testNode_2, node)); });
            }
            this.addNode({
                loc: loc, line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
                type: "end-expression"
            });
            this.currentExprNodes = [];
            this.currentObjectRetrievals = [];
        };
        this.endExecution = function () {
            var inFilePath = J$.smap[1].originalCodeFileName;
            try {
                fs.mkdirSync("../graphs");
            }
            catch (e) {
                //this error is expected as it is thrown when the graphs directory esists already
            }
            ;
            fs.writeFileSync("../graphs/".concat(path.basename(inFilePath), "_graph.json"), JSON.stringify(this.graph.json()));
            pruner.prune(inFilePath, this.outFile, this.graph, this.lineNb);
        };
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            var callerLoc = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.sid, iid));
            var calleeLoc = J$.iidToLocation(functionSid, functionIid);
            if (calleeLoc !== "undefined") {
                calleeLoc = location.jalangiLocationToSourceLocation(J$.iidToLocation(functionSid, functionIid));
            }
            this.callStack.push(new location.CallStackEntry(callerLoc, calleeLoc));
            this.currentCallerLoc = callerLoc;
            this.currentCalleeLoc = calleeLoc;
        };
        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
            this.callStack.pop();
            if (this.callStack.length > 0) {
                var topCallStackEntry = this.callStack[this.callStack.length - 1];
                this.currentCallerLoc = topCallStackEntry.callerLoc;
                this.currentCalleeLoc = topCallStackEntry.calleeLoc;
            }
        };
    }
    jalangi.analysis = new SliceAnalysis();
}(J$));
//# sourceMappingURL=slice_analysis_good.js.map