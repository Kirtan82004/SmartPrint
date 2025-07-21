"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Printer, Play, X, RotateCcw, Clock, CheckCircle } from "lucide-react"
import type { Document } from "@/app/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PrintQueueProps {
  queue: Document[]
  onPrintComplete: (document: Document) => void
  onRemoveFromQueue: (documentId: string) => void
}

export function PrintQueue({ queue, onPrintComplete, onRemoveFromQueue }: PrintQueueProps) {
  const [printingStates, setPrintingStates] = useState<{ [key: string]: { progress: number; status: string } }>({})
  const [availablePrinters, setAvailablePrinters] = useState<any[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<string>("")

  // Add this useEffect to get available printers
  useEffect(() => {
    // Get available printers (modern browsers)
    if ("navigator" in window && "printing" in navigator) {
      // @ts-ignore - Web Printing API (experimental)
      navigator.printing
        .getPrinters()
        .then((printers: any[]) => {
          setAvailablePrinters(printers)
          if (printers.length > 0) {
            setSelectedPrinter(printers[0].id)
          }
        })
        .catch(() => {
          // Fallback to default system printer
          setAvailablePrinters([{ id: "default", name: "Default System Printer" }])
          setSelectedPrinter("default")
        })
    } else {
      // Fallback for browsers without Web Printing API
      setAvailablePrinters([{ id: "default", name: "Default System Printer" }])
      setSelectedPrinter("default")
    }
  }, [])

  // Replace simulatePrint function with actual printing
  const actualPrint = async (document: Document) => {
    const docId = document.id
    setPrintingStates((prev) => ({
      ...prev,
      [docId]: { progress: 0, status: "preparing" },
    }))

    try {
      // Step 1: Prepare print content
      setPrintingStates((prev) => ({
        ...prev,
        [docId]: { progress: 20, status: "preparing" },
      }))

      // Create print window with document
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        throw new Error("Popup blocked - please allow popups for printing")
      }

      // Step 2: Generate print-ready HTML
      const printHTML = generatePrintHTML(document)
      printWindow.document.write(printHTML)
      printWindow.document.close()

      setPrintingStates((prev) => ({
        ...prev,
        [docId]: { progress: 50, status: "sending to printer" },
      }))

      // Step 3: Apply print settings
      if (document.printSettings) {
        // Set print media query styles
        const mediaQuery = `@media print {
          @page {
            size: ${document.printSettings.paperSize.toLowerCase()};
            orientation: ${document.printSettings.layout};
            margin: 1cm;
          }
          body {
            ${document.printSettings.colorMode === "blackwhite" ? "filter: grayscale(100%);" : ""}
          }
        }`

        const style = printWindow.document.createElement("style")
        style.textContent = mediaQuery
        printWindow.document.head.appendChild(style)
      }

      setPrintingStates((prev) => ({
        ...prev,
        [docId]: { progress: 80, status: "printing" },
      }))

      // Step 4: Trigger actual print
      printWindow.focus()

      // Handle multiple copies
      const copies = document.printSettings?.copies || 1
      for (let i = 0; i < copies; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay between copies
        printWindow.print()
      }

      // Step 5: Monitor print completion
      printWindow.addEventListener("afterprint", () => {
        setPrintingStates((prev) => ({
          ...prev,
          [docId]: { progress: 100, status: "completed" },
        }))

        setTimeout(() => {
          onPrintComplete(document)
          printWindow.close()
          setPrintingStates((prev) => {
            const newState = { ...prev }
            delete newState[docId]
            return newState
          })
        }, 1000)
      })

      // Handle print cancellation
      printWindow.addEventListener("beforeunload", () => {
        setPrintingStates((prev) => {
          const newState = { ...prev }
          delete newState[docId]
          return newState
        })
      })
    } catch (error) {
      console.error("Print error:", error)
      setPrintingStates((prev) => ({
        ...prev,
        [docId]: { progress: 0, status: "failed" },
      }))

      // Show error message
      alert(`Print failed: ${error.message}`)
    }
  }

  // Add this helper function to generate print-ready HTML
  const generatePrintHTML = (document: Document) => {
    const settings = document.printSettings

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print: ${document.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            background: white;
            ${settings?.colorMode === "blackwhite" ? "filter: grayscale(100%);" : ""}
          }
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            border-bottom: 1px solid #ccc;
          }
          .document-content {
            width: 100%;
            height: auto;
            text-align: center;
          }
          .document-content img {
            max-width: 100%;
            height: auto;
            ${settings?.layout === "landscape" ? "max-height: 80vh;" : "max-height: 90vh;"}
          }
          .print-footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #666;
            padding: 10px;
          }
          @media print {
            @page {
              size: ${settings?.paperSize.toLowerCase() || "a4"};
              orientation: ${settings?.layout || "portrait"};
              margin: ${settings?.paperSize === "A3" ? "1.5cm" : "1cm"};
            }
            body { print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h2>${document.name}</h2>
          <p>Printed on: ${new Date().toLocaleString()}</p>
          ${document.description ? `<p>${document.description}</p>` : ""}
        </div>
        
        <div class="document-content">
          ${
            document.type.startsWith("image/")
              ? `<img src="${document.url}" alt="${document.name}" />`
              : `<iframe src="${document.url}" width="100%" height="600px"></iframe>`
          }
        </div>
        
        <div class="print-footer">
          <p>SmartPrint - Professional Document Printing | Page 1 of 1</p>
          ${document.location ? `<p>Location: ${document.location}</p>` : ""}
        </div>
      </body>
      </html>
    `
  }

  const getStatusIcon = (document: Document) => {
    const state = printingStates[document.id]
    if (!state) return <Clock className="h-4 w-4" />

    switch (state.status) {
      case "preparing":
        return <RotateCcw className="h-4 w-4 animate-spin" />
      case "printing":
        return <Printer className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (document: Document) => {
    const state = printingStates[document.id]
    if (!state) return "bg-yellow-100 text-yellow-800"

    switch (state.status) {
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "printing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (queue.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Printer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Print Queue Empty</h3>
          <p className="text-gray-500">Add documents to the print queue to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Queue ({queue.length} items)
            </span>
            <Button
              onClick={() => queue.forEach((doc) => actualPrint(doc))}
              disabled={Object.keys(printingStates).length > 0}
            >
              <Play className="h-4 w-4 mr-2" />
              Print All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Printer Selection */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Selected Printer:</span>
              </div>
              <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select printer..." />
                </SelectTrigger>
                <SelectContent>
                  {availablePrinters.map((printer) => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            {queue.map((document, index) => {
              const state = printingStates[document.id]
              return (
                <div key={document.id} className="border rounded-lg p-4 space-y-3">
                  {/* Document Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(document.size)} • {document.printSettings?.copies || 1} copies
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(document)}>
                        {getStatusIcon(document)}
                        <span className="ml-1">{state?.status || "pending"}</span>
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveFromQueue(document.id)}
                        disabled={!!state}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Print Settings Summary */}
                  {document.printSettings && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                      <div>
                        <span className="font-medium">Paper:</span> {document.printSettings.paperSize}
                      </div>
                      <div>
                        <span className="font-medium">Layout:</span> {document.printSettings.layout}
                      </div>
                      <div>
                        <span className="font-medium">Color:</span> {document.printSettings.colorMode}
                      </div>
                      <div>
                        <span className="font-medium">Quality:</span> {document.printSettings.dpi} DPI
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {state && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{state.status}...</span>
                        <span>{state.progress}%</span>
                      </div>
                      <Progress value={state.progress} className="w-full" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2">
                    {!state && (
                      <Button size="sm" onClick={() => actualPrint(document)}>
                        <Play className="h-4 w-4 mr-1" />
                        Start Print
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
