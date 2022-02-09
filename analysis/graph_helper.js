"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphHelper = void 0;
var datatypes_1 = require("./datatypes");
var GraphHelper = /** @class */ (function () {
    function GraphHelper(graph) {
        this.nextNodeId = 1;
        this.nextEdgeId = 1;
        this.graph = graph;
    }
    GraphHelper.prototype.addWriteNode = function (rhsLoc, name, val, line) {
        return this.addNode({
            loc: rhsLoc,
            name: name,
            varname: name,
            val: val,
            type: "write",
            line: line
        });
    };
    GraphHelper.getNodesAt = function (nodes, loc) {
        return nodes.filter(function (node) {
            return datatypes_1.SourceLocation.in_between_inclusive(loc, node.data.loc);
        });
    };
    GraphHelper.prototype.addNode = function (data, currentCallerLoc, testNode) {
        var node = {
            group: "nodes",
            data: data
        };
        node.data.id = "n".concat(this.nextNodeId++);
        if (currentCallerLoc) {
            node.data.callerLoc = currentCallerLoc;
        }
        this.graph.add(node);
        if (testNode) {
            this.graph.add();
        }
        return node;
    };
    GraphHelper.prototype.addEdge = function (source, target) {
        this.graph.add({
            group: "edges",
            data: {
                id: "e".concat(this.nextEdgeId++),
                source: source.data.id,
                target: target.data.id
            }
        });
    };
    GraphHelper.prototype.addTestNode = function (test, result) {
        var nodeData = {
            data: {
                loc: test.loc,
                val: result,
                line: test.loc.start.line,
                type: "".concat(test.type, "-test"),
                name: "".concat(test.type, "-test")
            }
        };
        return this.addNode(nodeData);
    };
    GraphHelper.prototype.addBreakNode = function (loc) {
        var breakNode = {
            data: {
                loc: loc,
                line: loc.start.line,
                name: "break"
            }
        };
        var bNode = this.graph.add(breakNode);
        return [breakNode, bNode];
    };
    return GraphHelper;
}());
exports.GraphHelper = GraphHelper;
//# sourceMappingURL=graph_helper.js.map