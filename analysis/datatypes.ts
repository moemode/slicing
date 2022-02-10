/**
 * Data class  storing positions in a program consisting of line and column number.
 * Contains some static helper methods for comparing Position objects.
 */
export class Position {
    constructor(public readonly line: number, public readonly column: number) {}

    public static posEq(pos1: Position, pos2: Position): boolean {
        return pos1.line === pos2.line && pos1.column == pos2.column;
    }

    public static posIsSmallerEq(pos1: Position, pos2: Position): boolean {
        return pos1.line < pos2.line || (pos1.line == pos2.line && pos1.column <= pos2.column);
    }

    public static toString(position: Position): string {
        return `${position.line}:${position.column}`;
    }

    public static in_between(left: Position, inner: Position, right: Position): boolean {
        return Position.posIsSmallerEq(left, inner) && Position.posIsSmallerEq(inner, right);
    }
}

/**
 * Data class storing locations in a program consisting of a start and an end Position.
 * Contains some static helper methods for construction and comparison of SourceLocation objects.
 */
export class SourceLocation {
    constructor(public readonly start: Position, public readonly end: Position, public readonly p?: string) {}

    static fromJSON(d: { start: Position; end: Position }): SourceLocation {
        return new SourceLocation(d.start, d.end);
    }

    public static within_line(location: SourceLocation, line: number): boolean {
        return location.start.line == location.end.line && location.end.line == line;
    }

    public static boundingLocation(locations: SourceLocation[]): SourceLocation {
        const start = locations.map((l) => l.start).reduce((a, b) => (Position.posIsSmallerEq(a, b) ? a : b));
        const end = locations.map((l) => l.end).reduce((a, b) => (Position.posIsSmallerEq(a, b) ? b : a));
        return new SourceLocation(start, end);
    }

    public static fromJalangiLocation(jalangiLocation: string): SourceLocation {
        const r = /\((.+):(\d+):(\d+):(\d+):(\d+)\)/;
        const m = jalangiLocation.match(r);
        if (m && m.length == 6) {
            return new SourceLocation(
                new Position(parseInt(m[2]), parseInt(m[3]) - 1),
                new Position(parseInt(m[4]), parseInt(m[5]) - 1),
                m[1]
            );
        } else {
            console.log("error in location conversion");
            return new SourceLocation(new Position(-1, -1), new Position(-1, -1));
        }
    }

    public static locEq(loc1: SourceLocation, loc2: SourceLocation): boolean {
        return Position.posEq(loc1.start, loc2.start) && Position.posEq(loc1.end, loc2.end);
    }

    public static overlap(loc1: SourceLocation, loc2: SourceLocation): boolean {
        return (
            Position.in_between(loc1.start, loc2.start, loc1.end) ||
            Position.in_between(loc2.start, loc1.start, loc2.end)
        );
    }

    public static in_between_inclusive(outer: SourceLocation, inner: SourceLocation): boolean {
        const includesStart = Position.posIsSmallerEq(outer.start, inner.start);
        const includesEnd = Position.posIsSmallerEq(inner.end, outer.end);
        return includesStart && includesEnd;
    }

    public toString(): string {
        return `${Position.toString(this.start)};${Position.toString(this.end)}`;
    }
}
