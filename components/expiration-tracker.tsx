"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExpirationTrackerProps {
  onExpirationSet: (expiresAt: number | undefined) => void
}

export function ExpirationTracker({ onExpirationSet }: ExpirationTrackerProps) {
  const [enabled, setEnabled] = useState(false)
  const [duration, setDuration] = useState(24)
  const [unit, setUnit] = useState<"hours" | "days" | "weeks">("hours")
  const [expiresAt, setExpiresAt] = useState<number | undefined>()

  useEffect(() => {
    if (enabled) {
      const multiplier = unit === "hours" ? 1 : unit === "days" ? 24 : 168
      const expiration = Date.now() + duration * multiplier * 60 * 60 * 1000
      setExpiresAt(expiration)
      onExpirationSet(expiration)
    } else {
      setExpiresAt(undefined)
      onExpirationSet(undefined)
    }
  }, [enabled, duration, unit, onExpirationSet])

  const getTimeRemaining = (timestamp: number) => {
    const diff = timestamp - Date.now()
    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`
    return `${hours} hour${hours > 1 ? "s" : ""}`
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <Label className="text-base">Expiration Tracking</Label>
        </div>
        <Button variant={enabled ? "default" : "outline"} size="sm" onClick={() => setEnabled(!enabled)}>
          {enabled ? "Enabled" : "Disabled"}
        </Button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={(v: string) => setUnit(v as any)}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {expiresAt && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Expiration Info</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Expires: {new Date(expiresAt).toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <span>Time remaining:</span>
                  <Badge variant="secondary">{getTimeRemaining(expiresAt)}</Badge>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Generated items will be marked with expiration time in history
          </p>
        </div>
      )}
    </Card>
  )
}
