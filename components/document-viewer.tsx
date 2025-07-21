"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Move, Maximize, Minimize } from "lucide-react"
import type { Document } from "@/app/page"

interface DocumentViewerProps {
  document: Document
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showMiniMap, setShowMiniMap] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 500))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))
  const handleRotateRight = () => setRotation((prev) => (prev + 90) % 360)
  const handleRotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360)
  const handleReset = () => {
    setZoom(100)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    document.addEventListener("mouseup", handleGlobalMouseUp)
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Viewer */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Document Viewer - {document.name}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowMiniMap(!showMiniMap)}>
                  {showMiniMap ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  Mini Map
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={25}
                    max={500}
                    step={25}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{zoom}%</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRotateLeft}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRotateRight}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>

            {/* Viewer Area */}
            <div
              ref={viewerRef}
              className="relative bg-gray-100 rounded-lg overflow-hidden"
              style={{ height: "600px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {document.type.startsWith("image/") ? (
                <img
                  ref={imageRef}
                  src={document.url || "/placeholder.svg"}
                  alt={document.name}
                  className={`absolute transition-transform ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                  draggable={false}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-gray-600">PDF Preview</p>
                    <p className="text-sm text-gray-500 mt-2">Full PDF viewer coming soon</p>
                  </div>
                </div>
              )}

              {/* Pan Indicator */}
              {isDragging && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  <Move className="h-4 w-4 inline mr-1" />
                  Panning
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mini Map & Controls */}
      <div className="space-y-4">
        {showMiniMap && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Mini Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded aspect-square overflow-hidden">
                {document.type.startsWith("image/") ? (
                  <img
                    src={document.url || "/placeholder.svg"}
                    alt="Mini map"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-2xl">📄</div>
                  </div>
                )}
                {/* Viewport indicator */}
                <div
                  className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                  style={{
                    width: `${Math.min(100 / (zoom / 100), 100)}%`,
                    height: `${Math.min(100 / (zoom / 100), 100)}%`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">View Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Zoom:</span>
              <span>{zoom}%</span>
            </div>
            <div className="flex justify-between">
              <span>Rotation:</span>
              <span>{rotation}°</span>
            </div>
            <div className="flex justify-between">
              <span>Position:</span>
              <span>
                ({position.x}, {position.y})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
