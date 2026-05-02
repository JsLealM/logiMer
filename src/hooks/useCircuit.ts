import { useMemo } from 'react';
import { Circuit } from '../core/Circuit';
import { Parser } from '../core/Parser';
import { LayoutEngine } from '../core/LayoutEngine';
import { InputGate } from '../core/Gates/InputGate';

export function useCircuit(code: string, inputStates: Record<string, boolean>) {
  return useMemo(() => {
    Parser.reset(); 
    const circuit = new Circuit();
    let currentError: string | null = null;

    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      try {
        Parser.parseLine(lines[i], circuit);
      } catch (error: any) {
        currentError = `Línea ${i + 1}: ${error.message}`;
        break; 
      }
    }

    if (!currentError) {
      for (const gate of circuit.gates.values()) {
        if (gate instanceof InputGate) {
          gate.state = inputStates[gate.id] === true; 
        }
      }
      LayoutEngine.applyLayout(circuit);
      circuit.simulate({}); 
    }

    return {
      error: currentError,
      gatesArray: Array.from(circuit.gates.values()),
      wiresArray: circuit.wires
    };
  }, [code, inputStates]);
}