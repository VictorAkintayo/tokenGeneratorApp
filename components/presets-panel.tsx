"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Bookmark, Hash, Key, Shield, Plus, Check } from "lucide-react"
import { type ConfigPreset, StorageManager } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface PresetsPanelProps {
  currentConfig: {
    type: "token" | "password" | "secret"
    config: Record<string, any>
  }
  onLoadPreset?: (preset: ConfigPreset) => void
}

export function PresetsPanel({ currentConfig, onLoadPreset }: PresetsPanelProps) {
  const [presets, setPresets] = useState<ConfigPreset[]>(StorageManager.getPresets())
  const [presetName, setPresetName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const refreshPresets = () => {
    setPresets(StorageManager.getPresets())
  }

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a preset name",
        variant: "destructive",
      })
      return
    }

    StorageManager.savePreset({
      name: presetName,
      type: currentConfig.type,
      config: currentConfig.config,
    })
    refreshPresets()
    setPresetName("")
    setDialogOpen(false)
    toast({
      title: "Preset saved",
      description: `"${presetName}" has been saved`,
    })
  }

  const handleDeletePreset = (id: string, name: string) => {
    StorageManager.deletePreset(id)
    refreshPresets()
    toast({
      title: "Preset deleted",
      description: `"${name}" has been removed`,
    })
  }

  const handleLoadPreset = (preset: ConfigPreset) => {
    onLoadPreset?.(preset)
    toast({
      title: "Preset loaded",
      description: `"${preset.name}" configuration applied`,
    })
  }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Presets</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Configuration Preset</DialogTitle>
              <DialogDescription>Save your current settings for quick access later</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  placeholder="e.g., Strong Password Config"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSavePreset()
                    }
                  }}
                />
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {currentConfig.type}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Object.entries(currentConfig.config).map(([key, value]) => (
                    <div key={key}>
                      {key}: {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePreset} className="gap-2">
                <Check className="h-4 w-4" />
                Save Preset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {presets.length === 0 ? (
          <Card className="p-8 text-center">
            <Bookmark className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">No saved presets yet</p>
            <p className="text-xs text-muted-foreground">
              Configure your desired settings and click "Save Current" to create a preset
            </p>
          </Card>
        ) : (
          presets.map((preset) => {
            const Icon = getIcon(preset.type)
            return (
              <Card key={preset.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{preset.name}</h4>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {preset.type}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleLoadPreset(preset)} className="h-8 px-2">
                          Load
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePreset(preset.id, preset.name)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
