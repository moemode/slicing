
// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis.js program.js

(function (jalangi) {
    function WrittenValuesAnalysis() {
        this.writtenValues = []
        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            this.writtenValues.push(val);
            //console.log(val)
        }

        this.endExecution = function() {
            for(let v of this.writtenValues) {
                console.log(v);
            }
        }
    }

    jalangi.analysis = new WrittenValuesAnalysis();
}(J$));
