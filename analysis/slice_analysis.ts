const cytoscape = require("cytoscape");
const fs = require("fs");
const pruner = require("./parser.js");
const location = require("./datatypes");
const controlDepsHelper = require("./control-deps");
const path = require("path");


// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis.js program.js
declare var J$: any;

class SliceAnalysis {
    writtenValues = [];
    graph = cytoscape();
    fs = fs;
    nextNodeId = 1;
    nextEdgeId = 1;
    outFile = J$.initParams["outFile"];
    // the specified line is 0-based but we use 1-based internally
    lineNb = parseInt(J$.initParams["lineNb"]);
    readsForWrite = []

    currentExprNodes = [];
    lastWrites = {};
    //lastPut[objectId][offset] = putNode
    lastPut = {};
    nextObjectIds = 1;
    //lastTest[location] = testNode
    lastTest = {}
    currentObjectRetrievals = [];

    callStack = [];

    currentCallerLoc = null;
    currentCalleeLoc = null;



    scriptEnter(iid, instrumentedFileName, originalFileName) {
        [this.controlDeps, this.tests] = controlDepsHelper.controlDependencies(originalFileName);
        this.currentObjectRetrievals = [];
    }

    declare(iid, name, val, isArgument, argumentIndex, isCatchParam) {
        this.writtenValues.push(val);
        rhs_line = location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        const declareNode = this.addNode({
            loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            line: rhs_line, name: name, varname: name, val: String(val), type: "declare"
        });
        this.lastWrites[name] = declareNode;
        if (typeof val === "object" && val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
            return { result: val };
        }
    }

    literal(iid, val, hasGetterSetter) {
        if (typeof val === "object") {
            if (val.__id__ === undefined) {
                val.__id__ = this.nextObjectIds++;
            }
            for (const [propertyName, propertyValue] of Object.entries(val)) {
                if (propertyName != "__id__") {
                    this.putField(iid, val, propertyName, propertyValue, undefined, undefined);
                }
            }
            return { result: val };
        }
    }


    write(iid, name, val, lhs, isGlobal, isScriptLocal) {
        const lhsLocation = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
        const writeNode = this.addNode({
            loc: lhsLocation, name: name, varname: name, val: val, type: "write",
            line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
        });
        this.currentExprNodes.push(writeNode);
        this.lastWrites[name] = writeNode;
        const readsForWrite = this.currentExprNodes.filter(node => location.in_between_inclusive(lhsLocation, node.data.loc));
        readsForWrite.forEach(node => this.addEdge(writeNode, node))
        if (typeof val === "object" && val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
            return { result: val };

        }
    }

    read(iid, name, val, isGlobal, isScriptLocal) {
        //add edge to last write / declare of variable name
        //assert val is lastWrites val
        const readNode = this.addNode({
            loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: name, varname: name,
            val: String(val), type: "read",
            line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
        });
        this.currentExprNodes.push(readNode);
        const lastWriteNode = this.lastWrites[name];
        if (lastWriteNode) {
            this.addEdge(readNode, lastWriteNode);
        } else {
            console.log("Read without write");
        }
        return this.addObjectRetrieval(val, readNode);
    }

    addTestDependency(node) {
        //found whether the current location has a control dependency
        const branchDependency = controlDepsHelper.findControlDep(node.data.loc, this.controlDeps);
        if (branchDependency) {
            //Todo: not going to work because of hash bs
            const testNode = this.lastTest[location.positionToString(branchDependency.testLoc.start)];
            this.addEdge(node, testNode);
        }
    }

    putField(iid, base, offset, val, isComputed, isOpAssign) {
        const retrievalNode = this.currentObjectRetrievals[base.__id__];
        const putFieldNode = this.addNode({
            loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: `putfield ${offset}:${val}`, val: val, type: "putField",
            line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
        })
        //no retrieval node if called via literal
        if (retrievalNode) {
            this.addEdge(putFieldNode, retrievalNode);
        }
        const readsForPut = this.currentExprNodes.filter(node => location.in_between_inclusive(putFieldNode.data.loc, node.data.loc));
        readsForPut.forEach(node => this.addEdge(putFieldNode, node));
        this.currentExprNodes.push(putFieldNode);
        // initialize if first put
        if (this.lastPut[base.__id__] === undefined) {
            this.lastPut[base.__id__] = {};
        }
        this.lastPut[base.__id__][offset] = putFieldNode;
    }

