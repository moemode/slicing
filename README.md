# Nicer Slicer
# Installation
# Running milestone tests
In scripts subfolder run:
node testRunner.js --source ./milestone2_testCases.json
node testRunner.js --source ./milestone3_testCases.json
# Running all tests (including mine)
npm test
## Contents
| File  | Description |
| ------------- | ------------- |
| [datatypes.ts](slicer/datatypes.ts) | Datatypes |
| [runner.ts](slicer/runner.ts) | Invokes [preprocess.ts](slicer/preprocess.ts), then starts [graph-constructor.ts](slicer/graph-constructor.ts) , which is the Janlangi analysis, on the transfomed file  |
| [preprocess.ts](slicer/preprocess.ts) | Transforms original program by adding break markers  |
| [control-deps.ts](slicer/control-deps.ts) | Statically find control dependencies induced by conditional branching |
| [graph-constructor.ts](slicer/graph-constructor.ts) | Build Program Execution Graph (PEG) , invoke pruner when done |
| [graph-helper.ts](slicer/graph-helper.ts) | Node factory, adding nodes and edges to graph under construction. Used by [graph-constructor.ts](slicer/graph-constructor.ts) |
| [pruner.ts](slicer/pruner.ts) | Given PEG and slicing criterion, find relevant locations and prune irrelevant ones by walking the AST of the transformed program. Then write out the sliced program.   |
