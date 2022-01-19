var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
};
Position.prototype.offset = function offset(n) {
    return new Position(this.line, this.column + n);
};
var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p && p.sourceFile !== null) {
        this.source = p.sourceFile;
    }
};
function jalangiLocationToLine(jalangiLocation) {
    var sourceLocation = jalangiLocationToSourceLocation(jalangiLocation);
    return sourceLocation.start.line;
}
function jalangiLocationToSourceLocation(jalangiLocation) {
    var r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/;
    var m = jalangiLocation.match(r);
    if (m.length == 6) {
        return new SourceLocation(m[1], new Position(parseInt(m[2]), parseInt(m[3]) - 1), new Position(parseInt(m[4]), parseInt(m[5]) - 1));
    }
    else {
        console.log("error in location conversion");
    }
}
function in_between_inclusive(outer, inner) {
    /*
    return (outer.start.line <= inner.start.line &&
        outer.start.column <= inner.start.column &&
        inner.end.line <= outer.end.line &&
        inner.end.column <= outer.end.column)
    */
    var includesStart = posIsSmallerEq(outer.start, inner.start);
    var includesEnd = posIsSmallerEq(inner.end, outer.end);
    return includesStart && includesEnd;
}
function posEq(pos1, pos2) {
    return pos1.line === pos2.line && pos1.column == pos2.column;
}
function locEq(loc1, loc2) {
    return posEq(loc1.start, loc2.start) && posEq(loc1.end, loc2.end);
}
function posIsSmallerEq(pos1, pos2) {
    return (pos1.line < pos2.line) || (pos1.line == pos2.line && pos1.column <= pos2.column);
}
function positionToString(pos) {
    return "line:".concat(pos.line, ";column:").concat(pos.column);
}
var CallStackEntry = /** @class */ (function () {
    function CallStackEntry(callerLoc, calleeLoc) {
        this.callerLoc = callerLoc;
        this.calleeLoc = calleeLoc;
    }
    return CallStackEntry;
}());
module.exports = {
    Position: Position,
    SourceLocation: SourceLocation,
    jalangiLocationToSourceLocation: jalangiLocationToSourceLocation,
    jalangiLocationToLine: jalangiLocationToLine,
    in_between_inclusive: in_between_inclusive,
    posIsSmaller: posIsSmallerEq,
    posEq: posEq,
    locEq: locEq,
    positionToString: positionToString,
    CallStackEntry: CallStackEntry
};
