"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { PrintSettingsModal } from "@/components/print-settings-modal"
import { MapPin, Tag, Calendar, FileText, Printer } from "lucide-react"
import type { Document } from "@/app/page"

interface DocumentDetailsProps {
  document: Document
  onUpdateDocument: (document: Document) => void
  onAddToPrintQueue: (document: Document) => void
}

export function DocumentDetails({ document, onUpdateDocument, onAddToPrintQueue }: DocumentDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDocument, setEditedDocument] = useState(document)
  const [showPrintSettings, setShowPrintSettings] = useState(false)
  const [newTag, setNewTag] = useState("")

  const handleSave = () => {
    onUpdateDocument(editedDocument)
    setIsEditing(false)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editedDocument.tags.includes(newTag.trim())) {
      setEditedDocument({
        ...editedDocument,
        tags: [...editedDocument.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedDocument({
      ...editedDocument,
      tags: editedDocument.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handlePrintWithSettings = (settings: any) => {
    const documentWithSettings = {
      ...document,
      printSettings: settings,
    }
    onAddToPrintQueue(documentWithSettings)
    setShowPrintSettings(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Preview */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {document.type.startsWith("image/") ? (
              <img
                src={document.url || "/placeholder.svg"}
                alt={document.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Document Info */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">File Name</Label>
              {isEditing ? (
                <Input
                  value={editedDocument.name}
                  onChange={(e) => setEditedDocument({ ...editedDocument, name: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{document.name}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              {isEditing ? (
                <Textarea
                  value={editedDocument.description}
                  onChange={(e) => setEditedDocument({ ...editedDocument, description: e.target.value })}
                  placeholder="Add description..."
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{document.description || "No description"}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Location</Label>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <Input
                    value={editedDocument.location || ""}
                    onChange={(e) => setEditedDocument({ ...editedDocument, location: e.target.value })}
                    placeholder="Add location..."
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{document.location || "No location"}</p>
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {editedDocument.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                    {isEditing && (
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-red-500">
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="text-xs"
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <Calendar className="h-4 w-4 inline mr-1" />
                {document.uploadDate.toLocaleDateString()}
              </div>
              <div>{formatFileSize(document.size)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  Edit
                </Button>
                <Button onClick={() => setShowPrintSettings(true)} size="sm">
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <PrintSettingsModal
        isOpen={showPrintSettings}
        onClose={() => setShowPrintSettings(false)}
        onPrint={handlePrintWithSettings}
        document={document}
      />
    </>
  )
}
