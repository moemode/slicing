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
        if (!source || !target) {
            return false;
        } else {
            this.addEdge(source, target);
            return true;
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
        return this.graph.add(this.createNode({ type: "expression" })).nodes()[0];
    }

    createNode(data): ElementDefinition {
        const node = {
            group: <const>"nodes",
            data: data
        };
        node.data.id = `n${this.nextNodeId++}`;
        return node;
    }

    createTestNode(loc: SourceLocation, result: boolean, type?: string): ElementDefinition {
        if (type === undefined) {
            type = "unknown";
        }
        return this.createNode({
            loc,
            lloc: loc.toString(),
            val: String(result),
            line: loc.start.line,
            type: `${type}-test`,
            name: `${loc.start.line}:  ${type}-test`
        });
    }

    createDeclareNode(loc: SourceLocation, name: string, val: unknown): ElementDefinition {
        return this.createNode({
            line: loc.start.line,
            loc,
            name: `d: ${name}=${String(val).substring(0, 5)}`,
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
            name: `${loc.start.line}: brk`,
            type: "break"
        });
    }
}

export { GraphHelper };
