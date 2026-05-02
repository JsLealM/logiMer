import { Gate } from '../core/Gate';
import { AndGate } from '../core/Gates/AndGate';
import { OrGate } from '../core/Gates/OrGate';
import { NorGate } from '../core/Gates/NorGate';
import { NandGate } from '../core/Gates/NandGate';
import { NotGate } from '../core/Gates/NotGate';
import { InputGate } from '../core/Gates/InputGate';
import { OutputGate } from '../core/Gates/OutputGate';
import { useTheme } from '../context/ThemeContext';


const DARK_COLORS = {
  gateFill:        '#12121a',   
  gateStrokeOff:   '#3a3a54',   
  gateStrokeOn:    '#10b981',   
  inputFillOff:    '#17171c',
  inputFillOn:     '#003c33', 
  inputStrokeOff:  '#3a3a54',
  inputStrokeOn:   '#10b981',
  outputFillOff:   '#17171c',
  outputFillOn:    '#052e16',
  outputStrokeOff: '#3a3a54',
  outputStrokeOn:  '#10b981',
  pinOff:          '#3a3a54',
  pinOn:           '#10b981',
  labelOff:        '#93939f',   
  labelOn:         '#e8e8f0',  
  inputLabelOff:   '#75758a',
  inputLabelOn:    '#e8e8f0',
} as const;

const LIGHT_COLORS = {
  gateFill:        '#ffffff',   
  gateStrokeOff:   '#d9d9dd',   
  gateStrokeOn:    '#059669',   
  inputFillOff:    '#f8f9fb',
  inputFillOn:     '#d1fae5',   
  inputStrokeOff:  '#d9d9dd',
  inputStrokeOn:   '#059669',
  outputFillOff:   '#f8f9fb',
  outputFillOn:    '#a7f3d0',
  outputStrokeOff: '#d9d9dd',
  outputStrokeOn:  '#059669',
  pinOff:          '#d9d9dd',
  pinOn:           '#059669',
  labelOff:        '#75758a',   
  labelOn:         '#17171c',   
  inputLabelOff:   '#93939f',
  inputLabelOn:    '#17171c',
} as const;

interface GateViewProps {
  gate: Gate;
  onToggle?: (id: string) => void;
}

export function GateView({ gate, onToggle }: GateViewProps) {
  const { isDark } = useTheme();
  const C = isDark ? DARK_COLORS : LIGHT_COLORS;

  if (gate instanceof InputGate) {
    const on = gate.state;
    return (
      <g
        transform={`translate(${gate.x}, ${gate.y})`}
        style={{ cursor: 'pointer' }}
        onClick={() => onToggle && onToggle(gate.id)}
      >
        <rect
          width="40" height="40" rx="6"
          fill={on ? C.inputFillOn : C.inputFillOff}
          stroke={on ? C.inputStrokeOn : C.inputStrokeOff}
          strokeWidth="2"
        />
        {on && (
          <rect
            width="40" height="40" rx="6"
            fill="none"
            stroke={C.inputStrokeOn}
            strokeWidth="5"
            strokeOpacity="0.15"
          />
        )}
        <text
          x="20" y="26"
          fontSize="13"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fill={on ? C.inputLabelOn : C.inputLabelOff}
          textAnchor="middle"
          fontWeight="600"
        >
          {gate.id}
        </text>
        <circle cx="40" cy="20" r="4" fill={on ? C.pinOn : C.pinOff} />
      </g>
    );
  }

  if (gate instanceof OutputGate) {
    const isPowered = gate.inputs[0] && gate.inputs[0].value === true;
    return (
      <g transform={`translate(${gate.x}, ${gate.y})`}>
        {isPowered && (
          <circle cx="20" cy="20" r="30"
            fill={C.outputStrokeOn} fillOpacity="0.08" />
        )}
        <circle cx="20" cy="20" r="22"
          fill={isPowered ? C.outputFillOn : C.outputFillOff}
          stroke={isPowered ? C.outputStrokeOn : C.outputStrokeOff}
          strokeWidth="2"
        />
        {isPowered && (
          <circle cx="20" cy="20" r="10"
            fill={C.outputStrokeOn} fillOpacity="0.35" />
        )}
        <text
          x="20" y="24"
          fontSize="10"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fill={isPowered ? C.labelOn : C.labelOff}
          textAnchor="middle"
          fontWeight="600"
        >
          {gate.id.startsWith('_TEMP_') ? '' : gate.id}
        </text>
        <circle cx="0" cy="20" r="4"
          fill={isPowered ? C.pinOn : C.pinOff} />
      </g>
    );
  }

  let pathD = '';
  let isNot = false;
  let isOrCurve = false;

  if (gate instanceof AndGate) {
    pathD = 'M 0,0 L 50,0 A 30,30 0 0,1 50,60 L 0,60 Z M 80,30 L 100,30';
  } else if (gate instanceof NandGate) {
    pathD = 'M 0,0 L 50,0 A 30,30 0 0,1 50,60 L 0,60 Z';
    isNot = true;
  } else if (gate instanceof OrGate) {
    pathD = 'M 0,0 Q 40,0 80,30 Q 40,60 0,60 Q 15,30 0,0 Z M 80,30 L 100,30';
    isOrCurve = true;
  } else if (gate instanceof NorGate) {
    pathD = 'M 0,0 Q 40,0 80,30 Q 40,60 0,60 Q 15,30 0,0 Z';
    isNot = true;
    isOrCurve = true;
  } else if (gate instanceof NotGate) {
    pathD = 'M 0,0 L 80,30 L 0,60 Z';
    isNot = true;
  }

  const isPowered = gate.outputs[0] !== undefined && gate.outputs[0].value === true;
  const strokeColor = isPowered ? C.gateStrokeOn : C.gateStrokeOff;

  return (
    <g transform={`translate(${gate.x}, ${gate.y})`}>
      <path
        d={pathD}
        fill={C.gateFill}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {isNot && (
        <circle cx="90" cy="30" r="9"
          fill={C.gateFill}
          stroke={strokeColor}
          strokeWidth="2"
        />
      )}
      <text
        x="40" y="35"
        fontSize="11"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill={isPowered ? C.labelOn : C.labelOff}
        textAnchor="middle"
        fontWeight="600"
      >
        {gate.id.startsWith('_TEMP_') ? '' : gate.id}
      </text>

      {gate.inputs.map((pin) => {
        const relX = pin.x - gate.x;
        const relY = pin.y - gate.y;
        const pinColor = pin.value === true ? C.pinOn : C.pinOff;
        return (
          <g key={pin.id}>
            {isOrCurve && (
              <line
                x1={relX} y1={relY} x2={relX + 15} y2={relY}
                stroke={strokeColor} strokeWidth="2"
              />
            )}
            <circle cx={relX} cy={relY} r="4" fill={pinColor} />
          </g>
        );
      })}

      {gate.outputs.map((pin) => {
        const relX = pin.x - gate.x;
        const relY = pin.y - gate.y;
        const pinColor = pin.value === true ? C.pinOn : C.pinOff;
        return <circle key={pin.id} cx={relX} cy={relY} r="4" fill={pinColor} />;
      })}
    </g>
  );
}