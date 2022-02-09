import cytoscape = require("cytoscape");
import { Core, Collection, ElementDefinition } from "cytoscape";
import { Position, SourceLocation, JalangiLocation, CallStackEntry } from "./datatypes";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { graphBasedPrune } from "./pruner";
import { ControlDependency, Test, controlDependencies, cDepForLoc } from "./control-deps";
import * as path from "path";

declare let J$: any;

function iidToLoc(iid: string): SourceLocation {
    return SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
}

class GraphConstructor {
    graph: Core = cytoscape();
    nextNodeId = 1;
    nextEdgeId = 1;
    outFile = J$.initParams["outFile"];

    slicingCriterion: SourceLocation;
    bmarkerPath = J$.initParams["bmarkerPath"];
    bmarkers: SourceLocation[] = [];

    executedIfTrueBreaks: SourceLocation[] = [];
    executedBreakNodes: Collection;
    //ids of objects that have been read without being the base for a getField/putField
    readOnlyObjects: string[] = [];

    currentExprNodes = [];
    lastWrites = {};
    lastDeclare = {};
    //lastPut[objectId][offset] = putNode
    lastPut = {};
    nextObjectIds = 1;
    //lastTest[location] = testNode
    lastTest = {};
    currentObjectReads = [];

    callStack = [];

    currentCallerLoc: SourceLocation;
    currentCalleeLoc: SourceLocation;

    controlDeps: ControlDependency[];
    tests: Test[];

    initializeCriterion(): void {
        const start: Position = new Position(
            parseInt(J$.initParams["criterion-start-line"]),
            parseInt(J$.initParams["criterion-start-col"])
        );
        const end: Position = new Position(
            parseInt(J$.initParams["criterion-end-line"]),
            parseInt(J$.initParams["criterion-end-col"])
        );
        this.slicingCriterion = new SourceLocation(start, end);
    }

    scriptEnter(iid, instrumentedFileName, originalFileName): void {
        this.initializeCriterion();
        const bmarkerJSON = readFileSync(this.bmarkerPath).toString();
        const a = JSON.parse(bmarkerJSON);
        this.bmarkers = a.map((obj) => SourceLocation.fromJSON(obj));
        [this.controlDeps, this.tests] = controlDependencies(originalFileName);
        this.currentObjectReads = [];
        this.executedBreakNodes = this.graph.collection();
    }

