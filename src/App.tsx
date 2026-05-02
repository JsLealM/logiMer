import { useState, useRef } from 'react';
import { GateView } from './components/GateView';
import { WireView } from './components/WireView';
import { useCamera } from './hooks/useCamera';
import { useExport } from './hooks/useExport';
import { useCircuit } from './hooks/useCircuit';
import { useTheme } from './context/ThemeContext';

const DEFAULT_CODE = "INPUT A1, B1, A0, B0\nG1 = AND(A1, NOT(B1))\nG2 = AND(A0, NOT(B0))\nG3 = NOR(A1, B1)\nGT = OR(G1, AND(G3, G2))\n\nL1 = AND(NOT(A1), B1)\nL2 = AND(NOT(A0), B0)\nL3 = NOR(A1, B1)\nLT = OR(L1, AND(L3, L2))\n\nEQ = AND(NOR(A1, B1), NOR(A0, B0))\n\nA_gt_B = OUTPUT(GT)\nA_lt_B = OUTPUT(LT)\nEqual = OUTPUT(EQ)";

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 12l-4-4h2.5V3h3v5H12L8 12z"/>
    <rect x="2" y="13" width="12" height="1.5" rx=".75"/>
  </svg>
);
const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 4h8v1H4zM4 6.5h8v1H4zM4 9h5v1H4z"/>
    <path fillRule="evenodd" d="M2 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2zm1 0v12h10V2H3z"/>
  </svg>
);
const IconFullscreen = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 1h5v1.5H2.5V7H1V1zM10 1h5v6h-1.5V2.5H10V1zM1 10h1.5v3.5H7V15H1v-5zM14.5 13.5H10V15h5v-5h-1.5v3.5z"/>
  </svg>
);
const IconCompress = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 1v4.5H1V7h6V1H5.5zM9 1v6h6V5.5H10.5V1H9zM1 9v1.5h4.5V15H7V9H1zM10.5 10.5V9H9v6h6v-1.5h-4.5v-3z"/>
  </svg>
);
const IconCamera = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
    <path fillRule="evenodd" d="M5.5 2l-.9 1.5H2A1.5 1.5 0 0 0 .5 5v7A1.5 1.5 0 0 0 2 13.5h12A1.5 1.5 0 0 0 15.5 12V5A1.5 1.5 0 0 0 14 3.5h-2.6L10.5 2h-5zM2 5h12v7H2V5z"/>
  </svg>
);

const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6 .278a.77.77 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278"/>
  </svg>
);

