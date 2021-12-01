// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis.js program.js

(function (jalangi) {
    function ExampleAnalysis() {
        this.unary = function (iid, op, left, result) {
            console.log("unary operation " + op + " on " + left + " yields " + result);
        };
    }

    jalangi.analysis = new ExampleAnalysis();
}(J$));

/**
 * An analysis can access the source map, which maps instruction identifiers to source locations, using the global object stored in J$.smap. Jalangi 2 assigns a unique id, called sid, to each JavaScript script loaded at runtime. J$.smap maps each sid to an object, say iids, containing source map information for the script whose id is sid. iids has the following properties: "originalCodeFileName" (stores the path of the original script file), "instrumentedCodeFileName" (stores the path of the instrumented script file), "url" (is optional and stores the URL of the script if it is set during instrumentation using the --url option), "evalSid" (stores the sid of the script in which the eval is called in case the current script comes from an eval function call), "evalIid" (iid of the eval function call in case the current script comes from an eval function call), "nBranches" (the number of conditional statements in the script), and "code" (a string denoting the original script code if the code is instrumented with the --inlineSource option). iids also maps each iid (which stands for instruction id, an unique id assigned to each callback function inserted by Jalangi2) to an array containing [beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber]. The mapping from iids to arrays is only available if the code is instrumented with the --inlineIID option. 
 */