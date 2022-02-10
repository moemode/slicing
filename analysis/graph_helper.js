"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphHelper = void 0;
var GraphHelper = /** @class */ (function () {
    function GraphHelper(graph) {
        this.nextNodeId = 1;
        this.nextEdgeId = 1;
        this.graph = graph;
    }
    GraphHelper.prototype.addEdgeIfBothExist = function (source, target) {
        if (!source || !target) {
            return false;
        }
        else {
            this.addEdge(source, target);
        }
    };
    GraphHelper.prototype.addEdge = function (source, target) {
        this.graph.add({
            group: "edges",
            data: {
                id: "e".concat(this.nextEdgeId++),
                source: source.data().id,
                target: target.data().id
            }
        });
    };
    GraphHelper.prototype.addNode = function (nodeDef, testNode) {
        var node = this.graph.add(nodeDef).nodes()[0];
        if (testNode) {
            this.addEdge(node, testNode);
        }
        return node;
    };
    GraphHelper.prototype.addCurrentNode = function () {
        return this.graph.add(this.createNode({ type: "expression" })).nodes()[0];
    };
    GraphHelper.prototype.createNode = function (data) {
        var node = {
            group: "nodes",
            data: data
        };
        node.data.id = "n".concat(this.nextNodeId++);
        return node;
    };
    GraphHelper.prototype.createTestNode = function (loc, result, type) {
        if (type === undefined) {
            type = "unknown";
        }
        return this.createNode({
            loc: loc,
            lloc: loc.toString(),
            val: String(result),
            line: loc.start.line,
            type: "".concat(type, "-test"),
            name: "".concat(type, "-test")
        });
    };
    GraphHelper.prototype.createDeclareNode = function (loc, name, val) {
        return this.createNode({
            line: loc.start.line,
            loc: loc,
            name: "d".concat(name, "=").concat(String(val)),
            varname: name,
            val: String(val),
            type: "declare"
        });
    };
    GraphHelper.prototype.createBreakNode = function (loc) {
        return this.createNode({
            loc: loc,
            lloc: loc.toString(),
            line: loc.start.line,
            name: "break"
        });
    };
    return GraphHelper;
}());
exports.GraphHelper = GraphHelper;
//# sourceMappingURL=graph_helper.js.map