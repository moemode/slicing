import cytoscape, { Core, ElementDefinition } from "cytoscape";
import { SourceLocation } from "./datatypes";

class GraphHelper {
    graph: Core;
    nextNodeId = 1;
    nextEdgeId = 1;

    constructor(graph: Core) {
        this.graph = graph;
    }

    addEdgeIfBothExist(source: cytoscape.NodeSingular, target: cytoscape.NodeSingular): boolean {
        if(!source || !target){
            return false;
        } else {
            this.addEdge(source, target);
        }
    }

    addEdge(source: cytoscape.NodeSingular, target: cytoscape.NodeSingular): void {
        this.graph.add({
            group: <const>"edges",
            data: {
                id: `e${this.nextEdgeId++}`,
                source: source.data().id,
                target: target.data().id
            }
        });
    }

    addNode(nodeDef: ElementDefinition, testNode?: cytoscape.NodeSingular): cytoscape.NodeSingular {
        const node = this.graph.add(nodeDef).nodes()[0];
        if (testNode) {
            this.addEdge(node, testNode);
        }
        return node;
    }

    addCurrentNode(): cytoscape.NodeSingular {
        return this.graph.add(this.createNode({})).nodes()[0];
    }

    createNode(data): ElementDefinition {
        const node = {
            group: <const>"nodes",
            data: data
        };
        node.data.id = `n${this.nextNodeId++}`;
        return node;
    }

    createTestNode(test, result): ElementDefinition {
        return this.createNode({
            loc: test.loc,
            lloc: test.loc.toString(),
            val: result,
            line: test.loc.start.line,
            type: `${test.type}-test`,
            name: `${test.type}-test`
        });
    }

    createDeclareNode(loc: SourceLocation, name: string, val: unknown): ElementDefinition {
        return this.createNode({
            line: loc.start.line,
            loc,
            name: `d${name}=${String(val)}`,
            varname: name,
            val: String(val),
            type: "declare"
        });
    }

    createBreakNode(loc: SourceLocation): ElementDefinition {
        return this.createNode({
            loc: loc,
            lloc: loc.toString(),
            line: loc.start.line,
            name: `break`
        });
    }
}

export { GraphHelper };
