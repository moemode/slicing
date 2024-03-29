import { execSync } from "child_process";
import { writeFileSync } from "fs";
import * as path from "path";
import { preprocessFile } from "./preprocess";

const srcPath = path.resolve(__dirname, "..");
const jalangiPath = path.join(srcPath, "/jalangi2/src/js/commands/jalangi.js");
const analysisPath = path.join(srcPath, "/slicer/graph-constructor.js");

export function slice(inFile: string, outFile: string, lineNb: string): void {
    inFile = path.resolve(inFile);
    outFile = path.resolve(outFile);
    const preprocFileName = "preproc_" + path.basename(inFile);
    const preprocPath = path.join(path.dirname(inFile), preprocFileName);
    const [slicingCriterion, breakMarkerLocations] = preprocessFile(inFile, preprocPath, lineNb);
    const bmarkerPath = path.join(path.dirname(inFile), path.basename(inFile, path.extname(inFile)) + "_bmarkers.json");
    writeFileSync(bmarkerPath, JSON.stringify(breakMarkerLocations));
    // create input parameters from args ditcionary
    let analysisParams = "--initParam outFile:" + Buffer.from(outFile).toString("base64");
    analysisParams += " --initParam criterion-start-line:" + slicingCriterion.start.line;
    analysisParams += " --initParam criterion-start-col:" + slicingCriterion.start.column;
    analysisParams += " --initParam criterion-end-line:" + slicingCriterion.end.line;
    analysisParams += " --initParam criterion-end-col:" + slicingCriterion.end.column;
    analysisParams += " --initParam bmarkerPath:" + Buffer.from(bmarkerPath).toString("base64");
    const stmt =
        "node " +
        jalangiPath +
        " " +
        analysisParams +
        " --inlineIID --inlineSource --analysis " +
        analysisPath +
        " " +
        preprocPath;
    console.log("Launch Jalangi: " + stmt);
    execSync(stmt);
}
