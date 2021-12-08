const cytoscape = require("cytoscape");
const fs = require("fs");
const pruner = require("./parser.js");
const location = require("./datatypes");


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

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            this.writtenValues.push(val);
            rhs_line = location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)))
            const declareNode = {
                group: 'nodes', data: {
                    id: `n${this.nextNodeId++}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    line: rhs_line, name: name, val: val, type: "w"
                },
            };
            this.lastWrites[name] = declareNode;
            this.graph.add(declareNode);
        }

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            const lhsLocation = location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid)));
            const readsForWrite = this.currentExprNodes.filter(node => location.in_between_inclusive(lhsLocation, node.data.loc));
            //this.writtenValues.push(val);
            const writeNodeId = this.nextNodeId;
            this.nextNodeId = this.nextNodeId + 1;
            const writeNode = {
                group: 'nodes',
                data: {
                    id: `n${writeNodeId}`,
                    loc: lhsLocation,
                    name: name,
                    val: val,
                    line: location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))),
                    type: "w"
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
            /*
            let rhs_line = parseInt(location.jalangiLocationToLine())
            this.lastWrites[name] = [val, rhs_line, this.nextNodeId];
            let readsInLine = `node[type="r"][line=${rhs_line}]`
            let readNodesInLine = this.graph.elements(readsInLine);
            this.graph.add({
                group: 'nodes',
                data: {
                    id: `n${this.nextNodeId}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    line: rhs_line,
                    name: name,
                    val: val,
                    type: "w"
                },
            });
            newEdges = readNodesInLine.map(node => ({
                group: 'edges',
                data: {
                    id: `e${this.nextEdgeId++}`,
                    source: `n${this.nextNodeId}`,
                    target: node.id()
                }
            }));
            this.graph.add(newEdges);
            this.nextNodeId = this.nextNodeId + 1;
            */
        }

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            //add edge to last write / declare of variable name
            //assert val is lastWrites val
            const readNode = {
                group: 'nodes', data: {
                    id: `n${this.nextNodeId}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    name: name, val: val, type: "r",
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
            /*
            if (!lastNameWrite) {
                return;
            }
            let line = location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)));
            this.graph.add({
                group: 'nodes', data: {
                    id: `n${this.nextNodeId}`,
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    line: line, name: name, val: val, type: "r"
                },
            });
            targetNodeId = lastNameWrite[2];
            this.graph.add({
                group: 'edges',
                data: {
                    id: `e${this.nextEdgeId}`,
                    source: `n${this.nextNodeId}`,
                    target: `n${targetNodeId}`
                },
            });
            this.nextNodeId = this.nextNodeId + 1;
            this.nextEdgeId = this.nextEdgeId + 1;
            */

        }

        this.endExecution = function () {
            //this.fs.writeFileSync("out.png", this.graph.png({output: "base64"}), {'encoding': 'base64'});
            fs.writeFileSync("graph.json", JSON.stringify(this.graph.json()));
            pruner.prune(J$.smap[1].originalCodeFileName, this.outFile, this.graph, this.lineNb)
            //this.linesToKeep = lines reachable in this.graph from read nodes in lineNb
            /*
            for (let v of this.writtenValues) {
                console.log(v);
            }
            console.log(this.lastWrites)
            */
        }

        this.endExpression = function () {
            this.currentExprNodes = [];
        }
    }

    jalangi.analysis = new SliceAnalysis();
}(J$));




