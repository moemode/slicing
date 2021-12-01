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