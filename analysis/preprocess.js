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
function insertBreakMarkers(program) {
    var ast = (0, recast_1.parse)(program.code, {
        "sourceFileName": program.path
    });
    (0, ast_types_1.visit)(ast, {
        visitBreakStatement: function (path) {
            var ifTrueBreak = ast_types_1.builders.ifStatement(ast_types_1.builders.literal(true), ast_types_1.builders.breakStatement());
            path.replace(ifTrueBreak);
            //path.insertBefore(b.expressionStatement(b.literal(BREAK_MARKER_NUMBER)));
            return false;
        }
    });
    return (0, recast_1.print)(ast, { sourceMapName: "map.json" });
}
exports.insertBreakMarkers = insertBreakMarkers;
function locateBreakMarkers(program) {
    var ast = (0, recast_1.parse)(program.code, {
        "sourceFileName": program.path
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
function preprocessFile(progInPath, progOutPath, lineNb) {
    var code = fs.readFileSync(progInPath).toString();
    var result = insertBreakMarkers({ code: code, path: progInPath });
    var map = new source_map_1.SourceMapConsumer(result.map);
    var newprog = result.code;
    fs.writeFileSync(progOutPath, newprog);
    var locs = locateBreakMarkers({ code: newprog, path: progOutPath });
    console.log(locs);
    var lineNbGenPos = map.allGeneratedPositionsFor({ source: progInPath, line: lineNb });
    if (lineNbGenPos.length > 0) {
        lineNb = lineNbGenPos[0].line;
    }
    return [lineNb, locs];
}
exports.preprocessFile = preprocessFile;
//# sourceMappingURL=preprocess.js.map