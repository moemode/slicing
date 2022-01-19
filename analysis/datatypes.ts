class Position {
    constructor(readonly line: number, readonly column: number) { }
    public static posEq(pos1: Position, pos2: Position): boolean {
        return pos1.line === pos2.line && pos1.column == pos2.column;
    }
    public static posIsSmallerEq(pos1: Position, pos2: Position): boolean {
        return (pos1.line < pos2.line) || (pos1.line == pos2.line && pos1.column <= pos2.column);
    }
    public toString(): string {
        return `line:${this.line};column:${this.column}`
    }

}

class SourceLocation {

    constructor(readonly start: Position, readonly end: Position, readonly p?: string,) { }
    
    public static within_line(location: SourceLocation, line: number) {
        return location.start.line == location.end.line && location.end.line == line;
    }

    public static fromJalangiLocation(jalangiLocation: string): SourceLocation {
        let r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/
        let m = jalangiLocation.match(r)
        if (m.length == 6) {
            return new SourceLocation(new Position(parseInt(m[2]), parseInt(m[3]) - 1),
            new Position(parseInt(m[4]), parseInt(m[5]) - 1),
                m[1]);
        } else {
            console.log("error in location conversion");
        }
    }
    public static locEq(loc1: SourceLocation, loc2: SourceLocation): boolean {
        return posEq(loc1.start, loc2.start) && posEq(loc1.end, loc2.end);
    }

    public static in_between_inclusive(outer: SourceLocation, inner: SourceLocation) {
        const includesStart = posIsSmallerEq(outer.start, inner.start);
        const includesEnd = posIsSmallerEq(inner.end, outer.end);
        return includesStart && includesEnd;
    }

}


function jalangiLocationToLine(jalangiLocation) {
    let sourceLocation = jalangiLocationToSourceLocation(jalangiLocation);
    return sourceLocation.start.line;
}

function jalangiLocationToSourceLocation(jalangiLocation: string) {
    let r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/
    let m = jalangiLocation.match(r)
    if (m.length == 6) {
        return new SourceLocation(new Position(parseInt(m[2]), parseInt(m[3]) - 1),
        new Position(parseInt(m[4]), parseInt(m[5]) - 1),
            m[1]);
    } else {
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
    const includesStart = posIsSmallerEq(outer.start, inner.start);
    const includesEnd = posIsSmallerEq(inner.end, outer.end);
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
    return `line:${pos.line};column:${pos.column}`
}

class CallStackEntry {
    constructor(readonly callerLoc: Location, readonly calleeLoc: Location) { }
}

export {
    Position,
    SourceLocation,
    jalangiLocationToSourceLocation,
    jalangiLocationToLine,
    in_between_inclusive,
    posIsSmallerEq as posIsSmaller,
    posEq,
    locEq,
    positionToString,
    CallStackEntry
};