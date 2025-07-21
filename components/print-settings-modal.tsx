"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Printer, Settings } from "lucide-react"
import type { Document, PrintSettings } from "@/app/page"

interface PrintSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onPrint: (settings: PrintSettings) => void
  document: Document
}

export function PrintSettingsModal({ isOpen, onClose, onPrint, document }: PrintSettingsModalProps) {
  const [settings, setSettings] = useState<PrintSettings>({
    pageRange: "all",
    customPages: "",
    layout: "portrait",
    colorMode: "color",
    copies: 1,
    paperSize: "A4",
    duplex: false,
    dpi: 300,
  })

  const handlePrint = () => {
    onPrint(settings)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Print Settings - {document.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Page Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Page Range</Label>
            <RadioGroup
              value={settings.pageRange}
              onValueChange={(value: "all" | "custom") => setSettings({ ...settings, pageRange: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-pages" />
                <Label htmlFor="all-pages">All Pages</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom-pages" />
                <Label htmlFor="custom-pages">Custom Range</Label>
              </div>
            </RadioGroup>
            {settings.pageRange === "custom" && (
              <Input
                placeholder="e.g., 1-5, 8, 11-13"
                value={settings.customPages}
                onChange={(e) => setSettings({ ...settings, customPages: e.target.value })}
                className="ml-6"
              />
            )}
          </div>

          <Separator />

          {/* Layout & Orientation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Layout</Label>
              <RadioGroup
                value={settings.layout}
                onValueChange={(value: "portrait" | "landscape") => setSettings({ ...settings, layout: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait" id="portrait" />
                  <Label htmlFor="portrait">Portrait</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landscape" id="landscape" />
                  <Label htmlFor="landscape">Landscape</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Color Mode</Label>
              <RadioGroup
                value={settings.colorMode}
                onValueChange={(value: "color" | "blackwhite") => setSettings({ ...settings, colorMode: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="color" id="color" />
                  <Label htmlFor="color">Color</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blackwhite" id="blackwhite" />
                  <Label htmlFor="blackwhite">Black & White</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Separator />

          {/* Paper & Copies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Paper Size</Label>
              <Select
                value={settings.paperSize}
                onValueChange={(value: "A4" | "A3" | "Letter" | "Legal") =>
                  setSettings({ ...settings, paperSize: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                  <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                  <SelectItem value="Legal">Legal (8.5 × 14 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Copies</Label>
              <Input
                type="number"
                min="1"
                max="99"
                value={settings.copies}
                onChange={(e) => setSettings({ ...settings, copies: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <Separator />

          {/* Advanced Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Advanced Options</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplex"
                checked={settings.duplex}
                onCheckedChange={(checked) => setSettings({ ...settings, duplex: checked as boolean })}
              />
              <Label htmlFor="duplex">Double-sided printing (Duplex)</Label>
            </div>

            <div className="space-y-2">
              <Label>Print Quality (DPI)</Label>
              <Select
                value={settings.dpi.toString()}
                onValueChange={(value) => setSettings({ ...settings, dpi: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">Draft (150 DPI)</SelectItem>
                  <SelectItem value="300">Normal (300 DPI)</SelectItem>
                  <SelectItem value="600">High (600 DPI)</SelectItem>
                  <SelectItem value="1200">Best (1200 DPI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-base font-medium mb-3 block">Print Preview</Label>
            <div className="flex items-center justify-center">
              <div
                className={`bg-white border-2 border-gray-300 shadow-sm ${
                  settings.layout === "portrait" ? "w-24 h-32" : "w-32 h-24"
                }`}
              >
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                  {settings.paperSize}
                  <br />
                  {settings.layout}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Add to Print Queue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
