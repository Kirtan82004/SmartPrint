"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Wifi, WifiOff, RefreshCw } from "lucide-react"

interface PrinterInfo {
  id: string
  name: string
  status: "online" | "offline" | "busy"
  type: "local" | "network"
  location?: string
  paperSizes: string[]
  colorSupport: boolean
}

export function PrinterManager() {
  const [printers, setPrinters] = useState<PrinterInfo[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    scanForPrinters()
  }, [])

  const scanForPrinters = async () => {
    setIsScanning(true)

    try {
      // Try to get printers using Web Printing API (experimental)
      if ("navigator" in window && "printing" in navigator) {
        // @ts-ignore
        const systemPrinters = await navigator.printing.getPrinters()
        const formattedPrinters: PrinterInfo[] = systemPrinters.map((printer: any) => ({
          id: printer.id,
          name: printer.name,
          status: printer.status || "online",
          type: printer.isNetworkPrinter ? "network" : "local",
          location: printer.location,
          paperSizes: printer.supportedSizes || ["A4", "Letter"],
          colorSupport: printer.colorSupport !== false,
        }))
        setPrinters(formattedPrinters)
      } else {
        // Fallback: Mock common printers for demo
        const mockPrinters: PrinterInfo[] = [
          {
            id: "default",
            name: "Default System Printer",
            status: "online",
            type: "local",
            paperSizes: ["A4", "A3", "Letter", "Legal"],
            colorSupport: true,
          },
          {
            id: "hp-laserjet",
            name: "HP LaserJet Pro M404n",
            status: "online",
            type: "network",
            location: "Office Floor 2",
            paperSizes: ["A4", "Letter", "Legal"],
            colorSupport: false,
          },
          {
            id: "canon-pixma",
            name: "Canon PIXMA G6020",
            status: "online",
            type: "local",
            paperSizes: ["A4", "A3", "Letter", "Photo"],
            colorSupport: true,
          },
        ]
        setPrinters(mockPrinters)
      }

      if (printers.length > 0 && !selectedPrinter) {
        setSelectedPrinter(printers[0].id)
      }
    } catch (error) {
      console.error("Failed to scan printers:", error)
      // Set default printer as fallback
      setPrinters([
        {
          id: "default",
          name: "Default System Printer",
          status: "online",
          type: "local",
          paperSizes: ["A4", "Letter"],
          colorSupport: true,
        },
      ])
    }

    setIsScanning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "busy":
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <Printer className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "offline":
        return "bg-red-100 text-red-800"
      case "busy":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const testPrint = async (printerId: string) => {
    const printer = printers.find((p) => p.id === printerId)
    if (!printer) return

    // Create test page
    const testWindow = window.open("", "_blank")
    if (!testWindow) {
      alert("Please allow popups to test print")
      return
    }

    const testHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Printer Test Page</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .test-header { text-align: center; margin-bottom: 30px; }
          .test-info { margin: 20px 0; }
          .color-test { display: flex; gap: 10px; margin: 20px 0; }
          .color-box { width: 50px; height: 50px; border: 1px solid #000; }
          @media print { @page { margin: 1cm; } }
        </style>
      </head>
      <body>
        <div class="test-header">
          <h1>🖨️ Printer Test Page</h1>
          <h2>${printer.name}</h2>
        </div>
        
        <div class="test-info">
          <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Printer Type:</strong> ${printer.type}</p>
          <p><strong>Status:</strong> ${printer.status}</p>
          ${printer.location ? `<p><strong>Location:</strong> ${printer.location}</p>` : ""}
        </div>

        <div class="color-test">
          <p><strong>Color Test:</strong></p>
          <div class="color-box" style="background: red;"></div>
          <div class="color-box" style="background: green;"></div>
          <div class="color-box" style="background: blue;"></div>
          <div class="color-box" style="background: yellow;"></div>
        </div>

        <p>If you can see this page clearly with proper colors and formatting, your printer is working correctly!</p>
      </body>
      </html>
    `

    testWindow.document.write(testHTML)
    testWindow.document.close()
    testWindow.focus()
    testWindow.print()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Printer Management
          </span>
          <Button variant="outline" size="sm" onClick={scanForPrinters} disabled={isScanning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Scanning..." : "Refresh"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Default Printer Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Printer:</label>
          <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
            <SelectTrigger>
              <SelectValue placeholder="Select default printer..." />
            </SelectTrigger>
            <SelectContent>
              {printers.map((printer) => (
                <SelectItem key={printer.id} value={printer.id}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(printer.status)}
                    {printer.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Printer List */}
        <div className="space-y-3">
          <h4 className="font-medium">Available Printers:</h4>
          {printers.map((printer) => (
            <div key={printer.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Printer className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{printer.name}</p>
                    {printer.location && <p className="text-sm text-gray-500">{printer.location}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(printer.status)}>
                    {getStatusIcon(printer.status)}
                    <span className="ml-1 capitalize">{printer.status}</span>
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => testPrint(printer.id)}>
                    Test Print
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Type:</span> {printer.type}
                </div>
                <div>
                  <span className="font-medium">Color:</span> {printer.colorSupport ? "Yes" : "No"}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Paper Sizes:</span> {printer.paperSizes.join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>

        {printers.length === 0 && !isScanning && (
          <div className="text-center py-6 text-gray-500">
            <Printer className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No printers found. Make sure your printer is connected and try refreshing.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
