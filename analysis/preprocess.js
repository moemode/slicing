"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessFile = exports.insertBreakMarkers = void 0;
var fs = __importStar(require("fs"));
var recast_1 = require("recast");
var ast_types_1 = require("ast-types");
var source_map_1 = require("source-map");
var datatypes_1 = require("./datatypes");
/**
 * Walk AST of program.code and replace break-statements with
 * 'if (true) break'. The latter is called a break marker.
 * @param program
 * @returns program with break markers replacing break statements and a SourceMap
 * mapping old locations to new locations. Necessary, because locations change when inserting
 * break markers.
 */
function insertBreakMarkers(program) {
    var ast = (0, recast_1.parse)(program.code, {
        sourceFileName: program.path
    });
    (0, ast_types_1.visit)(ast, {
        visitBreakStatement: function (path) {
            var ifTrueBreak = ast_types_1.builders.ifStatement(ast_types_1.builders.literal(true), ast_types_1.builders.breakStatement());
            path.replace(ifTrueBreak);
            return false;
        }
    });
    return (0, recast_1.print)(ast, { sourceMapName: "map.json" });
}
exports.insertBreakMarkers = insertBreakMarkers;
/**
 * Typically run after insertBreakMarkers to find the locations
 * @param program program.code, potentially contains break markers
 * @returns all locations of break markers in the program
 */
function locateBreakMarkers(program) {
    var ast = (0, recast_1.parse)(program.code, {
        sourceFileName: program.path
    });
    var breakMarkerLocations = [];
    (0, ast_types_1.visit)(ast, {
        visitIfStatement: function (path) {
            var node = path.node;
            if (node.test.type === "Literal" && node.test.value === true && node.consequent.type === "BreakStatement") {
                breakMarkerLocations.push(new datatypes_1.SourceLocation(path.node.loc.start, path.node.loc.end));
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
function getLineMappedLocation(line, source, map) {
    var lineNbGenPos = map.allGeneratedPositionsFor({ source: source, line: line });
    if (lineNbGenPos.length > 0) {
        var _a = [lineNbGenPos[0], lineNbGenPos[lineNbGenPos.length - 1]], first = _a[0], last = _a[1];
        last.column += 1;
        return new datatypes_1.SourceLocation(first, last);
    }
    else {
        return new datatypes_1.SourceLocation(new datatypes_1.Position(line, 0), new datatypes_1.Position(line, Number.POSITIVE_INFINITY));
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
function preprocessFile(progInPath, progOutPath, lineNb) {
    var code = fs.readFileSync(progInPath).toString();
    var result = insertBreakMarkers({ code: code, path: progInPath });
    fs.writeFileSync(progOutPath, result.code);
    var criterionLocation = getLineMappedLocation(parseInt(lineNb), progInPath, new source_map_1.SourceMapConsumer(result.map));
    var locs = locateBreakMarkers({ code: result.code, path: progOutPath });
    return [criterionLocation, locs];
}
exports.preprocessFile = preprocessFile;
//# sourceMappingURL=preprocess.js.map