
// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis.js program.js

(function (jalangi) {
    function WrittenValuesAnalysis() {
        this.writtenValues = []
        this.lastWrites = {}
        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            this.writtenValues.push(val);
            rhs_line = jalangiLocationToLine(J$.iidToLocation(J$.getGlobalIID(iid)))
            this.lastWrites[name] = [val, rhs_line]
        }

        this.endExecution = function () {
            for (let v of this.writtenValues) {
                console.log(v);
            }
            console.log(this.lastWrites)
        }
    }

    jalangi.analysis = new WrittenValuesAnalysis();
}(J$));




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