    declare(iid, name, val, isArgument, argumentIndex, isCatchParam) {
        const rhs_line = JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)));
        const declareNode = this.addNode({
            loc: SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            line: rhs_line,
            name: name,
            varname: name,
            val: String(val),
            type: "declare"
        });
        this.lastDeclare[name] = declareNode;
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

    /**
     * Handle var = rhs;
     * Create node with edges to D(var = rhs) = declaration of var + D(rhs).
     * @param reference jalangi 
     * @returns 
     */
    write(iid, name, val): {result: unknown} | undefined {
        const declareNode =  this.lastDeclare[name] ? [this.lastDeclare[name]] : [];
        const rhsLoc = iidToLoc(iid);
        const rhsNodes = this.getNodesAt(this.currentExprNodes, rhsLoc);
        const writeNode = this.addWriteNode(iid, rhsLoc, name, val);
        declareNode.concat(rhsNodes).forEach((node) => this.addEdge(writeNode, node));
        this.currentExprNodes.push(writeNode);
        this.lastWrites[name] = writeNode;
        if (typeof val === "object" && val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
            return { result: val };
        }
    }

    addWriteNode(iid, rhsLoc, name, val): ElementDefinition {
        return this.addNode({
            loc: rhsLoc,
            name,
            varname: name,
            val,
            type: "write",
            line: JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
    }


    getNodesAt(nodes: any[], loc: SourceLocation): any[] {
        return nodes.filter((node) =>
        SourceLocation.in_between_inclusive(loc, node.data.loc));
    }


    read(iid, name, val, isGlobal, isScriptLocal) {
        //add edge to last write / declare of variable name
        //assert val is lastWrites val
        const readNode = this.addNode({
            loc: SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: name,
            varname: name,
            val: String(val),
            type: "read",
            line: JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
        if (typeof val === "object") {
            this.addObjectRead(val, readNode);
            this.readOnlyObjects.push(val.__id__);
        }
        this.currentExprNodes.push(readNode);
        const declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.addEdge(readNode, declareNode);
        } else {
            console.log("Read without declare");
        }
        const lastWriteNode = this.lastWrites[name];
        if (lastWriteNode) {
            this.addEdge(readNode, lastWriteNode);
        } else {
            console.log("Read without write");
        }
    }

    addTestDependency(node) {
        //found whether the current location has a control dependency
        const branchDependency = cDepForLoc(node.data.loc, this.controlDeps);
        if (branchDependency) {
            //Todo: not going to work because of hash bs
            const testNode = this.lastTest[Position.toString(branchDependency.testLoc.start)];
            this.addEdge(node, testNode);
        }
    }

    putField(iid, base, offset, val, isComputed, isOpAssign) {
        this.readOnlyObjects = this.readOnlyObjects.filter((objectId) => objectId != base.__id__);
        const retrievalNode = this.currentObjectReads[base.__id__];
        const putFieldNode = this.addNode({
            loc: SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: `putfield ${offset}:${val}`,
            val: val,
            type: "putField",
            line: JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
        //no retrieval node if called via literal
        if (retrievalNode) {
            this.addEdge(putFieldNode, retrievalNode);
        }
        const readsForPut = this.currentExprNodes.filter((node) =>
            SourceLocation.in_between_inclusive(putFieldNode.data.loc, node.data.loc)
        );
        readsForPut.forEach((node) => this.addEdge(putFieldNode, node));
        this.currentExprNodes.push(putFieldNode);
        // initialize if first put
        if (this.lastPut[base.__id__] === undefined) {
            this.lastPut[base.__id__] = {};
        }
        this.lastPut[base.__id__][offset] = putFieldNode;
    }

    getField(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
        this.readOnlyObjects = this.readOnlyObjects.filter((objectId) => objectId != base.__id__);
        //Todo: This does not work for string objects
        const retrievalNode = this.currentObjectReads[base.__id__];
        const getFieldNode = this.addNode({
            loc: SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
            name: `getfield ${offset}:${val}`,
            val: val,
            type: "getField",
            line: JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid)))
        });
        this.currentExprNodes.push(getFieldNode);
        //no retrievalNode if val is of primitive type not an object
        if (retrievalNode) {
            this.addEdge(getFieldNode, retrievalNode);
        }
        const baseObjectPuts = this.lastPut[base.__id__];
        /* 
        When there is no put for this field on the object it might have been created by a literal.
        But then we must have read a variable containing this object and the read node
        transitively depends on this write of the  into a original variable
        */
        if (baseObjectPuts == undefined) {
            console.log("baseObjectPuts undefined");
        }
        if (baseObjectPuts !== undefined) {
            const putFieldNode = this.lastPut[base.__id__][offset];
            if (putFieldNode) {
                this.addEdge(getFieldNode, putFieldNode);
            }
        }
        return this.addObjectRead(val, retrievalNode);
    }

    private addObjectRead(val, retrievalNode) {
        if (typeof val !== "object") {
            return;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
        }
        this.currentObjectReads[val.__id__] = retrievalNode;
        return { result: val };
    }

    private addNode(data): ElementDefinition {
        const node = {
            group: <const> "nodes",
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

    private addEdge(source, target): void {
        this.graph.add({
            group: <const> "edges",
            data: {
                id: `e${this.nextEdgeId++}`,
                source: source.data.id,
                target: target.data.id
            }
        });
    }

    private addTestNode(test, result) {
        const testNode = {
            group: "nodes",
            data: {
                id: `n${this.nextNodeId++}`,
                loc: test.loc,
                val: result,
                line: test.loc.start.line,
                type: `${test.type}-test`,
                name: `${test.type}-test`
            }
        };
        this.graph.add(testNode);
        this.addTestDependency(testNode);
        return testNode;
    }

    private addBreakNode(loc: SourceLocation) {
        const breakNode = {
            group: "nodes",
            data: {
                id: `n${this.nextNodeId++}`,
                loc: loc,
                line: loc.start.line,
                name: `break`
            }
        };
        const bNode: cytoscape.Collection = this.graph.add(breakNode);
        this.addTestDependency(breakNode);
        return bNode;
    }

    conditional(iid, result) {
        const loc = SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
        if (this.handleBreak(loc)) {
            return;
        } else {
            const test = this.tests.find((t) => SourceLocation.locEq(t.loc, loc));
            if (test) {
                console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
                const testNode = this.addTestNode(test, result);
                //currentExprNodes were created for the for/if test
                this.lastTest[Position.toString(test.loc.start)] = testNode;
                //TODO: Only include read nodes?
                this.currentExprNodes.forEach((node) => this.addEdge(testNode, node));
            }
        }
    }

    endExpression(iid) {
        const loc = SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
        //switch expression does not result in callback to this.conditional -> handle it here
        this.handleSwitch(loc);
        let graphLoc = loc;
        if (this.currentExprNodes.length > 0) {
            graphLoc = SourceLocation.boundingLocation(this.currentExprNodes.map((n) => n.data.loc));
        }
        this.addNode({
            loc: graphLoc,
            line: JalangiLocation.getLine(J$.iidToLocation(J$.getGlobalIID(iid))),
            type: "end-expression"
        });
        for (const objectId of this.readOnlyObjects) {
            for (const [fieldName, putFieldNode] of Object.entries(this.lastPut[objectId])) {
                const readNode = this.currentObjectReads[objectId];
                this.addEdge(readNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        this.readOnlyObjects = [];
        this.currentExprNodes = [];
        this.currentObjectReads = [];
    }

    handleSwitch(loc: SourceLocation): boolean {
        const test = this.tests.find((t) => SourceLocation.locEq(t.loc, loc));
        if (test && test.type === "switch-disc") {
            // todo duplicate of conditional
            console.log("Detected switch discriminant: at l " + test.loc.start.line);
            const testNode = this.addTestNode(test, "case-disc");
            //currentExprNodes were created for the for/if test
            this.lastTest[Position.toString(test.loc.start)] = testNode;
            //TODO: Only include read nodes?
            this.currentExprNodes.forEach((node) => this.addEdge(testNode, node));
            return true;
        }
        return false;
    }

    handleBreak(wrappingIfPredicateLocation: SourceLocation): boolean {
        const loc = this.bmarkers.filter((bLoc) =>
            SourceLocation.in_between_inclusive(bLoc, wrappingIfPredicateLocation)
        )[0];
        if (loc) {
            this.executedIfTrueBreaks.push(loc);
            const breakNode: Collection = this.addBreakNode(loc);
            this.executedBreakNodes = this.executedBreakNodes.union(breakNode);
            return true;
        }
        return false;
    }

    endExecution(): void {
        const inFilePath = J$.smap[1].originalCodeFileName;
        try {
            mkdirSync(`../graphs`);
        } catch (e) {
            //this error is expected as it is thrown when the graphs directory esists already
        }
        writeFileSync(`../graphs/${path.basename(inFilePath)}_graph.json`, JSON.stringify(this.graph.json()));
        graphBasedPrune(inFilePath, this.outFile, this.graph, this.executedBreakNodes, this.slicingCriterion);
    }

    invokeFunPre(iid, f, base, args, isConstructor, isMethod, functionIid, functionSid): void {
        const callerLoc = SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.sid, iid));
        let calleeLoc = J$.iidToLocation(functionSid, functionIid);
        if (calleeLoc !== "undefined") {
            calleeLoc = SourceLocation.fromJalangiLocation(J$.iidToLocation(functionSid, functionIid));
        }
        this.callStack.push(new CallStackEntry(callerLoc, calleeLoc));
        this.currentCallerLoc = callerLoc;
        this.currentCalleeLoc = calleeLoc;
    }

    invokeFun(iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
        this.callStack.pop();
        if (this.callStack.length > 0) {
            const topCallStackEntry = this.callStack[this.callStack.length - 1];
            this.currentCallerLoc = topCallStackEntry.callerLoc;
            this.currentCalleeLoc = topCallStackEntry.calleeLoc;
        }
    }
}

J$.analysis = new GraphConstructor();
