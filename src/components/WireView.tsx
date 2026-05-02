import { Wire } from '../core/Wire';
import { useTheme } from '../context/ThemeContext';

const DARK = {
  on:  '#10b981',  
  off: '#3a3a54',
};
const LIGHT = {
  on:  '#059669',  
  off: '#c8c8d4', 
};

interface WireViewProps {
  wire: Wire;
}

export function WireView({ wire }: WireViewProps) {
  const { isDark } = useTheme();
  const palette = isDark ? DARK : LIGHT;

  const isPowered = wire.from.value === true;
  const wireColor = isPowered ? palette.on : palette.off;

  const startX = wire.from.x;
  const startY = wire.from.y;
  const endX   = wire.to.x;
  const endY   = wire.to.y;

  const deltaX  = Math.abs(endX - startX);
  const offset  = Math.max(deltaX / 2, 50);
  const pathData = `M ${startX} ${startY} C ${startX + offset} ${startY}, ${endX - offset} ${endY}, ${endX} ${endY}`;

  return (
    <>
      {isPowered && (
        <path
          d={pathData}
          fill="none"
          stroke={wireColor}
          strokeWidth={isDark ? 6 : 4}
          strokeOpacity={isDark ? 0.18 : 0.25}
          strokeLinecap="round"
        />
      )}
      <path
        d={pathData}
        fill="none"
        stroke={wireColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );
}