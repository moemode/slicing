var cytoscape = require("cytoscape");
var fs = require("fs");
var pruner = require("./parser.js");
var location = require("./datatypes");
// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis.js program.js
(function (jalangi, cytoscape, fs) {
    function SliceAnalysis() {
        this.writtenValues = [];
        this.lastWrites = {};
        this.graph = cytoscape();
        this.fs = fs;
        this.nextNodeId = 1;
        this.nextEdgeId = 1;
        this.outFile = J$.initParams["outFile"];
        // the specified line is 0-based but we use 1-based internally
        this.lineNb = parseInt(J$.initParams["lineNb"]);
        this.linesToKeep = [];
        this.readsForWrite = [];
        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            this.writtenValues.push(val);
            rhs_line = location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)));
            this.lastWrites[name] = [val, rhs_line, this.nextNodeId];
            this.graph.add({
                group: 'nodes', data: { id: "n".concat(this.nextNodeId++),
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    line: rhs_line, name: name, val: val, type: "w" },
            });
        };
        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            var _this = this;
            this.writtenValues.push(val);
            var rhs_line = parseInt(location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid))));
            this.lastWrites[name] = [val, rhs_line, this.nextNodeId];
            readsInLine = "node[type=\"r\"][line=".concat(rhs_line, "]");
            readNodesInLine = this.graph.elements(readsInLine);
            this.graph.add({
                group: 'nodes',
                data: {
                    id: "n".concat(this.nextNodeId),
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    line: rhs_line,
                    name: name,
                    val: val,
                    type: "w"
                },
            });
            newEdges = readNodesInLine.map(function (node) { return ({
                group: 'edges',
                data: {
                    id: "e".concat(_this.nextEdgeId++),
                    source: "n".concat(_this.nextNodeId),
                    target: node.id()
                }
            }); });
            this.graph.add(newEdges);
            this.nextNodeId = this.nextNodeId + 1;
        };
        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            //add edge to last write / declare of variable name
            //assert val is lastWrites val
            var lastNameWrite = this.lastWrites[name];
            if (!lastNameWrite) {
                return;
            }
            var line = location.jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)));
            this.graph.add({
                group: 'nodes', data: {
                    id: "n".concat(this.nextNodeId),
                    loc: location.jalangiLocationToSourceLocation(J$.iidToLocation(J$.getGlobalIID(iid))),
                    line: line, name: name, val: val, type: "r"
                },
            });
            targetNodeId = lastNameWrite[2];
            this.graph.add({
                group: 'edges',
                data: {
                    id: "e".concat(this.nextEdgeId),
                    source: "n".concat(this.nextNodeId),
                    target: "n".concat(targetNodeId)
                },
            });
            this.nextNodeId = this.nextNodeId + 1;
            this.nextEdgeId = this.nextEdgeId + 1;
        };
        this.endExecution = function () {
            //this.fs.writeFileSync("out.png", this.graph.png({output: "base64"}), {'encoding': 'base64'});
            this.fs.writeFileSync("graph.json", JSON.stringify(this.graph.json()));
            pruner.prune(J$.smap[1].originalCodeFileName, this.outFile, this.graph, this.lineNb);
            //this.linesToKeep = lines reachable in this.graph from read nodes in lineNb
            /*
            for (let v of this.writtenValues) {
                console.log(v);
            }
            console.log(this.lastWrites)
            */
        };
    }
    jalangi.analysis = new SliceAnalysis();
}(J$, cytoscape, fs));
