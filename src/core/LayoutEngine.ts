import { Circuit } from './Circuit';
import { InputGate } from './Gates/InputGate';
import dagre from 'dagre';

export class LayoutEngine {
  
  public static applyLayout(circuit: Circuit): void {
    const g = new dagre.graphlib.Graph({ multigraph: true });

    g.setGraph({ rankdir: 'LR', ranksep: 200, nodesep: 80,edgesep: 40,marginx: 50,marginy: 50 });
    g.setDefaultEdgeLabel(() => ({}));


    g.setNode('__ANCHOR__', { width: 1, height: 1 });

    for (const gate of circuit.gates.values()) {
      g.setNode(gate.id, { width: gate.width, height: gate.height });

      if (gate instanceof InputGate) {
         g.setEdge('__ANCHOR__', gate.id, { weight: 100 });
      }
    }

    for (const wire of circuit.wires) {
      const sourceGateId = wire.from.id.split('-')[0];
      const targetGateId = wire.to.id.split('-')[0];
      g.setEdge(sourceGateId, targetGateId, { }, wire.id);
    }

    dagre.layout(g);

    for (const gate of circuit.gates.values()) {
      const node = g.node(gate.id);
      gate.x = node.x - gate.width / 2;
      gate.y = node.y - gate.height / 2;
      gate.updatePinPositions();
    }

    for (const wire of circuit.wires) {
      const sourceGateId = wire.from.id.split('-')[0];
      const targetGateId = wire.to.id.split('-')[0];
      const edgeData = g.edge(sourceGateId, targetGateId, wire.id);
      
      if (edgeData && edgeData.points) {
        wire.points = edgeData.points;
      }
    }
  }
}