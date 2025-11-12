"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Copy, Trash2, Star, Clock, Hash, Key, Shield, Search, Download, FileDown, AlertCircle } from "lucide-react"
import { type GenerationHistory, StorageManager } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HistoryPanelProps {
  onSelectItem?: (item: GenerationHistory) => void
}

export function HistoryPanel({ onSelectItem }: HistoryPanelProps) {
  const [history, setHistory] = useState<GenerationHistory[]>(StorageManager.getHistory())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "token" | "password" | "secret" | "favorites">("all")
  const { toast } = useToast()

  const refreshHistory = () => {
    setHistory(StorageManager.getHistory())
  }

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast({
      title: "Copied to clipboard",
      description: "Value copied successfully",
    })
  }

  const handleDelete = (id: string) => {
    StorageManager.deleteHistoryItem(id)
    refreshHistory()
    toast({
      title: "Deleted",
      description: "Item removed from history",
    })
  }

  const handleToggleFavorite = (id: string) => {
    StorageManager.toggleFavorite(id)
    refreshHistory()
  }

  const handleClearAll = () => {
    StorageManager.clearHistory()
    refreshHistory()
    toast({
      title: "History cleared",
      description: "All items have been removed",
    })
  }

  const handleExportHistory = () => {
    const data = JSON.stringify(history, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `genera8-history-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Exported",
      description: "History exported successfully",
    })
  }

  const handleExportCSV = () => {
    const csv = [
      ["Type", "Value", "Date", "Label"].join(","),
      ...history.map((item) =>
        [item.type, `"${item.value}"`, new Date(item.timestamp).toISOString(), `"${item.label || ""}"`].join(","),
      ),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `genera8-history-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Exported",
      description: "History exported as CSV",
    })
  }

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.label?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesFilter =
      filterType === "all" ||
      (filterType === "favorites" && item.favorite) ||
      (filterType !== "favorites" && item.type === filterType)
    return matchesSearch && matchesFilter
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "token":
        return Hash
      case "password":
        return Key
      case "secret":
        return Shield
      default:
        return Hash
    }
  }

  const isExpired = (expiresAt?: number) => {
    return expiresAt && expiresAt < Date.now()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportHistory} className="gap-2 bg-transparent">
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">JSON</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filterType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("all")}
          className="whitespace-nowrap"
        >
          All
        </Button>
        <Button
          variant={filterType === "favorites" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("favorites")}
          className="gap-2 whitespace-nowrap"
        >
          <Star className="h-3 w-3" />
          Favorites
        </Button>
        <Button
          variant={filterType === "token" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("token")}
          className="whitespace-nowrap"
        >
          Tokens
        </Button>
        <Button
          variant={filterType === "password" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("password")}
          className="whitespace-nowrap"
        >
          Passwords
        </Button>
        <Button
          variant={filterType === "secret" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("secret")}
          className="whitespace-nowrap"
        >
          Secrets
        </Button>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No history items found</p>
          </Card>
        ) : (
          filteredHistory.map((item) => {
            const Icon = getIcon(item.type)
            const expired = isExpired(item.expiresAt)
            return (
              <Card key={item.id} className={`p-4 ${expired ? "opacity-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="capitalize">
                          {item.type}
                        </Badge>
                        {item.label && <span className="text-xs text-muted-foreground">{item.label}</span>}
                        {expired && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Expired
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Star className={`h-4 w-4 ${item.favorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(item.value)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded block truncate">{item.value}</code>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </span>
                      {item.expiresAt && !expired && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            Expires {formatDistanceToNow(item.expiresAt, { addSuffix: true })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {history.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <Trash2 className="h-4 w-4" />
              Clear All History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all history?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your generation history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll}>Clear All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
