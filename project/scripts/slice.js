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
        console.log("Slice method not yet implemented");
        
    }

    slice(args.inFile, args.outFile, args.lineNb);

})();