const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707"/>
  </svg>
);

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5
        text-[13px] font-medium leading-[1.71]
        px-4 py-2 rounded-[32px]
        active:scale-[0.97]
        transition-all duration-150
        cursor-pointer whitespace-nowrap
        /* Dark: near-black pill on dark surface */
        dark:bg-[#17171c] dark:text-white dark:border dark:border-[#2a2a38]
        dark:hover:bg-[#0d0d12] dark:hover:border-[#4c6ee6]
        /* Light: ink-black pill on white canvas */
        bg-[#17171c] text-white border border-[#17171c]
        hover:bg-[#212121] hover:border-[#1863dc]
      "
    >
      {children}
    </button>
  );
}

function PillOutlineButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5
        bg-transparent
        text-[13px] font-medium leading-[1.71]
        px-3 py-1.5 rounded-[30px]
        active:scale-[0.97]
        transition-all duration-150
        cursor-pointer whitespace-nowrap
        /* Dark */
        dark:text-[#93939f] dark:border dark:border-[#2a2a38]
        dark:hover:border-[#4c6ee6] dark:hover:text-[#c9d1e0]
        /* Light */
        text-[#616161] border border-[#d9d9dd]
        hover:border-[#1863dc] hover:text-[#17171c]
      "
    >
      {children}
    </button>
  );
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="
        inline-flex items-center gap-1.5
        text-[12px] font-medium
        px-3 py-1.5 rounded-[30px]
        cursor-pointer whitespace-nowrap
        transition-all duration-150
        active:scale-[0.97]
        /* Dark surface */
        dark:bg-[#17171c] dark:text-[#e8e8f0] dark:border dark:border-[#2a2a38]
        dark:hover:border-[#4c6ee6]
        /* Light surface */
        bg-[#eeece7] text-[#212121] border border-[#d9d9dd]
        hover:border-[#1863dc]
      "
    >
      {isDark ? <IconSun /> : <IconMoon />}
      <span className="hidden sm:inline">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
    </button>
  );
}

function SyntaxCard() {
  const rules = [
    { label: 'ENTRADAS',   code: 'INPUT var1, var2, ...', desc: 'Declara variables de entrada' },
    { label: 'COMPUERTAS', code: 'dest = AND(a, b)',       desc: 'AND · OR · NOT · NOR · NAND' },
    { label: 'ANIDACIÓN',  code: 'dest = OR(NOT(a), b)',   desc: 'Expresiones compuestas' },
    { label: 'SALIDAS',    code: 'lbl = OUTPUT(var)',       desc: 'Declara nodo de salida' },
  ];

  return (
    <div className="
      rounded-[8px] overflow-hidden
      border
      dark:border-[#2a2a38] dark:bg-[#0d0d12]
      border-[#e5e7eb] bg-[#f8f9fb]
    ">
      <div className="
        px-4 py-2.5 border-b flex items-center gap-2
        dark:border-[#2a2a38]
        border-[#e5e7eb]
      ">
        <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#4c6ee6] font-mono">
          Sintaxis del Lenguaje
        </span>
      </div>

      <div className="px-4 py-3 space-y-3">
        {rules.map((rule) => (
          <div key={rule.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#ff7759]">
              {rule.label}
            </span>
            <code className="
              text-[12px] font-mono px-2 py-1 rounded-[4px] block
              dark:text-[#c9d1e0] dark:bg-[#17171c]
              text-[#212121] bg-[#eeece7]
            ">
              {rule.code}
            </code>
            <span className="
              text-[11px]
              dark:text-[#616161]
              text-[#75758a]
            ">{rule.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [inputStates, setInputStates] = useState<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const camera   = useCamera();
  const exporter = useExport(svgRef);
  const circuit  = useCircuit(code, inputStates);

  const handleToggle = (id: string) => {
    setInputStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const visualizerClass = isFullscreen
    ? 'fixed inset-0 z-[9999] flex flex-col dark:bg-[#0a0a10] bg-[#f8f9fb]'
    : 'flex-1 flex flex-col overflow-hidden min-w-0';

  return (
    <div className="
      flex h-screen w-full overflow-hidden
      dark:bg-[#17171c]
      bg-[#f1f5ff]
    ">

      {!isFullscreen && (
        <aside className="
          w-[350px] shrink-0 flex flex-col overflow-hidden
          border-r
          dark:bg-[#12121a] dark:border-[#2a2a38]
          bg-white border-[#e5e7eb]
        ">
          <div className="
            px-5 py-4 border-b flex items-center justify-between
            dark:border-[#2a2a38]
            border-[#e5e7eb]
          ">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[6px] bg-[#4c6ee6] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-semibold text-white font-mono">LS</span>
              </div>
              <div>
                <h1
                  className="text-[13px] font-semibold leading-tight
                    dark:text-[#e8e8f0] text-[#17171c]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  LogiMer
                </h1>
                <p className="text-[10px] leading-tight dark:text-[#616161] text-[#93939f]">
                  Editor de Circuitos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="
                text-[9px] font-medium tracking-[0.15em] uppercase font-mono
                px-2 py-0.5 rounded-[4px]
                text-[#4c6ee6]
                dark:border dark:border-[#1863dc]/40
                border border-[#1863dc]/30
              ">
                v0.1
              </span>
            </div>
          </div>

          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase font-mono
              dark:text-[#93939f] text-[#75758a]">
              Editor
            </span>
            <span className="text-[10px] dark:text-[#616161] text-[#93939f]">.logimer</span>
          </div>
          <div className="px-5 flex-1 min-h-0 flex flex-col gap-3">
            <textarea
              id="circuit-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="code-editor flex-1 w-full"
              spellCheck={false}
              aria-label="Editor de código de circuito lógico"
            />

            {circuit.error && (
              <div
                role="alert"
                className="
                  flex items-start gap-2
                  px-3 py-2.5 rounded-[8px]
                  text-[12px] leading-snug
                  bg-[#b30000]/10 border border-[#b30000]/40 text-[#ff6b6b]
                "
              >
                <span className="mt-0.5 shrink-0 text-[#b30000]">⚠</span>
                <span>{circuit.error}</span>
              </div>
            )}

            <PillOutlineButton onClick={camera.resetCamera}>
              <IconCamera />
              Centrar cámara
            </PillOutlineButton>
          </div>

          <div className="px-5 pb-5 pt-3">
            <SyntaxCard />
          </div>
        </aside>
      )}

      <div className={visualizerClass}>

        <div className="
          flex items-center justify-between
          px-5 py-3 shrink-0
          backdrop-blur-sm border-b
          dark:bg-[#0d0d12]/80 dark:border-[#2a2a38]
          bg-white/80 border-[#e5e7eb]
        ">
          <div className="flex items-center gap-3">
            {isFullscreen && (
              <div className="w-6 h-6 rounded-[5px] bg-[#4c6ee6] flex items-center justify-center shrink-0">
                <span className="text-[9px] font-semibold text-white font-mono">LS</span>
              </div>
            )}
            <h2
              className="text-[13px] font-medium tracking-[-0.01em]
                dark:text-[#e8e8f0] text-[#17171c]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Visualizador Interactivo
            </h2>
            {!circuit.error && (
              <span className="flex items-center gap-1 text-[10px] text-[#10b981] font-mono tracking-[0.1em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse inline-block" />
                EN VIVO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isFullscreen && <ThemeToggle />}
            <PrimaryButton onClick={exporter.downloadSvg}>
              <IconDownload /> SVG
            </PrimaryButton>
            <PrimaryButton onClick={exporter.downloadPng}>
              <IconDownload /> PNG
            </PrimaryButton>
            <PillOutlineButton onClick={exporter.copyToClipboard}>
              <IconCopy /> Copiar
            </PillOutlineButton>
            <PillOutlineButton onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <IconCompress /> : <IconFullscreen />}
              {isFullscreen ? 'Contraer' : 'Pantalla Completa'}
            </PillOutlineButton>
          </div>
        </div>

        <svg
          ref={svgRef}
          id="circuit-canvas"
          width="100%"
          height="100%"
          className="svg-canvas flex-1"
          style={{ cursor: camera.isDragging ? 'grabbing' : 'grab' }}
          onWheel={camera.handleWheel}
          onMouseDown={camera.handleMouseDown}
          onMouseMove={camera.handleMouseMove}
          onMouseUp={camera.handleMouseUp}
          onMouseLeave={camera.handleMouseUp}
          aria-label="Canvas del circuito lógico"
        >
          <g transform={`translate(${camera.pan.x}, ${camera.pan.y}) scale(${camera.scale})`}>
            {!circuit.error && circuit.wiresArray.map(wire => <WireView key={wire.id} wire={wire} />)}
            {!circuit.error && circuit.gatesArray.map(gate => <GateView key={gate.id} gate={gate} onToggle={handleToggle} />)}
          </g>
        </svg>

        <div className="
          px-5 py-1.5 flex items-center justify-between shrink-0 border-t
          dark:bg-[#0d0d12]/80 dark:border-[#2a2a38]
          bg-white/80 border-[#e5e7eb]
        ">
          <span className="text-[10px] font-mono dark:text-[#616161] text-[#93939f]">
            Escala: {Math.round(camera.scale * 100)}%
          </span>
          <span className="text-[10px] font-mono dark:text-[#616161] text-[#93939f]">
            LogiMer · Johan 2026
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;