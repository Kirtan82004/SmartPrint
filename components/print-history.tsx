"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, Download, RotateCcw, Filter } from "lucide-react"
import type { Document } from "@/app/page"

interface PrintHistoryProps {
  history: Document[]
}

export function PrintHistory({ history }: PrintHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredHistory = history.filter((document) => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || document.status === statusFilter
    // For demo purposes, we'll just use the upload date
    const matchesDate = dateFilter === "all" // Simplified for demo

    return matchesSearch && matchesStatus && matchesDate
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "printed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Document Name", "Size", "Print Date", "Status", "Copies", "Paper Size"].join(","),
      ...filteredHistory.map((doc) =>
        [
          doc.name,
          formatFileSize(doc.size),
          doc.uploadDate.toLocaleDateString(),
          doc.status,
          doc.printSettings?.copies || 1,
          doc.printSettings?.paperSize || "A4",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "print-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Print History</h3>
          <p className="text-gray-500">Your print history will appear here once you start printing documents.</p>
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
              <Calendar className="h-5 w-5" />
              Print History ({filteredHistory.length} items)
            </span>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="printed">Printed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {filteredHistory.map((document) => (
              <div
                key={`${document.id}-${document.uploadDate.getTime()}`}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium">{document.name}</h4>
                      <Badge className={getStatusColor(document.status)}>{document.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Size:</span> {formatFileSize(document.size)}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {document.uploadDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Copies:</span> {document.printSettings?.copies || 1}
                      </div>
                      <div>
                        <span className="font-medium">Paper:</span> {document.printSettings?.paperSize || "A4"}
                      </div>
                    </div>

                    {document.printSettings && (
                      <div className="mt-2 text-xs text-gray-500">
                        {document.printSettings.layout} • {document.printSettings.colorMode} •{" "}
                        {document.printSettings.dpi} DPI
                        {document.printSettings.duplex && " • Duplex"}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reprint
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No documents match your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
