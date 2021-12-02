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

    function slice(inFile, outFile, lineNb){
        /*
        TODO: Implement your method that slices the input based on the specified criteria
        */
        console.log("running slice.js for arguments: "+ inFile, outFile, lineNb);
        console.log("Invoking jalangi");
        run_jalangi_slice(inFile, outFile, lineNb);
    }

    
	function run_jalangi_slice(inFile, outFile, lineNb){
		// create input parameters from args ditcionary
		inputArgs = " --outFile "+outFile+" --lineNb "+lineNb;
		stmt = 'node jalangi2/src/js/commands/jalangi.js --inlineIID --inlineSource' + inputArgs + " --analysis slicer/m1_written_values.js " + inFile;
					
		var exec = require('child_process').exec,
		    child;
		
		child = exec(stmt,
		  function (error, stdout, stderr) {
		    console.log('stdout: ' + stdout); // status message after executing slice.js
		    if (error !== null) {
		      	console.log('exec error: ' + error);		    	
		    	console.log('stderr: ' + stderr);
		    }
		});
	}

    slice(args.inFile, args.outFile, args.lineNb);

})();