"use client"

import { useState } from "react"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentViewer } from "@/components/document-viewer"
import { DocumentDetails } from "@/components/document-details"
import { PrintQueue } from "@/components/print-queue"
import { PrintHistory } from "@/components/print-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Printer, History, TicketIcon as Queue, Upload, Settings, HelpCircle } from "lucide-react"
// Add import for PrinterManager
import { PrinterManager } from "@/components/printer-manager"
import { PrinterSetupGuide } from "@/components/printer-setup-guide"

export interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadDate: Date
  tags: string[]
  description: string
  location?: string
  status: "uploaded" | "printing" | "printed" | "failed"
  printSettings?: PrintSettings
}

export interface PrintSettings {
  pageRange: "all" | "custom"
  customPages?: string
  layout: "portrait" | "landscape"
  colorMode: "color" | "blackwhite"
  copies: number
  paperSize: "A4" | "A3" | "Letter" | "Legal"
  duplex: boolean
  dpi: number
}

export default function DocumentPrinterApp() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [printQueue, setPrintQueue] = useState<Document[]>([])
  const [printHistory, setPrintHistory] = useState<Document[]>([])

  const handleDocumentUpload = (newDocuments: Document[]) => {
    setDocuments((prev) => [...prev, ...newDocuments])
  }

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document)
  }

  const handleAddToPrintQueue = (document: Document) => {
    setPrintQueue((prev) => [...prev, document])
    setDocuments((prev) => prev.map((doc) => (doc.id === document.id ? { ...doc, status: "printing" as const } : doc)))
  }

  const handlePrintComplete = (document: Document) => {
    setPrintHistory((prev) => [...prev, { ...document, status: "printed" }])
    setPrintQueue((prev) => prev.filter((doc) => doc.id !== document.id))
    setDocuments((prev) => prev.map((doc) => (doc.id === document.id ? { ...doc, status: "printed" as const } : doc)))
  }

  const handleUpdateDocument = (updatedDocument: Document) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === updatedDocument.id ? updatedDocument : doc)))
    if (selectedDocument?.id === updatedDocument.id) {
      setSelectedDocument(updatedDocument)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Printer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SmartPrint</h1>
                <p className="text-sm text-gray-500">Professional Document Printing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          {/* Add a new tab for printer management in the TabsList: */}
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Queue className="h-4 w-4" />
              Queue ({printQueue.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="viewer" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Viewer
            </TabsTrigger>
            <TabsTrigger value="printers" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Printers
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DocumentUpload
                  onDocumentUpload={handleDocumentUpload}
                  documents={documents}
                  onDocumentSelect={handleDocumentSelect}
                />
              </div>
              <div>
                {selectedDocument && (
                  <DocumentDetails
                    document={selectedDocument}
                    onUpdateDocument={handleUpdateDocument}
                    onAddToPrintQueue={handleAddToPrintQueue}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue">
            <PrintQueue
              queue={printQueue}
              onPrintComplete={handlePrintComplete}
              onRemoveFromQueue={(docId) => setPrintQueue((prev) => prev.filter((doc) => doc.id !== docId))}
            />
          </TabsContent>

          <TabsContent value="history">
            <PrintHistory history={printHistory} />
          </TabsContent>

          <TabsContent value="viewer">
            {selectedDocument ? (
              <DocumentViewer document={selectedDocument} />
            ) : (
              <div className="text-center py-12">
                <Printer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                <p className="text-gray-500">Select a document from the upload tab to view it here.</p>
              </div>
            )}
          </TabsContent>

          {/* Add the new TabsContent for printers: */}
          <TabsContent value="printers">
            <PrinterManager />
          </TabsContent>

          {/* Add the new TabsContent for setup: */}
          <TabsContent value="setup">
            <PrinterSetupGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
