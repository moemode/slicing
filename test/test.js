const fs = require('fs');
var levenshtein = require('fast-levenshtein');
const { ArgumentParser } = require("argparse");
const assert = require('assert');
const parser = new ArgumentParser({
    description: "Executes the slice.js file on provided arguments.",
});
parser.add_argument(
    "--source", { help: "JSON source file containing arguments for slice.js file.", required: true });


function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function compare(originalFile, predictedFile) {
    expectedSlice = readFile(originalFile);
    predictedSlice = readFile(predictedFile);
    const dist = levenshtein.get(expectedSlice, predictedSlice);
    if (expectedSlice === predictedSlice) {
        console.log("exact match");
    } else {
        console.log(levenshtein.get(expectedSlice, predictedSlice));
    }
    return dist;
}

function read_criteria_file(sourceFile) {
    var data = JSON.parse(readFile(sourceFile));
    return data;
}


function run_slice(element) {
    // create input parameters from args ditcionary
    inputArgs = " --inFile " + element["inFile"] + " --outFile " + element["outFile"] + " --lineNb " + element["lineNb"];
    stmt = 'node ./scripts/slice.js' + inputArgs;

    var exec = require('child_process').execSync;
    child = exec(stmt,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout); // status message after executing slice.js

            if (error !== null) {
                console.log('exec error: ' + error);
                console.log('stderr: ' + stderr);
            }
        });
    const dist = compare(element["goldFile"], element["outFile"]); // compare method to evaluate expected and predicted slice
    return dist;
}

// read input file containing criteria
const inputs = read_criteria_file("./test/alltests.json");
// execute for each individual input
inputs.forEach(function (element) {
    describe("Slice " + element.inFile + " on line: " + element.lineNb, function () {
        this.timeout(5000);
        it("Levenshtein Distance Comparison", function() {
            const dist = run_slice(element);
            assert.equal(dist, element.expectedDist);
        })
    });
});