const { execSync } = require("child_process");
const process = require("process");
const path = require("path");
const crypto = require("crypto");
const os = require("os");
const bmarker = require("../break_marker");

(function() {
    
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
    const analysisPath = srcPath + "/slice_analysis.js";

    function slice(inFile, outFile, lineNb){
        /*
        TODO: Implement your method that slices the input based on the specified criteria
        */
        console.log("running slice.js for arguments: "+ inFile, outFile, lineNb);
        console.log("Invoking jalangi");
        run_jalangi_slice(inFile, outFile, lineNb);
    }

    function tmpFile(fname) {
        return path.join(os.tmpdir(), fname);
    }
    
	function run_jalangi_slice(inFile, outFile, lineNb){
		// create input parameters from args ditcionary
        const newBasename = "augmented_" + path.basename(inFile);
        const augmentedInFile = path.join(path.dirname(inFile), newBasename);
        bmarker.insertBreakMarkersFile(inFile, augmentedInFile)
		const inputArgs = " --outFile "+outFile+" --lineNb "+ lineNb;
        const analysisParams = "--initParam outFile:" + outFile + " --initParam lineNb:" + lineNb ;
		const stmt = 'node ' + jalangiPath + " " + analysisParams + ' --inlineIID --inlineSource --analysis ' + analysisPath + " " + augmentedInFile;
        console.log("Jalangi call: " + stmt);
		const child = execSync(stmt);
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