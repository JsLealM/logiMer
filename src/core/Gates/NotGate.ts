import { Gate } from '../Gate';
import { Pin } from '../Pin';

export class NotGate extends Gate {
  constructor(id: string) {
    super(id);
    
    this.inputs.push(new Pin(`${id}-in1`, 'INPUT'));
    this.outputs.push(new Pin(`${id}-out`, 'OUTPUT'));
  }

  evaluate(): void {
    const val1 = this.inputs[0].value;

    if (val1 === null) {
      this.outputs[0].value = null;
    } else {
      this.outputs[0].value = !val1;
    }
  }
}