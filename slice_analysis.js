const cytoscape = require("cytoscape");
const fs = require("fs");
const pruner = require("./parser.js");
const location = require("./datatypes");
const controlDepsHelper = require("./control-deps");
const path = require("path");


// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis.js program.js

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
        this.readsForWrite = []

        this.currentExprNodes = [];
        this.lastWrites = {};
        //this.lastPut[objectId][offset] = putNode
        this.lastPut = {};
        this.nextObjectIds = 1;
        //this.lastTest[location] = testNode
        this.lastTest = {}

        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            [this.controlDeps, this.tests] = controlDepsHelper.controlDependencies(originalFileName);
        }

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            this.writtenValues.push(val);
            const valObject = this.makeIdentifiable(val);
            rhs_line = location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)))
            const declareNode = {
                group: 'nodes', data: {
                    id: `n${this.nextNodeId++}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    line: rhs_line, name: name, val: val, type: "declare"
                },
            };
            this.lastWrites[name] = declareNode;
            this.graph.add(declareNode);
            this.addTestDependency(declareNode);
            return {result: valObject};
        }

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            const lhsLocation = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
            const readsForWrite = this.currentExprNodes.filter(node => location.in_between_inclusive(lhsLocation, node.data.loc));
            //this.writtenValues.push(val);
            const writeNodeId = this.nextNodeId;
            this.nextNodeId = this.nextNodeId + 1;
            const valObject = this.makeIdentifiable(val);
            const writeNode = {
                group: 'nodes',
                data: {
                    id: `n${writeNodeId}`,
                    loc: lhsLocation,
                    name: name,
                    varname: name,
                    val: val,
                    line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
                    type: "write"
                },
            };
            this.graph.add(writeNode);
            this.currentExprNodes.push(writeNode);
            this.lastWrites[name] = writeNode;
            const newEdges = readsForWrite.map(node => ({
                group: 'edges',
                data: {
                    id: `e${this.nextEdgeId++}`,
                    source: `n${writeNodeId}`,
                    target: node.data.id
                }
            }));
            this.graph.add(newEdges);
            this.addTestDependency(writeNode);
            return {result: valObject};
        }

        this.makeIdentifiable = function(val) {
            if (val === null || val === undefined) {
                return val;
            }
            // if val is Object already this is no-op
            const valObject = Object(val);
            // now val is certainly an object
            if (valObject.__id__ === undefined) {
                valObject.__id__ = this.nextObjectIds++;
                valObject.__actual__ = val;
            }
            return valObject;
        }

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            //add edge to last write / declare of variable name
            //assert val is lastWrites val
            const readNode = {
                group: 'nodes', data: {
                    id: `n${this.nextNodeId}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    name: name, varname: name,
                    val: val, type: "read",
                    line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
                },
            };
            const readNodeId = this.nextNodeId;
            this.nextNodeId = this.nextNodeId + 1;
            this.graph.add(readNode);
            this.currentExprNodes.push(readNode);
            const lastWriteNode = this.lastWrites[name];
            if (lastWriteNode) {
                const toWriteEdge = {
                    group: 'edges',
                    data: {
                        id: `e${this.nextEdgeId}`,
                        source: `n${readNodeId}`,
                        target: lastWriteNode.data.id,
                    },
                };
                this.graph.add(toWriteEdge);
                this.nextEdgeId = this.nextEdgeId + 1;
            } else {
                console.log("Read without write");
            }
            this.addTestDependency(readNode);
            this.addObjectRetrieval(val, readNode);
        }

        this.addTestDependency = function (node) {
            //controlDeps.findControlDep node.loc
            const branchDependency = controlDepsHelper.findControlDep(node.data.loc, this.controlDeps);
            if (branchDependency) {
                //Todo: not going to work because of hash bs
                const testNode = this.lastTest[location.positionToString(branchDependency.testLoc.start)];
                this.addEdge(node, testNode);
            }
        }

        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            const retrievalNode = this.currentObjectRetrievals[base.__id__];
            const valObject = this.makeIdentifiable(val);
            const putFieldNode = {
                group: 'nodes', data: {
                    id: `n${this.nextNodeId++}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    name: `putfield ${offset}:${val.__actual__}`, val: val.__actual__, type: "putField",
                    line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
                },
            };
            this.graph.add(putFieldNode);
            this.addEdge(putFieldNode, retrievalNode);
            const readsForPut = this.currentExprNodes.filter(node => location.in_between_inclusive(putFieldNode.data.loc, node.data.loc));
            readsForPut.forEach(node => this.addEdge(putFieldNode, node));
            this.currentExprNodes.push(putFieldNode);
            // initialize if first put
            if (this.lastPut[base.__id__] === undefined) {
                this.lastPut[base.__id__] = {};
            }
            this.lastPut[base.__id__][offset] = putFieldNode;
            return {result: valObject};
        }

        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            //Todo: This does not work for string objects
            const retrievalNode = this.currentObjectRetrievals[base.__id__];
            const getFieldNode = {
                group: 'nodes', data: {
                    id: `n${this.nextNodeId++}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    name: `getfield ${offset}:${val.__actual__}`, val: val.__actual__, type: "getField",
                    line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
                },
            };
            this.graph.add(getFieldNode);
            this.currentExprNodes.push(getFieldNode);
            this.addEdge(getFieldNode, retrievalNode);
            const baseObjectPuts = this.lastPut[base.__id__]
            /* 
            When there is no put for this field on the object it might have been created by a literal.
            But then we must have read a variable containing this object and the read node
            transitively depends on this write of the literal into a original variable
            */
            if (baseObjectPuts !== undefined) {
                const putFieldNode = this.lastPut[base.__id__][offset];
                this.addEdge(getFieldNode, putFieldNode);
            }
            this.addObjectRetrieval(val, retrievalNode);
        }

        this.addObjectRetrieval = function (val, retrievalNode) {
            if (typeof val !== "object") {
                return;
            }
            if (val.__id__ === undefined) {
                val.__id__ = this.nextObjectIds++;
            }
            this.currentObjectRetrievals[val.__id__] = retrievalNode;
        }



        this.addEdge = function (source, target) {
            this.graph.add({
                group: 'edges',
                data: {
                    id: `e${this.nextEdgeId++}`,
                    source: source.data.id,
                    target: target.data.id,
                },
            });
        }

        this.createTestNode = function (test, result) {
            const id = `n${this.nextNodeId++}`;
            const testNode = {
                group: 'nodes',
                data: {
                    id: id,
                    loc: test.loc,
                    val: result,
                    line: test.loc.start.line,
                    type: `${test.type}-test`,
                    name: `${test.type}-test`,
                },
            };
            return [id, testNode];
        }

        this.conditional = function (iid, result) {
            const loc = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
            const test = this.tests.find(t => location.locEq(t.loc, loc));
            if (test) {
                console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
                const [testNodeId, testNode] = this.createTestNode(test, result);
                //currentExprNodes were created for the for/if test
                this.graph.add(testNode);
                this.lastTest[location.positionToString(test.loc.start)] = testNode;
                //TODO: Only include read nodes?
                this.currentExprNodes.forEach(node => (this.addEdge(testNode, node)));
            }
        }

        this.endExpression = function (iid) {
            this.currentExprNodes = [];
            this.currentObjectRetrievals = [];
        }

        this.endExecution = function () {
            //this.fs.writeFileSync("out.png", this.graph.png({output: "base64"}), {'encoding': 'base64'});
            const inFilePath = J$.smap[1].originalCodeFileName;
            try {
                fs.mkdirSync(`../graphs`);
            } catch (e) {
                //this error is expected as it is thrown when the graphs directory esists already
            };
            fs.writeFileSync(`../graphs/${path.basename(inFilePath)}_graph.json`, JSON.stringify(this.graph.json()));
            pruner.prune(inFilePath, this.outFile, this.graph, this.lineNb)
            //this.linesToKeep = lines reachable in this.graph from read nodes in lineNb
            /*
            for (let v of this.writtenValues) {
                console.log(v);
            }
            console.log(this.lastWrites)
            */
        }

    }

    jalangi.analysis = new SliceAnalysis();
}(J$));




