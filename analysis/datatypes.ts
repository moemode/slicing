export class Position {
    constructor(public readonly line: number, public readonly column: number) { }
    public static posEq(pos1: Position, pos2: Position): boolean {
        return pos1.line === pos2.line && pos1.column == pos2.column;
    }
    public static posIsSmallerEq(pos1: Position, pos2: Position): boolean {
        return (pos1.line < pos2.line) || (pos1.line == pos2.line && pos1.column <= pos2.column);
    }
    public static toString(position: Position): string {
        return `line:${position.line};column:${position.column}`
    }
    public static in_between(left, inner, right): boolean {
        return Position.posIsSmallerEq(left, inner) && Position.posIsSmallerEq(inner, right);
    }


}

export class SourceLocation {

    constructor(public readonly start: Position, public readonly end: Position, public readonly p?: string,) { }

    static fromJSON(d: any): SourceLocation {
        return new SourceLocation(d.start, d.end);
    }
    
    public static within_line(location: SourceLocation, line: number) {
        return location.start.line == location.end.line && location.end.line == line;
    }

    public static boundingLocation(locations: SourceLocation[]): SourceLocation {
        const start = locations.map(l => l.start).reduce((a,b) => Position.posIsSmallerEq(a, b) ? a : b);
        const end = locations.map(l=>l.end).reduce((a,b) => Position.posIsSmallerEq(a, b) ? b : a);
        return new SourceLocation(start, end);
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
        return Position.posEq(loc1.start, loc2.start) && Position.posEq(loc1.end, loc2.end);
    }

    public static overlap(loc1: SourceLocation, loc2: SourceLocation): boolean {
        return Position.in_between(loc1.start, loc2.start, loc1.end) || Position.in_between(loc2.start, loc1.start, loc2.end)
    }

    public static in_between_inclusive(outer: SourceLocation, inner: SourceLocation): boolean {
        const includesStart = Position.posIsSmallerEq(outer.start, inner.start);
        const includesEnd = Position.posIsSmallerEq(inner.end, outer.end);
        return includesStart && includesEnd;
    }
}

export class JalangiLocation {
    public static getLine(jalangiLocation): number {
        let sourceLocation = SourceLocation.fromJalangiLocation(jalangiLocation);
        return sourceLocation.start.line;
    }
}


export class CallStackEntry {
    constructor(public readonly callerLoc: Location, public readonly calleeLoc: Location) { }
}

export class BranchDependency {
    constructor(public readonly testLoc: SourceLocation, public readonly branchLoc: SourceLocation, public readonly type: string) {}
}

export class Test {
    constructor(public readonly loc: SourceLocation, public readonly type: string) {}
}
