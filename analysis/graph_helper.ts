import cytoscape, { Core, ElementDefinition } from "cytoscape";
import { SourceLocation } from "./datatypes";


class GraphHelper {
    graph: Core;
    nextNodeId = 1;
    nextEdgeId = 1;

    constructor(graph: Core) {
        this.graph = graph;
    }

    addWriteNode(rhsLoc, name, val, line): ElementDefinition {
        return this.addNode({
            loc: rhsLoc,
            name,
            varname: name,
            val,
            type: "write",
            line
        });
    }

    static getNodesAt(nodes: any[], loc: SourceLocation): any[] {
        return nodes.filter((node) =>
            SourceLocation.in_between_inclusive(loc, node.data.loc));
    }


     addNode(data, currentCallerLoc?, testNode?): ElementDefinition {
        const node = {
            group: <const> "nodes",
            data: data
        };
        node.data.id = `n${this.nextNodeId++}`;
        if (currentCallerLoc) {
            node.data.callerLoc = currentCallerLoc;
        }
        this.graph.add(node);
        if(testNode) {
            this.graph.add()
        }
        return node;
    }

     addEdge(source, target): void {
        this.graph.add({
            group: <const> "edges",
            data: {
                id: `e${this.nextEdgeId++}`,
                source: source.data.id,
                target: target.data.id
            }
        });
    }

     addTestNode(test, result) {
        const nodeData = {
            data: {
                loc: test.loc,
                val: result,
                line: test.loc.start.line,
                type: `${test.type}-test`,
                name: `${test.type}-test`
            }
        };
        return this.addNode(nodeData);
    }

     addBreakNode(loc: SourceLocation) {
        const breakNode = {
            data: {
                loc: loc,
                line: loc.start.line,
                name: `break`
            }
        };
        const bNode: cytoscape.Collection = this.graph.add(breakNode);
        return [breakNode, bNode];
    }
}

export { GraphHelper };