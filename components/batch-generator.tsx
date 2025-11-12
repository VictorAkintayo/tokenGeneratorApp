"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Sparkles, Trash2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BatchGeneratorProps {
  generationType: "token" | "password" | "secret"
  generateFunction: () => string
}

export function BatchGenerator({ generationType, generateFunction }: BatchGeneratorProps) {
  const [batchSize, setBatchSize] = useState(10)
  const [generatedBatch, setGeneratedBatch] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const handleBatchGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const batch: string[] = []
      for (let i = 0; i < batchSize; i++) {
        batch.push(generateFunction())
      }
      setGeneratedBatch(batch)
      setIsGenerating(false)
      toast({
        title: "Batch generated",
        description: `Generated ${batchSize} ${generationType}s`,
      })
    }, 500)
  }

  const handleCopy = async (value: string, index: number) => {
    await navigator.clipboard.writeText(value)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = async () => {
    const text = generatedBatch.join("\n")
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied all",
      description: `${generatedBatch.length} items copied to clipboard`,
    })
  }

  const handleExport = () => {
    const text = generatedBatch.join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `genera8-batch-${generationType}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Exported",
      description: "Batch exported successfully",
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="batch-size">Batch Size</Label>
            <Input
              id="batch-size"
              type="number"
              min={1}
              max={100}
              value={batchSize}
              onChange={(e) => setBatchSize(Math.min(100, Math.max(1, Number.parseInt(e.target.value) || 1)))}
            />
          </div>
          <Button onClick={handleBatchGenerate} disabled={isGenerating} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Batch"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Generate multiple items at once (max 100)</p>
      </div>

      {generatedBatch.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{generatedBatch.length} items generated</Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-2 bg-transparent">
                <Copy className="h-3 w-3" />
                Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 bg-transparent">
                <Download className="h-3 w-3" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setGeneratedBatch([])} className="gap-2">
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px] rounded-lg border border-border/40 p-3">
            <div className="space-y-2">
              {generatedBatch.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-xs text-muted-foreground w-8">{index + 1}.</span>
                  <code className="flex-1 text-xs font-mono truncate">{value}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(value, index)}
                    className="h-7 w-7 p-0 flex-shrink-0"
                  >
                    {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  )
}
