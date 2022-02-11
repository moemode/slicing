"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLast = exports.SourceLocation = exports.Position = void 0;
/**
 * Data class  storing positions in a program consisting of line and column number.
 * Contains some static helper methods for comparing Position objects.
 */
var Position = /** @class */ (function () {
    function Position(line, column) {
        this.line = line;
        this.column = column;
        this.line = Number(line);
        this.column = Number(column);
    }
    Position.posEq = function (pos1, pos2) {
        return pos1.line === pos2.line && pos1.column == pos2.column;
    };
    Position.posIsSmallerEq = function (pos1, pos2) {
        return pos1.line < pos2.line || (pos1.line == pos2.line && pos1.column <= pos2.column);
    };
    Position.toString = function (position) {
        return "".concat(position.line, ":").concat(position.column);
    };
    Position.in_between = function (left, inner, right) {
        return Position.posIsSmallerEq(left, inner) && Position.posIsSmallerEq(inner, right);
    };
    return Position;
}());
exports.Position = Position;
/**
 * Data class storing locations in a program consisting of a start and an end Position.
 * Contains some static helper methods for construction and comparison of SourceLocation objects.
 */
var SourceLocation = /** @class */ (function () {
    function SourceLocation(start, end, p) {
        this.start = start;
        this.end = end;
        this.p = p;
    }
    SourceLocation.fromParts = function (startLine, startCol, endLine, endCol, p) {
        return new SourceLocation(new Position(startLine, startCol), new Position(endLine, endCol), p);
    };
    SourceLocation.fromJSON = function (d) {
        return new SourceLocation(d.start, d.end);
    };
    SourceLocation.within_line = function (location, line) {
        return location.start.line == location.end.line && location.end.line == line;
    };
    SourceLocation.boundingLocation = function (locations) {
        var start = locations.map(function (l) { return l.start; }).reduce(function (a, b) { return (Position.posIsSmallerEq(a, b) ? a : b); });
        var end = locations.map(function (l) { return l.end; }).reduce(function (a, b) { return (Position.posIsSmallerEq(a, b) ? b : a); });
        return new SourceLocation(start, end);
    };
    SourceLocation.fromJalangiLocation = function (jalangiLocation) {
        var r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/;
        var m = jalangiLocation.match(r);
        if (m && m.length == 6) {
            return SourceLocation.fromParts(m[2], parseInt(m[3]) - 1, m[4], parseInt(m[5]) - 1, m[1]);
        }
        else {
            console.log("error in location conversion");
            return SourceLocation.fromParts(-1, -1, -1, -1);
        }
    };
    SourceLocation.locEq = function (loc1, loc2) {
        return Position.posEq(loc1.start, loc2.start) && Position.posEq(loc1.end, loc2.end);
    };
    SourceLocation.overlap = function (loc1, loc2) {
        return (Position.in_between(loc1.start, loc2.start, loc1.end) ||
            Position.in_between(loc2.start, loc1.start, loc2.end));
    };
    SourceLocation.in_between_inclusive = function (outer, inner) {
        var includesStart = Position.posIsSmallerEq(outer.start, inner.start);
        var includesEnd = Position.posIsSmallerEq(inner.end, outer.end);
        return includesStart && includesEnd;
    };
    SourceLocation.prototype.toString = function () {
        return "".concat(Position.toString(this.start), ";").concat(Position.toString(this.end));
    };
    return SourceLocation;
}());
exports.SourceLocation = SourceLocation;
/**
 * If exists, remove last occurence of element from arr in place.
 * @param arr an array potentially containing element
 * @param element
 */
function removeLast(arr, element) {
    var i = arr.lastIndexOf(element);
    if (i !== -1) {
        arr.splice(i, 1);
    }
}
exports.removeLast = removeLast;
//# sourceMappingURL=datatypes.js.map