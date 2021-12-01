// Run the analysis with:
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis exampleAnalysis2.js program.js

(function (jalangi) {
    var iidToLocation = jalangi.iidToLocation;

    function ExampleAnalysis() {
        this.unary = function (iid, op, left, result) {
            var location = iidToLocation(jalangi.sid, iid);
            console.log(iid);
            console.log("unary operation " + op + " on " + left + " yields " + result + " at " + location);
        };
    }

    jalangi.analysis = new ExampleAnalysis();
}(J$));