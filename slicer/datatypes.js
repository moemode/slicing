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
    if (p && p.sourceFile !== null) { this.source = p.sourceFile; }
};

function jalangiLocationToLine(jalangiLocation) {
    let sourceLocation = jalangiLocationToSourceLocation(jalangiLocation);
    return sourceLocation.start.line;
}

function jalangiLocationToSourceLocation(jalangiLocation) {
    let r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/
    let m = jalangiLocation.match(r)
    if (m.length == 6) {
        return new SourceLocation(m[1],
            new Position(parseInt(m[2]), parseInt(m[3]) - 1),
            new Position(parseInt(m[4]), parseInt(m[5]) - 1));
    } else {
        console.log("error in location conversion");
    }
}

function in_between_inclusive(outer, inner) {
    return (outer.start.line <= inner.start.line &&
        outer.start.column <= inner.start.column &&
        inner.end.line <= outer.end.line&&
        inner.end.column <= outer.end.column)
}

module.exports = {
    Position,
    SourceLocation,
    jalangiLocationToSourceLocation,
    jalangiLocationToLine,
    in_between_inclusive
};