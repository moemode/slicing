import * as fs from "fs";
import { print, parse } from "recast";
import { visit, builders as b, namedTypes as n } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";
import { SourceMapConsumer } from "source-map";
import { Position, SourceLocation } from "./datatypes";
import { PrintResultType } from "recast/lib/printer";

interface Program {
    code: string;
    path: string;
}

/**
 * Walk AST of program.code and replace break-statements with
 * 'if (true) break'. The latter is called a break marker.
 * @param program
 * @returns program with break markers replacing break statements and a SourceMap
 * mapping old locations to new locations. Necessary, because locations change when inserting
 * break markers.
 */
function insertBreakMarkers(program: Program): PrintResultType {
    const ast = parse(program.code, {
        sourceFileName: program.path
    });
    visit(ast, {
        visitBreakStatement(path: NodePath<n.BreakStatement>) {
            const ifTrueBreak = b.ifStatement(b.literal(true), path.node)//b.breakStatement());
            path.replace(ifTrueBreak);
            return false;
        }
    });
    return print(ast, { sourceMapName: "map.json" });
}

/**
 * Typically run after insertBreakMarkers to find the locations
 * @param program program.code, potentially contains break markers
 * @returns all locations of break markers in the program
 */
function locateBreakMarkers(program: Program): SourceLocation[] {
    const ast = parse(program.code, {
        sourceFileName: program.path
    });
    const breakMarkerLocations: SourceLocation[] = [];
    visit(ast, {
        visitIfStatement(path: NodePath<n.IfStatement>) {
            const node = path.node;
            if (node.test.type === "Literal" && node.test.value === true && node.consequent.type === "BreakStatement") {
                breakMarkerLocations.push(new SourceLocation(path.node.loc.start, path.node.loc.end));
            }
            this.traverse(path);
        }
    });
    return breakMarkerLocations;
}

/**
 * Used to find out where the slicing criterion has been mapped to in a transformed program.
 * @param line line number in original program which is located at path source
 * @param source path of original program
 * @param map maps locations in souce program to new locations. These are the locations in the program
 * into which break markers were inserted
 * @returns SourceLocation in new program, which contains what was in line line in source program
 */
function getLineMappedLocation(line: number, source: string, map: SourceMapConsumer): SourceLocation {
    const lineNbGenPos = map.allGeneratedPositionsFor({ source, line });
    if (lineNbGenPos.length > 0) {
        const [first, last] = [lineNbGenPos[0], lineNbGenPos[lineNbGenPos.length - 1]];
        last.column += 1;
        return new SourceLocation(first, last);
    } else {
        return new SourceLocation(new Position(line, 0), new Position(line, Number.POSITIVE_INFINITY));
    }
}

/**
 * Load program from progInPath, insert break-arkers into it and write it to progOutPath.
 * Return new location of lineNb and all break marker locations.
 * @param progInPath path of program
 * @param progOutPath path to write program with inserted break markers to
 * @param lineNb line number in original program at progInPath
 * @returns new location of lineNb and all break marker locations.
 */
function preprocessFile(progInPath: string, progOutPath: string, lineNb: string): [SourceLocation, SourceLocation[]] {
    const code = fs.readFileSync(progInPath).toString();
    const result = insertBreakMarkers({ code, path: progInPath });
    fs.writeFileSync(progOutPath, result.code);
    let criterionLocation = getLineMappedLocation(parseInt(lineNb), progInPath, new SourceMapConsumer(result.map));
    const locs = locateBreakMarkers({ code: result.code, path: progOutPath });
    // if criterion itself was a break statement, extend the location from just the break to enclosing if
    const loc = locs.filter(bLoc => SourceLocation.overlap(bLoc, criterionLocation))[0]; // use overlap because criterionLocation contains comments, bLoc not
    if(loc) {
        criterionLocation = loc;
    }
    return [criterionLocation, locs];
}

export { insertBreakMarkers, preprocessFile };
