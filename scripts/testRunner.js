(function() {
	const fs = require('fs');
	const escodegen = require('escodegen');
    const { Parser } = require('acorn');
	var levenshtein = require('fast-levenshtein');
	const { ArgumentParser } = require("argparse");
	const parser = new ArgumentParser({
        description: "Executes the slice.js file on provided arguments.",
    });
    parser.add_argument(
        "--source", { help: "JSON source file containing arguments for slice.js file.", required: true });
   
    const args = parser.parse_args();
	
	function readFile(fileName){
		return fs.readFileSync(fileName, 'utf8');
	}

	function reformatTestCode(codeString){
		const program = Parser.parse(codeString,
            { ecmaVersion: 5, locations: true }
        )
		const program_string = escodegen.generate(program)
		return program_string
	}

	function compare(originalFile, predictedFile){
		expectedSlice  = reformatTestCode(readFile(originalFile));
		predictedSlice = reformatTestCode(readFile(predictedFile));

		if (expectedSlice === predictedSlice){
			console.log("exact match");
		}else{
			console.log(levenshtein.get(expectedSlice,predictedSlice));
			
		}

		
	}

	function read_criteria_file(sourceFile){
		var data = JSON.parse(readFile(sourceFile));
		return data;
	}


	function run_slice(element){
		// create input parameters from args ditcionary
		inputArgs = " --inFile "+element["inFile"]+" --outFile "+element["outFile"]+" --lineNb "+element["lineNb"];
		stmt = 'node slice.js' + inputArgs;
				
		var exec = require('child_process').exec,
		    child;
		
		child = exec(stmt,
		  function (error, stdout, stderr) {
		    console.log('stdout: ' + stdout); // status message after executing slice.js
		    compare(element["goldFile"],element["outFile"]); // compare method to evaluate expected and predicted slice
		    if (error !== null) {
		      	console.log('exec error: ' + error);		    	
		    	console.log('stderr: ' + stderr);
		    }
		});
		
		
	}

	// read input file containing criteria
	const inputs = read_criteria_file(args.source);

	// execute for each individual input
	inputs.forEach(run_slice);
	
})();