"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = exports.BranchDependency = exports.CallStackEntry = exports.JalangiLocation = exports.SourceLocation = exports.Position = void 0;
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
    Position.toString = function (position) {
        return "line:".concat(position.line, ";column:").concat(position.column);
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
    SourceLocation.fromJSON = function (d) {
        return new SourceLocation(d.start, d.end);
    };
    SourceLocation.within_line = function (location, line) {
        return location.start.line == location.end.line && location.end.line == line;
    };
    SourceLocation.boundingLocation = function (locations) {
        var start = locations.map(function (l) { return l.start; }).reduce(function (a, b) { return Position.posIsSmallerEq(a, b) ? a : b; });
        var end = locations.map(function (l) { return l.end; }).reduce(function (a, b) { return Position.posIsSmallerEq(a, b) ? b : a; });
        return new SourceLocation(start, end);
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
        return Position.posEq(loc1.start, loc2.start) && Position.posEq(loc1.end, loc2.end);
    };
    SourceLocation.in_between_inclusive = function (outer, inner) {
        var includesStart = Position.posIsSmallerEq(outer.start, inner.start);
        var includesEnd = Position.posIsSmallerEq(inner.end, outer.end);
        return includesStart && includesEnd;
    };
    return SourceLocation;
}());
exports.SourceLocation = SourceLocation;
var JalangiLocation = /** @class */ (function () {
    function JalangiLocation() {
    }
    JalangiLocation.getLine = function (jalangiLocation) {
        var sourceLocation = SourceLocation.fromJalangiLocation(jalangiLocation);
        return sourceLocation.start.line;
    };
    return JalangiLocation;
}());
exports.JalangiLocation = JalangiLocation;
var CallStackEntry = /** @class */ (function () {
    function CallStackEntry(callerLoc, calleeLoc) {
        this.callerLoc = callerLoc;
        this.calleeLoc = calleeLoc;
    }
    return CallStackEntry;
}());
exports.CallStackEntry = CallStackEntry;
var BranchDependency = /** @class */ (function () {
    function BranchDependency(testLoc, branchLoc, type) {
        this.testLoc = testLoc;
        this.branchLoc = branchLoc;
        this.type = type;
    }
    return BranchDependency;
}());
exports.BranchDependency = BranchDependency;
var Test = /** @class */ (function () {
    function Test(loc, type) {
        this.loc = loc;
        this.type = type;
    }
    return Test;
}());
exports.Test = Test;
//# sourceMappingURL=datatypes.js.map