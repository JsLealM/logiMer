import { Gate } from '../Gate';
import { Pin } from '../Pin';

export class AndGate extends Gate {
  constructor(id: string, numInputs: number = 2) {
    super(id);
    
    for (let i = 0; i < numInputs; i++) {
      this.inputs.push(new Pin(`${id}-in${i + 1}`, 'INPUT'));
    }
    this.outputs.push(new Pin(`${id}-out`, 'OUTPUT'));
  }

  evaluate(): void {
    let hasFalse = false;
    let hasNull = false;

    for (const input of this.inputs) {
      if (input.value === false) hasFalse = true;
      if (input.value === null) hasNull = true;
    }

    if (hasFalse) {
      this.outputs[0].value = false;
    } else if (hasNull) {
      this.outputs[0].value = null;
    } else {
      this.outputs[0].value = true;
    }
  }
}