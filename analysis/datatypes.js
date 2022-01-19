"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallStackEntry = exports.positionToString = exports.locEq = exports.posEq = exports.posIsSmaller = exports.in_between_inclusive = exports.jalangiLocationToLine = exports.jalangiLocationToSourceLocation = exports.SourceLocation = exports.Position = void 0;
var Position = /** @class */ (function () {
    function Position(line, column) {
        this.line = line;
        this.column = column;
    }
    Position.posEq = function (pos1, pos2) {
        return pos1.line === pos2.line && pos1.column == pos2.column;
    };
    Position.posIsSmallerEq = function (pos1, pos2) {
        return (pos1.line < pos2.line) || (pos1.line == pos2.line && pos1.column <= pos2.column);
    };
    Position.prototype.toString = function () {
        return "line:".concat(this.line, ";column:").concat(this.column);
    };
    return Position;
}());
exports.Position = Position;
var SourceLocation = /** @class */ (function () {
    function SourceLocation(start, end, p) {
        this.start = start;
        this.end = end;
        this.p = p;
    }
    SourceLocation.within_line = function (location, line) {
        return location.start.line == location.end.line && location.end.line == line;
    };
    SourceLocation.fromJalangiLocation = function (jalangiLocation) {
        var r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/;
        var m = jalangiLocation.match(r);
        if (m.length == 6) {
            return new SourceLocation(new Position(parseInt(m[2]), parseInt(m[3]) - 1), new Position(parseInt(m[4]), parseInt(m[5]) - 1), m[1]);
        }
        else {
            console.log("error in location conversion");
        }
    };
    SourceLocation.locEq = function (loc1, loc2) {
        return posEq(loc1.start, loc2.start) && posEq(loc1.end, loc2.end);
    };
    SourceLocation.in_between_inclusive = function (outer, inner) {
        var includesStart = posIsSmallerEq(outer.start, inner.start);
        var includesEnd = posIsSmallerEq(inner.end, outer.end);
        return includesStart && includesEnd;
    };
    return SourceLocation;
}());
exports.SourceLocation = SourceLocation;
function jalangiLocationToLine(jalangiLocation) {
    var sourceLocation = jalangiLocationToSourceLocation(jalangiLocation);
    return sourceLocation.start.line;
}
exports.jalangiLocationToLine = jalangiLocationToLine;
function jalangiLocationToSourceLocation(jalangiLocation) {
    var r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/;
    var m = jalangiLocation.match(r);
    if (m.length == 6) {
        return new SourceLocation(new Position(parseInt(m[2]), parseInt(m[3]) - 1), new Position(parseInt(m[4]), parseInt(m[5]) - 1), m[1]);
    }
    else {
        console.log("error in location conversion");
    }
}
exports.jalangiLocationToSourceLocation = jalangiLocationToSourceLocation;
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
exports.in_between_inclusive = in_between_inclusive;
function posEq(pos1, pos2) {
    return pos1.line === pos2.line && pos1.column == pos2.column;
}
exports.posEq = posEq;
function locEq(loc1, loc2) {
    return posEq(loc1.start, loc2.start) && posEq(loc1.end, loc2.end);
}
exports.locEq = locEq;
function posIsSmallerEq(pos1, pos2) {
    return (pos1.line < pos2.line) || (pos1.line == pos2.line && pos1.column <= pos2.column);
}
exports.posIsSmaller = posIsSmallerEq;
function positionToString(pos) {
    return "line:".concat(pos.line, ";column:").concat(pos.column);
}
exports.positionToString = positionToString;
var CallStackEntry = /** @class */ (function () {
    function CallStackEntry(callerLoc, calleeLoc) {
        this.callerLoc = callerLoc;
        this.calleeLoc = calleeLoc;
    }
    return CallStackEntry;
}());
exports.CallStackEntry = CallStackEntry;
//# sourceMappingURL=datatypes.js.map