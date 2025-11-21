import React, { useState, useRef, ReactNode } from "react";

interface Widget {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: ReactNode;
}

interface DragRef {
  id: number;
  offsetX: number;
  offsetY: number;
  originalX: number;
  originalY: number;
}

interface ResizeRef {
  id: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

const GRID_SIZE = 20;
const COLS = 40;
const ROWS = 30;

interface DraggableWidgetBoardProps {
  children?: ReactNode;
}

export default function DraggableWidgetBoard({ children }: DraggableWidgetBoardProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<number | null>(null);
  const dragRef = useRef<DragRef | null>(null);
  const resizeRef = useRef<ResizeRef | null>(null);

  const snapToGrid = (value: number): number => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const findEmptySpace = (width: number, height: number): { x: number; y: number } => {
    const gridWidth = Math.ceil(width / GRID_SIZE);
    const gridHeight = Math.ceil(height / GRID_SIZE);

    for (let row = 0; row < ROWS - gridHeight; row++) {
      for (let col = 0; col < COLS - gridWidth; col++) {
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE;
        
        if (!checkCollision(x, y, width, height, null)) {
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  };

  const checkCollision = (x: number, y: number, width: number, height: number, excludeId: number | null): boolean => {
    return widgets.some(w => {
      if (w.id === excludeId) return false;
      
      return !(
        x + width <= w.x ||
        x >= w.x + w.width ||
        y + height <= w.y ||
        y >= w.y + w.height
      );
    });
  };

  const addWidget = () => {
    const width = 300;
    const height = 200;
    const { x, y } = findEmptySpace(width, height);
    
    const newWidget: Widget = {
      id: Date.now(),
      x,
      y,
      width,
      height,
      content: children || null
    };
    setWidgets([...widgets, newWidget]);
  };

  const startDrag = (e: React.MouseEvent, widget: Widget) => {
    if (resizeRef.current) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: widget.id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      originalX: widget.x,
      originalY: widget.y
    };
    setSelectedWidget(widget.id);
  };

  const startResize = (e: React.MouseEvent, widget: Widget) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      id: widget.id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: widget.width,
      startHeight: widget.height
    };
    setSelectedWidget(widget.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const boardRect = e.currentTarget.getBoundingClientRect();
      const rawX = e.clientX - boardRect.left - dragRef.current.offsetX;
      const rawY = e.clientY - boardRect.top - dragRef.current.offsetY;
      
      const snappedX = snapToGrid(Math.max(0, rawX));
      const snappedY = snapToGrid(Math.max(0, rawY));

      const widget = widgets.find(w => w.id === dragRef.current!.id);
      if (widget && !checkCollision(snappedX, snappedY, widget.width, widget.height, dragRef.current.id)) {
        setWidgets(widgets.map(w => 
          w.id === dragRef.current!.id
            ? { ...w, x: snappedX, y: snappedY }
            : w
        ));
      }
    }

    if (resizeRef.current) {
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      const newWidth = snapToGrid(Math.max(150, resizeRef.current.startWidth + deltaX));
      const newHeight = snapToGrid(Math.max(100, resizeRef.current.startHeight + deltaY));

      const widget = widgets.find(w => w.id === resizeRef.current!.id);
      if (widget && !checkCollision(widget.x, widget.y, newWidth, newHeight, resizeRef.current.id)) {
        setWidgets(widgets.map(w =>
          w.id === resizeRef.current!.id
            ? { ...w, width: newWidth, height: newHeight }
            : w
        ));
      }
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    resizeRef.current = null;
  };

  const deleteWidget = (id: number) => {
    setWidgets(widgets.filter(w => w.id !== id));
    if (selectedWidget === id) {
      setSelectedWidget(null);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{
        width: "200px",
        background: "#f5f5f5",
        padding: "20px",
        borderRight: "1px solid #ddd"
      }}>
        <h3>Widgets</h3>
        <button
          onClick={addWidget}
          style={{
            width: "100%",
            padding: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Add Widget
        </button>
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#fafafa",
          backgroundImage: `
            linear-gradient(#e0e0e0 1px, transparent 1px),
            linear-gradient(90deg, #e0e0e0 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {widgets.map(widget => (
          <div
            key={widget.id}
            onMouseDown={(e) => startDrag(e, widget)}
            style={{
              position: "absolute",
              left: widget.x,
              top: widget.y,
              width: widget.width,
              height: widget.height,
              background: "white",
              border: selectedWidget === widget.id ? "2px solid #2196F3" : "1px solid #ddd",
              borderRadius: "8px",
              cursor: "move",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <div style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0
            }}>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>Widget {widget.id}</span>
              <button
                onClick={() => deleteWidget(widget.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#999",
                  cursor: "pointer",
                  fontSize: "18px"
                }}
              >
                ×
              </button>
            </div>

            <div 
              style={{
                flex: 1,
                overflow: "auto",
                padding: "10px"
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {widget.content}
            </div>

            <div
              onMouseDown={(e) => startResize(e, widget)}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: "20px",
                height: "20px",
                cursor: "nwse-resize",
                background: "linear-gradient(135deg, transparent 50%, #2196F3 50%)"
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}