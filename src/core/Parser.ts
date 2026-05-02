import { Circuit } from './Circuit';
import { Gate } from './Gate';
import { AndGate } from './Gates/AndGate';
import { OrGate } from './Gates/OrGate';
import { NotGate } from './Gates/NotGate';
import { NandGate } from './Gates/NandGate';
import { NorGate } from './Gates/NorGate';
import { Wire } from './Wire';
import { InputGate } from './Gates/InputGate';
import { OutputGate } from './Gates/OutputGate';

export class Parser {
  
  private static tempCounter = 0;

  public static reset(): void {
    this.tempCounter = 0;
  }

  public static parseLine(line: string, circuit: Circuit): void {
    const cleanLine = line.trim();
    if (cleanLine.length === 0) return;

    if (cleanLine.toUpperCase().startsWith("INPUT ")) {
      const args = cleanLine.substring(6).split(',').map(a => a.trim());
      for (const arg of args) {
         if (circuit.gates.has(arg)) {
             throw new Error(`Símbolo duplicado: '${arg}' ya está en uso.`);
         }
         circuit.addGate(new InputGate(arg)); 
      }
      return;
    }

    const parts = cleanLine.split('=');
    if (parts.length !== 2) throw new Error(`Falta el '=' en: ${line}`);

    const targetName = parts[0].trim();
    if (circuit.hasSymbol(targetName)) {
       throw new Error(`Variable duplicada: '${targetName}' ya fue declarada previamente.`);
    }
    const expression = parts[1].trim();
    this.evaluateExpression(expression, targetName, circuit);
  }

  private static evaluateExpression(expression: string, targetName: string | null, circuit: Circuit): string {
    expression = expression.trim();
    if (expression.indexOf('(') === -1) {
        if (!circuit.hasSymbol(expression)) {
            throw new Error(`Variable no declarada: '${expression}' no existe. Usa 'INPUT ${expression}' al inicio.`);
        }
        return expression;
    }

    const openParen = expression.indexOf('(');
    const closeParen = expression.lastIndexOf(')'); 
    if (openParen === -1 || closeParen === -1) {
        throw new Error(`Faltan paréntesis en: ${expression}`);
    }

    const gateType = expression.substring(0, openParen).trim();
    const argsString = expression.substring(openParen + 1, closeParen).trim();

    const rawArgs = this.splitArgumentsSafe(argsString);

    const resolvedInputNames: string[] = [];
    for (let i = 0; i < rawArgs.length; i++) {
        const resolvedName = this.evaluateExpression(rawArgs[i], null, circuit);
        resolvedInputNames.push(resolvedName);
    }
    const finalTargetName = targetName !== null ? targetName : `_TEMP_${this.tempCounter++}`;
    
    let gate: Gate;
    switch (gateType.toUpperCase()) {
      case 'AND': gate = new AndGate(finalTargetName, resolvedInputNames.length); break;
      case 'OR': gate = new OrGate(finalTargetName, resolvedInputNames.length); break;
      case 'NOT': gate = new NotGate(finalTargetName); break;
      case 'NAND': gate = new NandGate(finalTargetName, resolvedInputNames.length); break;
      case 'NOR': gate = new NorGate(finalTargetName, resolvedInputNames.length); break;
      case 'OUTPUT': gate = new OutputGate(finalTargetName); break;
      default: throw new Error(`Compuerta desconocida: ${gateType}`);
    }

    circuit.addGate(gate);

    for (let i = 0; i < resolvedInputNames.length; i++) {
      const inputName = resolvedInputNames[i];
      const sourceGate = circuit.getGate(inputName);

      if (sourceGate !== undefined) {
        const wireId = `${inputName}-to-${finalTargetName}-${i}`;
        const wire = new Wire(wireId, sourceGate.outputs[0], gate.inputs[i]);
        circuit.addWire(wire);
      }
    }


    return finalTargetName;
  }


  private static splitArgumentsSafe(argsString: string): string[] {
    const args: string[] = [];
    let currentArg = "";
    let parenLevel = 0;

    for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        
        if (char === '(') {
            parenLevel++;
        } else if (char === ')') {
            parenLevel--;
        } else if (char === ',' && parenLevel === 0) {
            args.push(currentArg.trim());
            currentArg = "";
            continue;
        }
        currentArg += char;
    }
    
    if (currentArg.trim() !== "") {
        args.push(currentArg.trim());
    }
    
    return args;
  }
}