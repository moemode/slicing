
// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis.js program.js

(function (jalangi) {
    function WrittenValuesAnalysis() {

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            console.log(val);
        }
    }

    jalangi.analysis = new WrittenValuesAnalysis();
}(J$));
