import { useState } from 'react';
import type { WheelEvent, MouseEvent } from 'react';

export function useCamera() {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: WheelEvent<SVGSVGElement>) => {
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setScale(prevScale => Math.min(Math.max(0.1, prevScale + delta), 3));
  };

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetCamera = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return {
    scale, pan, isDragging,
    handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, resetCamera
  };
}