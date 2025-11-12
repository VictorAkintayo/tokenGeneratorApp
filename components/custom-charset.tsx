"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface CustomCharsetProps {
  onCharsetChange: (charset: string) => void
}

export function CustomCharset({ onCharsetChange }: CustomCharsetProps) {
  const [customChars, setCustomChars] = useState("")
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const buildCharset = () => {
    let charset = ""

    if (customChars) {
      charset = customChars
    } else {
      if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
      if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (includeNumbers) charset += "0123456789"
      if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    }

    if (excludeAmbiguous && !customChars) {
      const ambiguous = /[0OIl1]/g
      charset = charset.replace(ambiguous, "")
    }

    if (!charset) charset = "abcdefghijklmnopqrstuvwxyz"

    onCharsetChange(charset)
    return charset
  }

  const handleApply = () => {
    buildCharset()
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="custom-chars">Custom Character Set</Label>
          <Input
            id="custom-chars"
            placeholder="Enter custom characters (optional)"
            value={customChars}
            onChange={(e) => setCustomChars(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Leave empty to use standard character types below</p>
        </div>

        {!customChars && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between space-x-2 p-2 rounded-lg border border-border/40 bg-muted/20">
                <Label htmlFor="cs-uppercase" className="cursor-pointer text-sm">
                  Uppercase
                </Label>
                <Switch id="cs-uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              </div>
              <div className="flex items-center justify-between space-x-2 p-2 rounded-lg border border-border/40 bg-muted/20">
                <Label htmlFor="cs-lowercase" className="cursor-pointer text-sm">
                  Lowercase
                </Label>
                <Switch id="cs-lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              </div>
              <div className="flex items-center justify-between space-x-2 p-2 rounded-lg border border-border/40 bg-muted/20">
                <Label htmlFor="cs-numbers" className="cursor-pointer text-sm">
                  Numbers
                </Label>
                <Switch id="cs-numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              </div>
              <div className="flex items-center justify-between space-x-2 p-2 rounded-lg border border-border/40 bg-muted/20">
                <Label htmlFor="cs-symbols" className="cursor-pointer text-sm">
                  Symbols
                </Label>
                <Switch id="cs-symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              </div>
            </div>

            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg border border-border/40 bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="exclude-ambiguous" className="cursor-pointer">
                  Exclude Ambiguous Characters
                </Label>
                <p className="text-xs text-muted-foreground">Removes 0, O, I, l, 1</p>
              </div>
              <Switch id="exclude-ambiguous" checked={excludeAmbiguous} onCheckedChange={setExcludeAmbiguous} />
            </div>
          </>
        )}

        <Button onClick={handleApply} className="w-full">
          Apply Character Set
        </Button>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Preview</Badge>
            <span className="text-xs text-muted-foreground">{buildCharset().length} characters</span>
          </div>
          <code className="text-xs break-all">{buildCharset()}</code>
        </div>
      </div>
    </Card>
  )
}
