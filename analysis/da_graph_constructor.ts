import cytoscape = require("cytoscape");
import { Collection, ElementDefinition } from "cytoscape";
import { Position, SourceLocation } from "./datatypes";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { graphBasedPrune } from "./pruner";
import { ControlDependency, Test, controlDependencies, cDepForLoc } from "./control-deps";
import * as path from "path";
import { GraphHelper } from "./graph_helper";

declare let J$: any;

function iidToLoc(iid: string): SourceLocation {
    return SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
}

class GraphConstructor {
    /** Input Params */
    outFile = J$.initParams["outFile"];
    bmarkerPath = J$.initParams["bmarkerPath"];
    slicingCriterion: SourceLocation;
    /** Static information about source program*/
    bmarkers: SourceLocation[] = [];
    controlDeps: ControlDependency[];
    tests: Test[];
    /** Analysis Global State: Graph + Most-Recent (i.e. 'last') Information */
    g: GraphHelper = new GraphHelper(cytoscape()); // helper containing the graph itself
    executedBreakNodes: Collection; // contains one node per executed break statement
    nextObjectId = 1; // used by this.addId to make objects identifiable
    lastWrite: Record<string, cytoscape.NodeSingular> = {}; // lastWrite[variableName] == most reent write-node for variableName
    lastDeclare: Record<string, cytoscape.NodeSingular> = {}; // lastDeclare[variableName] == declare-nodef for variableName
    lastPut: Record<string, Record<number, cytoscape.NodeSingular>> = {}; // lastPut[objectId][offset] == most recent put-node
    lastTest: Record<string, cytoscape.NodeSingular> = {}; // lastTest[testLoc.toString()] == most recent test-node
    /** Current Expression  State */
    readOnlyObjects: string[] = []; //ids of read objects which are not (yet) the base for subsequent getField/putField
    currentNode: cytoscape.NodeSingular;

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
        const a = JSON.parse(readFileSync(this.bmarkerPath).toString());
        this.bmarkers = a.map((obj) => SourceLocation.fromJSON(obj));
        [this.controlDeps, this.tests] = controlDependencies(originalFileName);
        this.executedBreakNodes = this.g.graph.collection();
        this.currentNode = this.g.addCurrentNode();
    }

    declare(iid: string, name: string, val: unknown, isArgument, argumentIndex, isCatchParam): void {
        //const declareNode = this.addDeclareNode(iid, name, val);
        const declareNode = this.addNode(this.g.createDeclareNode(iidToLoc(iid), name, val));
        this.lastDeclare[name] = declareNode;
    }

    literal(iid, val, hasGetterSetter): { result: unknown } | undefined {
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
            this.g.addEdge(this.currentNode, declareNode);
        }
        this.lastWrite[name] = this.currentNode;
    }

    read(iid, name, val, isGlobal, isScriptLocal): void {
        this.addId(val);
        const declareNode = this.lastDeclare[name];
        if (declareNode) {
            this.g.addEdge(this.currentNode, declareNode);
        }
        //add edge to last write / declare of variable name
        //assert val is lastWrites val
        const readNode = this.currentNode;
        if (typeof val === "object") {
            this.readOnlyObjects.push(val.__id__);
        }
        const lastWriteNode = this.lastWrite[name];
        //read without write happens when undefined read
        if (lastWriteNode) {
            this.g.addEdge(readNode, lastWriteNode);
        }
    }

    addTestDependency(node): void {
        //found whether the current location has a control dependency
        const branchDependency = cDepForLoc(node.data.loc, this.controlDeps);
        if (branchDependency) {
            //Todo: not going to work because of hash bs
            const testNode = this.lastTest[Position.toString(branchDependency.testLoc.start)];
            this.g.addEdge(node, testNode);
        }
    }

    findTestDependency(nodeLoc: SourceLocation): cytoscape.NodeSingular | undefined {
        const branchDependency = cDepForLoc(nodeLoc, this.controlDeps);
        if (branchDependency) {
            return this.lastTest[Position.toString(branchDependency.testLoc.start)];
        }
    }

    addTestDependencyRefactor(node: cytoscape.NodeSingular): void {
        const testNode = this.findTestDependency(node.data().loc);
        if (testNode) {
            this.g.addEdge(node, testNode);
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

    getField(iid, base, offset, val, isComputed, isOpAssign, isMethodCall): void {
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
                this.g.addEdge(getFieldNode, putFieldNode);
            }
        }
        this.addId(val);
    }

    conditional(iid: string, result: boolean): void {
        const loc = iidToLoc(iid);
        if (this.handleBreak(loc)) {
            return;
        } else {
            const test = this.tests.find((t) => SourceLocation.locEq(t.loc, loc));
            if (test) {
                console.log("Detected test of type: " + test.type + " at l " + test.loc.start.line);
                const testNode = this.g.addNode(this.g.createTestNode(test, result));
                //currentExprNodes were created for the for/if test
                this.lastTest[Position.toString(test.loc.start)] = testNode;
                //TODO: Only include read nodes?
                this.g.addEdge(testNode, this.currentNode);
                this.g.addEdge(this.currentNode, testNode);
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
        this.currentNode.data({
            loc,
            lloc: loc.toString(),
            line: iidToLoc(iid).start.line,
            type: "expression"
        });
        this.addTestDependencyRefactor(this.currentNode);
        for (const objectId of this.readOnlyObjects) {
            for (const [fieldName, putFieldNode] of Object.entries(this.lastPut[objectId])) {
                this.g.addEdge(this.currentNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        this.readOnlyObjects = [];
        this.currentNode = this.g.addCurrentNode();
    }

    handleSwitch(loc: SourceLocation): boolean {
        const test = this.tests.find((t) => SourceLocation.locEq(t.loc, loc));
        if (test && test.type === "switch-disc") {
            // todo duplicate of conditional
            console.log("Detected switch discriminant: at l " + test.loc.start.line);
            const testNode = this.addNode(this.g.createTestNode(test, "case-disc"));
            //currentExprNodes were created for the for/if test
            this.lastTest[Position.toString(test.loc.start)] = testNode;
            //TODO: Only include read nodes?
            this.g.addEdge(testNode, this.currentNode);
            return true;
        }
        return false;
    }

    handleBreak(wrappingIfPredicateLocation: SourceLocation): boolean {
        const loc = this.bmarkers.filter((bLoc) =>
            SourceLocation.in_between_inclusive(bLoc, wrappingIfPredicateLocation)
        )[0];
        if (loc) {
            const breakNode = this.addNode(this.g.createBreakNode(loc));
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
        writeFileSync(`../graphs/${path.basename(inFilePath)}_graph.json`, JSON.stringify(this.g.graph.json()));
        graphBasedPrune(inFilePath, this.outFile, this.g.graph, this.executedBreakNodes, this.slicingCriterion);
    }

    private addId(val): void {
        if (typeof val !== "object") {
            return;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectId++;
        }
    }

    private addNode(nodeDef: ElementDefinition): cytoscape.NodeSingular {
        return this.g.addNode(nodeDef, this.findTestDependency(nodeDef.data.loc));
    }
}

J$.analysis = new GraphConstructor();
