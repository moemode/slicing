import cytoscape = require("cytoscape");
import { Collection, ElementDefinition } from "cytoscape";
import { Position, SourceLocation, Identifiable, removeLast } from "./datatypes";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { graphBasedPrune } from "./pruner";
import { ControlDependency, Test, controlDependencies, cDepForLoc } from "./control-deps";
import * as path from "path";
import { GraphHelper } from "./graph-helper";

declare let J$: any;

function iidToLoc(iid: string): SourceLocation {
    return SourceLocation.fromJalangiLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
}

/**
 * Builds, expression by expression, a graph of data- and control-dependencies.
 * this.currentNode captures dependencies of the current expression on former
 * currentNode(s) and on helper nodes for declare-, break- and test-nodes.
 * In contrast to these the currentNode is carried through the whole expression.
 */
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
    criterionOnce = false; // code within slicingCriterion has been executed once during analysis
    /** Current Expression  State */
    readOnlyObjects: number[]; //ids of read objects which are not (yet) the base for subsequent getField/putField
    currentNode: cytoscape.NodeSingular;

    /**
     * Load and compute static program information.
     * Initialize current expression state of readOnlyObjects + currentNode
     * @param _iid static, unique instruction identifier
     * @param _instrumentedFileName
     * @param originalFilePath path of preprocessed file
     */
    scriptEnter(_iid: string, _instrumentedFileName: string, originalFilePath: string): void {
        this.bmarkers = JSON.parse(readFileSync(this.bmarkerPath).toString()).map((obj) =>
            SourceLocation.fromJSON(obj)
        );
        [this.controlDeps, this.tests] = controlDependencies(originalFilePath);
        this.executedBreakNodes = this.g.graph.collection();
        this.readOnlyObjects = [];
        this.currentNode = this.g.addCurrentNode();
    }

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
    declare(iid: string, name: string, val: unknown, _isArgument, _argumentIndex, _isCatchParam): void {
        const declareNode = this.addNode(this.g.createDeclareNode(iidToLoc(iid), name, val));
        this.lastDeclare[name] = declareNode;
    }

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
    literal(iid: string, val: unknown, _hasGetterSetter): { result: unknown } | undefined {
        if (typeof val === "object") {
            this.makeIdentifiable(val);
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
     * @node-deps: declaration node for variable name
     * @changes-state: lastWrite
     * @param _iid
     * @param name variable name
     * @param _val
     */
    write(_iid: string, name: string, _val: unknown): void {
        this.g.addEdgeIfBothExist(this.currentNode, this.lastDeclare[name]);
        this.lastWrite[name] = this.currentNode;
    }

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
    read(_iid: string, name: string, val: unknown, _isGlobal: boolean, _isScriptLocal: boolean): void {
        //add edges to declare- & last write-node for variable
        this.g.addEdgeIfBothExist(this.currentNode, this.lastDeclare[name]);
        this.g.addEdgeIfBothExist(this.currentNode, this.lastWrite[name]);
        if (this.makeIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
    }

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
    putField(
        _iid: string,
        base: Record<string, unknown>,
        offset: string,
        val: unknown,
        _isComputed,
        _isOpAssign
    ): void {
        this.makeIdentifiable(val);
        removeLast(this.readOnlyObjects, base.__id__);
        //this always succeeds because typoef base === "object"
        if (this.makeIdentifiable(base)) {
            if (this.lastPut[base.__id__] === undefined) {
                this.lastPut[base.__id__] = {};
            }
            this.lastPut[base.__id__][offset] = this.currentNode;
        }
    }

    /**
     * Handle get of base[offset]
     * @node-deps putField-node at this.lastPut[base.__id__][offset] if exists
     * @changes-state readOnlyObjects
     */
    getField(
        _iid: string,
        base: Record<string, unknown>,
        offset: string,
        val: unknown,
        _isComputed: boolean,
        _isOpAssign: boolean,
        _isMethodCall: boolean
    ): void {
        removeLast(this.readOnlyObjects, base.__id__);
        if (this.makeIdentifiable(val)) {
            this.readOnlyObjects.push(val.__id__);
        }
        if (this.makeIdentifiable(base)) {
            const baseObjectPuts = this.lastPut[base.__id__];
            // there might not have been any puts
            if (baseObjectPuts !== undefined) {
                const putFieldNode = this.lastPut[base.__id__][offset];
                // there might not have been a put for offset
                if (putFieldNode) {
                    this.g.addEdge(this.currentNode, putFieldNode);
                }
            }
        }
    }

    /**
     * Handle a condition check before branching.
     * Branching can happen in various statements including if-then-else, switch-case, while, for, ||, &&, ?:.
     * @param iid static, unique instruction identifier
     * @param result true iff branch is taken
     * @returns
     */
    conditional(iid: string, result: boolean): void {
        const loc = iidToLoc(iid);
        // break markers are of form if(true) break; -> detect them in conditional
        if (this.handleBreak(loc)) {
            return;
        } else {
            const test = this.tests.find((t) => SourceLocation.locEq(t.loc, loc));
            const testNode = this.addNode(this.g.createTestNode(loc, result, test?.type));
            //currentExprNodes were created for the for/if test
            this.lastTest[Position.toString(test.loc.start)] = testNode;
            this.g.addEdge(testNode, this.currentNode);
            //this.g.addEdge(this.currentNode, testNode);
        }
    }

    /**
     * On entering the function there is a read of the function name
     * Get a new currentNode for the first line in the function body.
     * @param iid static, unique instruction identifier
     */
    functionEnter(iid: string): void {
        this.endExpression(iid);
    }

    /**
     * @node-deps test-node the expression depends on if exists,
     * all put-nodes for all objects in readOnlyObjects
     * @changes-state reset readOnlyObject, currentNode
     * @param iid
     */
    endExpression(iid: string): void {
        this.handleSwitch(iid); // handle if its a switch-discriminator
        /**
         * update currentNode which represents the current expression which has no finished
         * only here we learn its location and use it to find control deps
         */
        const loc = iidToLoc(iid);
        this.currentNode.data({
            loc,
            lloc: loc.toString(),
            line: loc.start.line,
            name: `${loc.start.line}: exp`
        });
        this.addControlDependencies(this.currentNode);
        if (SourceLocation.in_between_inclusive(this.slicingCriterion, loc)) {
            this.criterionOnce = true;
        }
        // currentNode depends on  all put-nodes for all objects in readOnlyObjects
        for (const objectId of this.readOnlyObjects) {
            for (const [fieldName, putFieldNode] of Object.entries(this.lastPut[objectId])) {
                this.g.addEdge(this.currentNode, putFieldNode);
            }
            this.lastPut[objectId];
        }
        // reset current expression state
        this.readOnlyObjects = [];
        this.currentNode = this.g.addCurrentNode();
    }

    /**
     * @node-deps test-node representing switch discriminant depends on currentNode
     * @changes-state lastTest
     * @param iid static, unique instruction identifier
     * @returns
     */
    handleSwitch(iid: string): boolean {
        const loc = iidToLoc(iid);
        const test = this.tests.find((t) => SourceLocation.locEq(t.loc, loc));
        if (test && test.type === "switch-disc") {
            const testNode = this.addNode(this.g.createTestNode(test.loc, true, "switch-disc"));
            this.lastTest[Position.toString(test.loc.start)] = testNode;
            // the switch-discriminant depends on the reads, writes currentNode depends on
            this.g.addEdge(testNode, this.currentNode);
            return true;
        }
        return false;
    }

    /**
     * Check if a break marker is being executed, if so record that
     * @depends nothing
     * @changes-state executedBreakNodes
     * @param wrappingIfPredicateLocation location of a normal if or the break marker i.e. "if(true) break; ""
     * @returns true iff a break marker is present
     */
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

    /**
     * Write the constructed graph into a .json file.
     * Invoke the pruning phase and pass the graph,
     * and the source-mapped slicing criterion to the pruning stage.
     */
    endExecution(): void {
        if (this.criterionOnce) {
            const node = this.g.addNode(this.g.createNode({ loc: this.slicingCriterion }));
            this.executedBreakNodes.nodes().forEach((bNode) => this.g.addEdge(node, bNode));
        }
        const inFilePath = J$.smap[1].originalCodeFileName;
        try {
            mkdirSync(`./graphs`);
        } catch (e) {
            //this error is expected as it is thrown when the graphs directory esists already
        }
        try {
            writeFileSync(`./graphs/${path.basename(inFilePath)}_graph.json`, JSON.stringify(this.g.graph.json()));
        } catch (e) {
            // not expected but don't crash
        }
        graphBasedPrune(inFilePath, this.outFile, this.g.graph, this.slicingCriterion);
    }

    /**
     * Augment val by unique number __id__ field for object tracking
     * @param val thing to be made identifiable, impossible for primitive types
     * @returns true iff typeof(val) === object
     */
    private makeIdentifiable(val: unknown): val is Identifiable {
        if (typeof val !== "object") {
            return false;
        }
        const valObj = val as Identifiable;
        if (valObj.__id__ === undefined) {
            valObj.__id__ = this.nextObjectId++;
        }
        return true;
    }

    /**
     * Given nodeLoc find most recent test-node for the test it depends on.
     * @param nodeLoc location of node
     * @returns test-node, on which node depends immediately (by control-dependency) if such exists
     */
    private findTestDependency(nodeLoc: SourceLocation): cytoscape.NodeSingular | undefined {
        const branchDependency = cDepForLoc(nodeLoc, this.controlDeps);
        if (branchDependency) {
            return this.lastTest[Position.toString(branchDependency.testLoc.start)];
        }
    }

    /**
     * Add node acc. to nodeDef to graph, and create edge to test-node
     * iff node is control-dependent on some test.
     * @param nodeDef description of node to add
     * @returns 'living' node in graph
     */
    private addNode(nodeDef: ElementDefinition): cytoscape.NodeSingular {
        const node = this.g.addNode(nodeDef, this.findTestDependency(nodeDef.data.loc));
        if (SourceLocation.in_between_inclusive(this.slicingCriterion, node.data().loc)) {
            this.criterionOnce = true;
        }
        return node;
    }

    /**
     * Add control-dependencies of node to graph
     * @param node node in graph
     * @returns true iff node is control-dependent on a test and has been connected
     * to most recent test-node of that test.
     */
    private addControlDependencies(node: cytoscape.NodeSingular): boolean {
        const testNode = this.findTestDependency(node.data().loc);
        return this.g.addEdgeIfBothExist(node, testNode) || this.executedBreakNodes.size() != 0;
    }
}

J$.analysis = new GraphConstructor();
