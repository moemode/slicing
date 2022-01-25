const fs = require('fs');
const levenshtein = require('fast-levenshtein');
const { ArgumentParser } = require("argparse");
const assert = require('assert');
const escodegen = require('escodegen');
const { Parser } = require('acorn');
const { execSync } = require('child_process');
const parser = new ArgumentParser({
    description: "Executes the slice.js file on provided arguments.",
});
parser.add_argument(
    "--source", { help: "JSON source file containing arguments for slice.js file.", required: true });


function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function compare_old(originalFile, predictedFile, ignoreSpaces) {
    expectedSlice = readFile(originalFile);
    predictedSlice = readFile(predictedFile);
    if (ignoreSpaces) {
        expectedSlice = expectedSlice.replace(/\s/g, "");
        predictedSlice = predictedSlice.replace(/\s/g, "");
    }
    const dist = levenshtein.get(expectedSlice, predictedSlice);
    if (expectedSlice === predictedSlice) {
        console.log("exact match");
    } else {
        console.log(levenshtein.get(expectedSlice, predictedSlice));
    }
    return dist;
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
        return 0;
    }else{
        console.log(levenshtein.get(expectedSlice,predictedSlice));
        return 1;
    }
}

function read_criteria_file(sourceFile) {
    var data = JSON.parse(readFile(sourceFile));
    return data;
}


function run_slice(element) {
    // create input parameters from args ditcionary
    inputArgs = " --inFile " + element["inFile"] + " --outFile " + element["outFile"] + " --lineNb " + element["lineNb"];
    stmt = 'node ./scripts/slice.js' + inputArgs;
    child = execSync(stmt);
    const dist = compare(element["goldFile"], element["outFile"], true); // compare method to evaluate expected and predicted slice
    return dist;
}

// read input file containing criteria
const inputs = read_criteria_file("./test/current_tests.json");
// execute for each individual input
inputs.forEach(function (element) {
    describe("Slice " + element.inFile + " on line: " + element.lineNb, function () {
        this.timeout(5000);
        it("Levenshtein Distance Comparison", function() {
            const dist = run_slice(element);
            if(!element.expectedDist) {
                element.expectedDist = 0;
            }
            assert.equal(dist, element.expectedDist);
        })
    });
});