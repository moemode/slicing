const { execSync } = require("child_process");
const process = require("process");
const path = require("path");
const preproc = require("../analysis/preprocess");
const fs = require("fs");

(function () {

    const { ArgumentParser } = require("argparse");
    const parser = new ArgumentParser({
        description: "Slices the given file using the specified criteria"
    });
    parser.add_argument(
        "--inFile", { help: "JavaScript file to be sliced", required: true });
    parser.add_argument(
        "--lineNb", { help: "Line number to be used as slicing criteria", required: true });
    parser.add_argument(
        "--outFile", { help: "Sliced and formated output file", required: true });

    const args = parser.parse_args();
    const srcPath = path.resolve(__dirname, '..');
    const jalangiPath = srcPath + "/jalangi2/src/js/commands/jalangi.js";
    const analysisPath = srcPath + "/analysis/slice_analysis.js";

    function slice(inFile, outFile, lineNb) {
        /*
        TODO: Implement your method that slices the input based on the specified criteria
        */
        console.log("running slice.js for arguments: " + inFile, outFile, lineNb);
        console.log("Invoking jalangi");
        run_jalangi_slice(inFile, outFile, lineNb);
    }


    function run_jalangi_slice(inFile, outFile, lineNb) {
        inFile = path.resolve(inFile);
        outFile = path.resolve(outFile);
        const preprocFileName = "preproc_" + path.basename(inFile);
        const preprocPath = path.join(path.dirname(inFile), preprocFileName);
        const [mappedLineNb, breakMarkerLocations] = preproc.preprocessFile(inFile, preprocPath, lineNb);
        const bmarkerPath = path.join(path.dirname(inFile), path.basename(inFile, path.extname(inFile)) + "_bmarkers.json");
        fs.writeFileSync(bmarkerPath, JSON.stringify(breakMarkerLocations));
        // create input parameters from args ditcionary
        let analysisParams = "--initParam outFile:" + outFile;
        analysisParams += " --initParam lineNb:" + mappedLineNb;
        analysisParams += " --initParam bmarkerPath:" + bmarkerPath;
        stmt = 'node ' + jalangiPath + " " + analysisParams + ' --inlineIID --inlineSource --analysis ' + analysisPath + " " + preprocPath;
        console.log("Jalangi call: " + stmt);
        child = execSync(stmt);
        /*
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout); // status message after executing slice.js
        if (error !== null) {
                console.log('exec error: ' + error);		    	
            console.log('stderr: ' + stderr);
        }
        
    }*/
    }

    slice(args.inFile, args.outFile, args.lineNb);

})();