import * as fs from "fs";
import { print, parse } from "recast";
import { visit, builders as b, namedTypes as n } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";
import { SourceMapConsumer } from "source-map";
import { SourceLocation } from "./datatypes";

interface Program {
    code: string,
    path: string
}

function insertBreakMarkers(program: Program) {
    const ast = parse(program.code, {
        "sourceFileName": program.path
    });
    visit(ast, {
        visitBreakStatement(path: NodePath<n.BreakStatement>) {
            const ifTrueBreak = b.ifStatement(b.literal(true), b.breakStatement());
            path.replace(ifTrueBreak);
            //path.insertBefore(b.expressionStatement(b.literal(BREAK_MARKER_NUMBER)));
            return false;
        }
    });
    return print(ast, { sourceMapName: "map.json" });
}

function locateBreakMarkers(program: Program): SourceLocation[] {
    const ast = parse(program.code, {
        "sourceFileName": program.path
    });
    let breakMarkerLocations: SourceLocation[] = [];
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

function preprocessFile(progInPath, progOutPath, lineNb): [number, SourceLocation[]] {
    const code = fs.readFileSync(progInPath).toString();
    const result = insertBreakMarkers({ code, path: progInPath });
    const map = new SourceMapConsumer(result.map);
    const newprog = result.code;
    fs.writeFileSync(progOutPath, newprog);
    const locs = locateBreakMarkers({ code: newprog, path: progOutPath });
    console.log(locs);
    const lineNbGenPos = map.allGeneratedPositionsFor({source: progInPath, line: lineNb});
    if(lineNbGenPos.length > 0) {
        lineNb = lineNbGenPos[0].line;
    }
    return [lineNb,locs];
}

//preprocessFile("/home/v/slicing/testcases/progress_meeting_3/e3_in.js", "./egal.js", 17);

export {
    insertBreakMarkers,
    preprocessFile,
    //findBreakMarkers
};