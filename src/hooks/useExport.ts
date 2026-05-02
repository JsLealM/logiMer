import { RefObject } from 'react';

export function useExport(svgRef: RefObject<SVGSVGElement>) {
  
  const getSvgData = () => {
    if (!svgRef.current) return { str: '', width: 0, height: 0 };
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    const gNode = svgClone.querySelector('g');
    if (gNode) {
      gNode.removeAttribute('transform');
    }

    let finalWidth = 800;
    let finalHeight = 600;

    const originalG = svgRef.current.querySelector('g');
    if (originalG) {
      const bbox = originalG.getBBox(); 
      const margin = 50;

      finalWidth = bbox.width + margin * 2;
      finalHeight = bbox.height + margin * 2;
      const x = bbox.x - margin;
      const y = bbox.y - margin;

      svgClone.setAttribute('viewBox', `${x} ${y} ${finalWidth} ${finalHeight}`);
      svgClone.setAttribute('width', `${finalWidth}`);
      svgClone.setAttribute('height', `${finalHeight}`);
    }

    return {
      str: new XMLSerializer().serializeToString(svgClone),
      width: finalWidth,
      height: finalHeight
    };
  };

  const downloadSvg = () => {
    const { str } = getSvgData();
    if (!str) return;
    const blob = new Blob([str], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuito-logimer.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const drawSvgToCanvas = (callback: (canvas: HTMLCanvasElement) => void) => {
    const { str, width, height } = getSvgData();
    if (!str) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const svgBlob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      callback(canvas);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadPng = () => {
    drawSvgToCanvas((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'circuito-logimer.png';
      a.click();
    });
  };

  const copyToClipboard = () => {
    drawSvgToCanvas((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            .then(() => alert('¡Circuito copiado al portapapeles!'))
            .catch(() => alert('Error al copiar al portapapeles.'));
        }
      });
    });
  };

  return { downloadSvg, downloadPng, copyToClipboard };
}