    getField(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
        //Todo: This does not work for string objects
        const retrievalNode = this.currentObjectRetrievals[base.__id__];
        const getFieldNode = this.addNode({
            loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: `getfield ${offset}:${val}`, val: val, type: "getField",
            line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
        });
        this.currentExprNodes.push(getFieldNode);
        //no retrievalNode if val is of primitive type not an object
        if (retrievalNode) {
            this.addEdge(getFieldNode, retrievalNode);
        }
        const baseObjectPuts = this.lastPut[base.__id__]
        /* 
        When there is no put for this field on the object it might have been created by a literal.
        But then we must have read a variable containing this object and the read node
        transitively depends on this write of the  into a original variable
        */
        if (baseObjectPuts !== undefined) {
            const putFieldNode = this.lastPut[base.__id__][offset];
            if (putFieldNode) {
                this.addEdge(getFieldNode, putFieldNode);
            }
        }
        return this.addObjectRetrieval(val, retrievalNode);
    }

    private addObjectRetrieval(val, retrievalNode) {
        if (typeof val !== "object") {
            return;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
        }
        this.currentObjectRetrievals[val.__id__] = retrievalNode;
        return { result: val };
    }


    private addNode(data) {
        const node = {
            group: 'nodes',
            data: data
        };
        node.data.id = `n${this.nextNodeId++}`;
        if (this.currentCallerLoc) {
            node.data.callerLoc = this.currentCallerLoc;
        }
        this.graph.add(node);
        this.addTestDependency(node);
        return node;
    }

    private addEdge(source, target) {
        this.graph.add({
            group: 'edges',
            data: {
                id: `e${this.nextEdgeId++}`,
                source: source.data.id,
                target: target.data.id,
            },
        });
    }

    private addTestNode(test, result) {
        const testNode = {
            group: 'nodes',
            data: {
                id: `n${this.nextNodeId++}`,
                loc: test.loc,
                val: result,
                line: test.loc.start.line,
                type: `${test.type}-test`,
                name: `${test.type}-test`,
            },
        };
        this.graph.add(testNode);
        this.addTestDependency(testNode);
        return testNode;
    }

    conditional(iid, result) {
        const loc = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
        const test = this.tests.find(t => location.locEq(t.loc, loc));
        if (test) {
            console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
            const testNode = this.addTestNode(test, result);
            //currentExprNodes were created for the for/if test
            this.lastTest[location.positionToString(test.loc.start)] = testNode;
            //TODO: Only include read nodes?
            this.currentExprNodes.forEach(node => (this.addEdge(testNode, node)));
        }
    }

    endExpression(iid) {
        const loc = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
        //switch expression does not result in callback to this.conditional -> handle it here
        const test = this.tests.find(t => location.locEq(t.loc, loc));
        if (test && test.type === "switch-disc") {
            // todo duplicate of conditional
            console.log("Detected switch discriminant: at l " + test.loc.start.line);
            const testNode = this.addTestNode(test, "case-disc");
            //currentExprNodes were created for the for/if test
            this.lastTest[location.positionToString(test.loc.start)] = testNode;
            //TODO: Only include read nodes?
            this.currentExprNodes.forEach(node => (this.addEdge(testNode, node)));

        }
        this.addNode({
            loc: loc, line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
            type: "end-expression"
        });
        this.currentExprNodes = [];
        this.currentObjectRetrievals = [];
    }

    endExecution() {
        const inFilePath = J$.smap[1].originalCodeFileName;
        try {
            fs.mkdirSync(`../graphs`);
        } catch (e) {
            //this error is expected as it is thrown when the graphs directory esists already
        };
        fs.writeFileSync(`../graphs/${path.basename(inFilePath)}_graph.json`, JSON.stringify(this.graph.json()));
        pruner.prune(inFilePath, this.outFile, this.graph, this.lineNb)
    }

    invokeFunPre(iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
        const callerLoc = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.sid, iid));
        let calleeLoc = J$.iidToLocation(functionSid, functionIid);
        if (calleeLoc !== "undefined") {
            calleeLoc = location.jalangiLocationToSourceLocation(J$.iidToLocation(functionSid, functionIid));
        }
        this.callStack.push(new location.CallStackEntry(callerLoc, calleeLoc));
        this.currentCallerLoc = callerLoc;
        this.currentCalleeLoc = calleeLoc;
    };

    invokeFun(iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
        this.callStack.pop();
        if (this.callStack.length > 0) {
            const topCallStackEntry = this.callStack[this.callStack.length - 1];
            this.currentCallerLoc = topCallStackEntry.callerLoc;
            this.currentCalleeLoc = topCallStackEntry.calleeLoc;
        }
    };

}






J$.analysis = new SliceAnalysis();