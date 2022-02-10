import cytoscape = require("cytoscape");
import { Collection, ElementDefinition } from "cytoscape";
import { Position, SourceLocation, isIdentifiable, isIdentifiableObject, Identifiable } from "./datatypes";
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
    slicingCriterion: SourceLocation = SourceLocation.fromParts(
        J$.initParams["criterion-start-line"],
        J$.initParams["criterion-start-col"],
        J$.initParams["criterion-end-line"],
        J$.initParams["criterion-end-col"]
    );

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
    readOnlyObjects: string[]; //ids of read objects which are not (yet) the base for subsequent getField/putField
    currentNode: cytoscape.NodeSingular;

    /**
     * Load and compute static program information.
     * Initialize current expression state of readOnlyObjects + currentNode
     * @param _iid static, unique instruction identifier
     * @param _instrumentedFileName 
     * @param originalFilePath path of preprocessed file
     */
    scriptEnter(_iid: string, _instrumentedFileName: string, originalFilePath: string): void {
        this.bmarkers = JSON.parse(readFileSync(this.bmarkerPath).toString()).map((obj) => SourceLocation.fromJSON(obj));
        [this.controlDeps, this.tests] = controlDependencies(originalFilePath);
        this.executedBreakNodes = this.g.graph.collection();
        this.readOnlyObjects = []; 
        this.currentNode = this.g.addCurrentNode();
    }

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
    declare(iid: string, name: string, val: unknown, _isArgument, _argumentIndex, _isCatchParam): void {
        const declareNode = this.addNode(this.g.createDeclareNode(iidToLoc(iid), name, val));
        // State changes
        this.lastDeclare[name] = declareNode;
    }

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
    literal(iid: string, val: unknown, _hasGetterSetter): { result: unknown } | undefined {
        if (typeof val === "object") {
            this.isIdentifiable(val);
            for (const [propertyName, propertyValue] of Object.entries(val)) {
                if (propertyName != "__id__") {
                    this.putField(iid, val, propertyName, propertyValue, undefined, undefined);
                }
            }
            return { result: val };
        }
    }

    /**
     * Handle write of value into variable called name.
     * Dependencies: declaration node for variable name
     * State Changes: lastWrite
     * @param _iid
     * @param name variable name
     * @param _val 
     */
    write(_iid: string, name: string, _val: unknown): void {
        this.g.addEdgeIfBothExist(this.currentNode, this.lastDeclare[name])
        this.lastWrite[name] = this.currentNode;
    }

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
    read(_iid: string, name: string, val: unknown, _isGlobal: boolean, _isScriptLocal: boolean): void {
        //add edges to declare- & last write-node for variable
        this.g.addEdgeIfBothExist(this.currentNode, this.lastDeclare[name]);
        this.g.addEdgeIfBothExist(this.currentNode, this.lastWrite[name])
        if (this.isIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
    }

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
    putField(_iid: string, base: Record<string, unknown>, offset: string, val: unknown, _isComputed, _isOpAssign): void {
        this.isIdentifiable(val);
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter((objectId) => objectId != base.__id__);
        //this always succeeds because typoef base === "object"
        if(this.isIdentifiable(base)) {
            if (this.lastPut[base.__id__] === undefined) {
                this.lastPut[base.__id__] = {};
            }
            this.lastPut[base.__id__][offset] = this.currentNode;
        }
    }

    getField(_iid: string, base: Record<string, unknown>, offset: string, val: unknown, _isComputed: boolean, _isOpAssign: boolean, _isMethodCall: boolean): void {
        // TOdo: BUG only remove last one
        this.readOnlyObjects = this.readOnlyObjects.filter((objectId) => objectId != base.__id__);
        //Todo: This does not work for string objects
        const getFieldNode = this.currentNode;
        if (this.isIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
        if(this.isIdentifiable(base)) {
            //no retrievalNode if val is of primitive type not an object
            const baseObjectPuts = this.lastPut[base.__id__];
            if (baseObjectPuts !== undefined) {
                const putFieldNode = this.lastPut[base.__id__][offset];
                if (putFieldNode) {
                    this.g.addEdge(getFieldNode, putFieldNode);
                }
            }
        }
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
        this.addTestDependency(this.currentNode);
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

    private isIdentifiable(val): val is Identifiable {
        if (typeof val !== "object") {
            return false;
        }
        if (val.__id__ === undefined) {
            val.__id__ = this.nextObjectId++;
        }
        return true;
    }

    private findTestDependency(nodeLoc: SourceLocation): cytoscape.NodeSingular | undefined {
        const branchDependency = cDepForLoc(nodeLoc, this.controlDeps);
        if (branchDependency) {
            return this.lastTest[Position.toString(branchDependency.testLoc.start)];
        }
    }
    
    private addNode(nodeDef: ElementDefinition): cytoscape.NodeSingular {
        return this.g.addNode(nodeDef, this.findTestDependency(nodeDef.data.loc));
    }

    private addTestDependency(node: cytoscape.NodeSingular): void {
        const testNode = this.findTestDependency(node.data().loc);
        this.g.addEdgeIfBothExist(node, testNode);
    }
}

J$.analysis = new GraphConstructor();
