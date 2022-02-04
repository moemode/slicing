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
exports.slice = void 0;
var execSync = require("child_process").execSync;
var fs_1 = require("fs");
var path = __importStar(require("path"));
var preprocess_1 = require("./preprocess");
var srcPath = path.resolve(__dirname, '..');
var jalangiPath = srcPath + "/jalangi2/src/js/commands/jalangi.js";
var analysisPath = srcPath + "/analysis/slice_analysis.js";
function slice(inFile, outFile, lineNb) {
    inFile = path.resolve(inFile);
    outFile = path.resolve(outFile);
    var preprocFileName = "preproc_" + path.basename(inFile);
    var preprocPath = path.join(path.dirname(inFile), preprocFileName);
    var _a = (0, preprocess_1.preprocessFile)(inFile, preprocPath, lineNb), slicingCriterion = _a[0], breakMarkerLocations = _a[1];
    var bmarkerPath = path.join(path.dirname(inFile), path.basename(inFile, path.extname(inFile)) + "_bmarkers.json");
    (0, fs_1.writeFileSync)(bmarkerPath, JSON.stringify(breakMarkerLocations));
    // create input parameters from args ditcionary
    var analysisParams = "--initParam outFile:" + outFile;
    analysisParams += " --initParam criterion-start-line:" + slicingCriterion.start.line;
    analysisParams += " --initParam criterion-start-col:" + slicingCriterion.start.column;
    analysisParams += " --initParam criterion-end-line:" + slicingCriterion.end.line;
    analysisParams += " --initParam criterion-end-col:" + slicingCriterion.end.column;
    analysisParams += " --initParam bmarkerPath:" + bmarkerPath;
    var stmt = 'node ' + jalangiPath + " " + analysisParams + ' --inlineIID --inlineSource --analysis ' + analysisPath + " " + preprocPath;
    console.log("Launch Jalangi: " + stmt);
    var child = execSync(stmt);
}
exports.slice = slice;
//# sourceMappingURL=runner.js.map