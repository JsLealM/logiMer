import { Gate } from './Gate';
import { Wire } from './Wire';

export class Circuit {
  public gates: Map<string, Gate>;
  public wires: Wire[];
  public globalInputs: Set<string>;

  constructor() {
    this.gates = new Map<string, Gate>();
    this.wires = [];
    this.globalInputs = new Set<string>();
  }

  public addGate(gate: Gate): void {
    this.gates.set(gate.id, gate);
  }

  public addWire(wire: Wire): void {
    this.wires.push(wire);
  }

  public getGate(id: string): Gate | undefined {
    return this.gates.get(id);
  }

  public addGlobalInput(name: string): void {
    this.globalInputs.add(name);
  }

  public hasSymbol(name: string): boolean {
    return this.gates.has(name) || this.globalInputs.has(name);
  }
 public simulate(globalInputs: Record<string, boolean>): void {

    for (const gate of this.gates.values()) {
      for (const pin of gate.inputs) {
        if (pin.id.startsWith('GLOBAL_IN_')) {
          const inputName = pin.id.replace('GLOBAL_IN_', '');
          if (globalInputs[inputName] !== undefined) {
            pin.value = globalInputs[inputName];
          } else {
            pin.value = null;
          }
        }
      }
    }

    const maxTicks = this.gates.size;
    
    for (let i = 0; i < maxTicks; i++) {
      for (const gate of this.gates.values()) {
        gate.evaluate();
      }
      for (const wire of this.wires) {
        wire.update();
      }
    }
  }
}