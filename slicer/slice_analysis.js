const cytoscape = require("cytoscape");
const fs = require("fs");
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
        this.outFile = J$.initParams["outFile"]
        this.lineNb = J$.initParams["lineNb"]
        
        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            this.writtenValues.push(val);
            rhs_line = jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)))
            this.lastWrites[name] = [val, rhs_line, this.nextNodeId];
            this.graph.add({
                group: 'nodes', data: { id: `n${this.nextNodeId++}`, line: rhs_line, name: name, val: val, type:"w" },
            });
        }

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            this.writtenValues.push(val);
            let rhs_line = jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)))
            this.lastWrites[name] = [val, rhs_line, this.nextNodeId];
            this.graph.add({
                group: 'nodes', data: { id: `n${this.nextNodeId++}`, line: rhs_line, name: name, val: val, type:"w" },
            });
        }

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            //add edge to last write / declare of variable name
            //assert val is lastWrites val
            let lastNameWrite = this.lastWrites[name];
            if (!lastNameWrite) {
                return;
            }
            let line = jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)));
            this.graph.add({
                group: 'nodes', data: { id: `n${this.nextNodeId}`, line:line, name: name, val: val, type:"r" },
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

        }

        this.endExecution = function () {
            //this.fs.writeFileSync("out.png", this.graph.png({output: "base64"}), {'encoding': 'base64'});
            this.fs.writeFileSync("graph.json", JSON.stringify(this.graph.json()));
            for (let v of this.writtenValues) {
                console.log(v);
            }
            console.log(this.lastWrites)
        }
    }

    jalangi.analysis = new SliceAnalysis();
}(J$, cytoscape, fs));




var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
};

Position.prototype.offset = function offset(n) {
    return new Position(this.line, this.column + n)
};

var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p.sourceFile !== null) { this.source = p.sourceFile; }
};


function jalangiLocationToLine(jalangiLocation) {
    let sourceLocation = jalangiLocationToPosition(jalangiLocation);
    return sourceLocation.start.line;
}

function jalangiLocationToPosition(jalangiLocation) {
    let r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/
    let m = jalangiLocation.match(r)
    if (m.length == 6) {
        return new SourceLocation(m[1],
            new Position(m[2], m[3]),
            new Position(m[4], m[5]))
    } else {
        console.log("error in location conversion");
    }
}
