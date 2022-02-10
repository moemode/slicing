import cytoscape = require("cytoscape");
import { Core, Collection, ElementDefinition } from "cytoscape";
import { Position, SourceLocation } from "./datatypes";
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

    lastWrites = {};
    lastDeclare = {};
    //lastPut[objectId][offset] = putNode
    lastPut = {};
    nextObjectIds = 1;
    //lastTest[location] = testNode
    lastTest = {};

    controlDeps: ControlDependency[];
    tests: Test[];

    currentNode;
    currentNodeInGraph;
    isConditional = false;
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
        this.executedBreakNodes = this.graph.collection();
        const node = {
            group: <const>"nodes",
            data: { id: `n${this.nextNodeId++}` },
        };
        this.currentNode = node;
        this.currentNodeInGraph = this.graph.add(node);
    }

    declare(iid, name, val, isArgument, argumentIndex, isCatchParam): void {
        const rhs_line = iidToLoc(iid).start.line;
        /*
        const declareNode = this.addNode({
            line: rhs_line,
            name: name,
            varname: name,
            val: String(val),
            type: "declare"
        });*/
        const declareNode = this.addDeclareNode(iid, name, val);
        //const declareNode = this.addDeclareNode(iid, name, val);
        this.lastDeclare[name] = declareNode;
    }

    literal(iid, val, hasGetterSetter): { result: unknown } {
        if (typeof val === "object") {
            this.addId(val);
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
    write(iid: string, name: string, val: unknown): void {
        const declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.addEdge(this.currentNode, declareNode);
        }
        this.lastWrites[name] = this.currentNode;
    }

    read(iid, name, val, isGlobal, isScriptLocal): void {
        this.addId(val);
        const declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.addEdge(this.currentNode, declareNode);
        }
        //add edge to last write / declare of variable name
        //assert val is lastWrites val
        const readNode = this.currentNode;
        if (typeof val === "object") {
            this.readOnlyObjects.push(val.__id__);
        }
        const lastWriteNode = this.lastWrites[name];
        //read without write happens when undefined read
        if (lastWriteNode) {
            this.addEdge(readNode, lastWriteNode);
        }
    }

    addTestDependency(node): void {
        //found whether the current location has a control dependency
        const branchDependency = cDepForLoc(node.data.loc, this.controlDeps);
        if (branchDependency) {
            //Todo: not going to work because of hash bs
            const testNode = this.lastTest[Position.toString(branchDependency.testLoc.start)];
            this.addEdge(node, testNode);
        }
    }

    putField(iid, base, offset, val, isComputed, isOpAssign): void {
        this.addId(base);
        this.addId(val);
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter((objectId) => objectId != base.__id__);
        if (this.lastPut[base.__id__] === undefined) {
            this.lastPut[base.__id__] = {};
        }
        this.lastPut[base.__id__][offset] = this.currentNode;
    }

    getField(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
        this.addId(val);
        this.addId(base);
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter((objectId) => objectId != base.__id__);
        //Todo: This does not work for string objects
        const getFieldNode = this.currentNode;
        if (typeof val === "object") {
            this.readOnlyObjects.push(val.__id__);
        }
        //no retrievalNode if val is of primitive type not an object
        const baseObjectPuts = this.lastPut[base.__id__];
        if (baseObjectPuts !== undefined) {
            const putFieldNode = this.lastPut[base.__id__][offset];
            if (putFieldNode) {
                this.addEdge(getFieldNode, putFieldNode);
            }
        }
        this.addId(val);
    }

    conditional(iid: string, result: boolean): void {
        this.isConditional = true;
        const loc = iidToLoc(iid);
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
                this.addEdge(testNode, this.currentNode);
                this.addEdge(this.currentNode, testNode);
            }
        }
    }

    functionEnter(iid: string): void {
        this.endExpression(iid);
    }

    endExpression(iid: string): void {
        const loc = iidToLoc(iid);
        //switch expression does not result in callback to this.conditional -> handle it here
        this.handleSwitch(loc);
        this.currentNodeInGraph.data({
            loc,
            lloc: loc.toString(),
            line: iidToLoc(iid).start.line,
            type: "expression"
        });
        for (const objectId of this.readOnlyObjects) {
            for (const [fieldName, putFieldNode] of Object.entries(this.lastPut[objectId])) {
                this.addEdge(this.currentNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        this.addTestDependency(this.currentNode);
        this.readOnlyObjects = [];
        const node = {
            group: <const>"nodes",
            data: { id: `n${this.nextNodeId++}` }
        };
        this.currentNode = node;
        this.currentNodeInGraph = this.graph.add(node);
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
            this.addEdge(testNode, this.currentNode);
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
            const breakNode = this.addBreakNode(loc);
            this.executedBreakNodes = this.executedBreakNodes.union(breakNode);
            return true;
        }
        return false;
    }

    endExecution(): void {
        //this.graph.remove(`node[id=${this.currentNode.id}]`);
        const inFilePath = J$.smap[1].originalCodeFileName;
        try {
            mkdirSync(`../graphs`);
        } catch (e) {
            //this error is expected as it is thrown when the graphs directory esists already
        }
        writeFileSync(`../graphs/${path.basename(inFilePath)}_graph.json`, JSON.stringify(this.graph.json()));
        graphBasedPrune(inFilePath, this.outFile, this.graph, this.executedBreakNodes, this.slicingCriterion);
    }

    private addId(val): void {
        if (typeof val !== "object") {
            return;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectIds++;
        }
    }

    private addNode(data): ElementDefinition {
        const node = this.createNode(data);
        this.graph.add(node);
        return node;
    }



    private addEdge(source, target): void {
        this.graph.add({
            group: <const>"edges",
            data: {
                id: `e${this.nextEdgeId++}`,
                source: source.data.id,
                target: target.data.id
            }
        });
    }

    private createNode(data): ElementDefinition {
        const node = {
            group: <const>"nodes",
            data: data
        };
        node.data.id = `n${this.nextNodeId++}`;
        return node;
    }

    private createTestNode(test, result): ElementDefinition {
        return this.createNode({
            loc: test.loc,
            lloc: test.loc.toString(),
            val: result,
            line: test.loc.start.line,
            type: `${test.type}-test`,
            name: `${test.type}-test`,
        });
    }

    private createDeclareNode(iid, name, val): ElementDefinition {
        const loc = iidToLoc(iid);
        return this.createNode({
            line: loc.start.line,
            loc,
            name: name,
            varname: name,
            val: String(val),
            type: "declare"
        });
    }

    private createBreakNode(loc: SourceLocation): ElementDefinition {
        return this.createNode({
            loc: loc,
            lloc: loc.toString(),
            line: loc.start.line,
            name: `break`
        })
    }

    private addNodeNew(node): cytoscape.NodeSingular {
        const c: cytoscape.Collection = this.graph.add(node);
        this.addTestDependency(node);
        return c.nodes()[0];
    }

    private addDeclareNode(iid, name, val): ElementDefinition {
        const declareNode = this.createDeclareNode(iid, name, val);
        this.addNodeNew(declareNode);
        return declareNode;
    }

    private addTestNode(test, result): ElementDefinition {
        const testNode = this.createTestNode(test, result);
        this.addNodeNew(testNode);
        return testNode;
    }

    private addBreakNode(loc: SourceLocation): cytoscape.NodeSingular {
        const breakNode = this.createBreakNode(loc);
        return this.addNodeNew(breakNode);
    }
}

J$.analysis = new GraphConstructor();
