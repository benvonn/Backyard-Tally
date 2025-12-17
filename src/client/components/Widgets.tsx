// Widgets.tsx (Using Pointer Events - Corrected Types)
import React, { useState, useRef, useEffect } from "react";

interface Widget {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  component: string; // Store component name as string
  title: string;
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

interface WidgetDefinition {
  id: string;
  component: React.ComponentType; // Component type
  name: string;
  componentId: string; // Unique identifier for the component
}

const GRID_SIZE = 1; // Smooth movement
const COLS = 40;
const ROWS = 30;

interface DraggableWidgetBoardProps {
  availableWidgets: WidgetDefinition[];
}

export default function DraggableWidgetBoard({ availableWidgets }: DraggableWidgetBoardProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<number | null>(null);
  const dragRef = useRef<DragRef | null>(null);
  const resizeRef = useRef<ResizeRef | null>(null);
  // No need for isTouchActive ref with Pointer Events

  // Load widgets from localStorage on mount
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      try {
        const parsedWidgets = JSON.parse(savedWidgets);
        // Filter out any null/undefined widgets
        const validWidgets = parsedWidgets.filter((w: any) => w && typeof w.id === 'number');
        setWidgets(validWidgets);
      } catch (e) {
        console.error("Failed to parse saved widgets", e);
      }
    }
  }, []);

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const snapToGrid = (value: number): number => value;

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

  const addWidget = (widgetType: string) => {
    const widgetDef = availableWidgets.find(w => w.id === widgetType);
    if (!widgetDef) return;

    const width = 300;
    const height = 200;
    const { x, y } = findEmptySpace(width, height);
    
    const newWidget: Widget = {
      id: Date.now(),
      x,
      y,
      width,
      height,
      component: widgetDef.componentId,
      title: widgetDef.name
    };
    setWidgets(prevWidgets => [...prevWidgets, newWidget]);
  };

  // Generic function to get coordinates from PointerEvent
  const getCoords = (e: React.PointerEvent | PointerEvent) => {
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const startDrag = (e: React.PointerEvent, widget: Widget) => {
    if (resizeRef.current) return;
    
    e.preventDefault(); // Prevent default browser actions like text selection
    // Set the element to capture subsequent pointer events (important for touch)
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const { clientX, clientY } = getCoords(e);
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: widget.id,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
      originalX: widget.x,
      originalY: widget.y
    };
    setSelectedWidget(widget.id);
  };

  const startResize = (e: React.PointerEvent, widget: Widget) => {
    e.preventDefault();
    e.stopPropagation();
    // Set the element to capture subsequent pointer events (important for touch)
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const { clientX, clientY } = getCoords(e);
    
    resizeRef.current = {
      id: widget.id,
      startX: clientX,
      startY: clientY,
      startWidth: widget.width,
      startHeight: widget.height
    };
    setSelectedWidget(widget.id);
  };

  // Corrected type annotations for handleMove and handleEnd
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => { // Specify HTMLDivElement type
    if (dragRef.current) {
      const { clientX, clientY } = getCoords(e);
      
      const boardRect = (e.target as HTMLElement).getBoundingClientRect();
      const rawX = clientX - boardRect.left - dragRef.current.offsetX;
      const rawY = clientY - boardRect.top - dragRef.current.offsetY;
      
      const snappedX = Math.max(0, rawX);
      const snappedY = Math.max(0, rawY);

      const widget = widgets.find(w => w.id === dragRef.current!.id);
      if (widget && !checkCollision(snappedX, snappedY, widget.width, widget.height, dragRef.current.id)) {
        setWidgets(prevWidgets => prevWidgets.map(w => 
          w.id === dragRef.current!.id
            ? { ...w, x: snappedX, y: snappedY }
            : w
        ));
      }
    }

    if (resizeRef.current) {
      const { clientX, clientY } = getCoords(e);
      
      const deltaX = clientX - resizeRef.current.startX;
      const deltaY = clientY - resizeRef.current.startY;

      const newWidth = Math.max(150, resizeRef.current.startWidth + deltaX);
      const newHeight = Math.max(100, resizeRef.current.startHeight + deltaY);

      const widget = widgets.find(w => w.id === resizeRef.current!.id);
      if (widget && !checkCollision(widget.x, widget.y, newWidth, newHeight, resizeRef.current.id)) {
        setWidgets(prevWidgets => prevWidgets.map(w =>
          w.id === resizeRef.current!.id
            ? { ...w, width: newWidth, height: newHeight }
            : w
        ));
      }
    }
  };

  const handleEnd = (e: React.PointerEvent<HTMLDivElement>) => { // Specify HTMLDivElement type
    // Release the pointer capture if it was set
    if (e.target instanceof Element) {
        e.target.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    resizeRef.current = null;
  };

  const deleteWidget = (id: number) => {
    setWidgets(prevWidgets => prevWidgets.filter(w => w.id !== id));
    if (selectedWidget === id) {
      setSelectedWidget(null);
    }
  };

  // Component registry
  const componentRegistry: Record<string, React.ComponentType | null> = {};
  availableWidgets.forEach(widget => {
    componentRegistry[widget.componentId] = widget.component;
  });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{
        width: "200px",
        background: "#f5f5f5",
        padding: "20px",
        borderRight: "1px solid #ddd"
      }}>
        <h3>Widgets</h3>
        <select
          onChange={(e) => addWidget(e.target.value)}
          value=""
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          }}
        >
          <option value="" disabled>Add a new widget...</option>
          {availableWidgets.map(widget => (
            <option key={widget.id} value={widget.id}>
              {widget.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#fafafa",
          backgroundImage: "none"
        }}
        // Use pointer events on the main container
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerLeave={handleEnd} // Handles pointer leaving the element (like mouse leaving or lifting finger outside)
        // Note: onPointerCancel might also be useful for touch interruptions
        onPointerCancel={handleEnd}
      >
        {widgets
          .filter(widget => widget && typeof widget.id === 'number') // Filter out invalid widgets
          .map(widget => {
            const ComponentToRender = componentRegistry[widget.component];
            return (
              <div
                key={widget.id}
                onPointerDown={(e) => startDrag(e, widget)} // Listen for pointer down on widget header
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
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>{widget.title}</span>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      fontSize: "18px"
                    }}
                    // Prevent the delete button from capturing pointer events intended for the widget
                    onPointerDown={(e) => e.stopPropagation()}
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
                  // Prevent interaction inside the widget content from interfering
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {ComponentToRender ? <ComponentToRender /> : <div>Component not found</div>}
                </div>

                <div
                  onPointerDown={(e) => startResize(e, widget)} // Listen for pointer down on resize handle
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
            );
          })}
      </div>
    </div>
  );
}