"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Check, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PatternGenerator() {
  const [pattern, setPattern] = useState("XXX-999-XXX")
  const [generatedValue, setGeneratedValue] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generateFromPattern = (patternStr: string): string => {
    let result = ""
    for (const char of patternStr) {
      switch (char) {
        case "X":
          result += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]
          break
        case "x":
          result += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
          break
        case "9":
          result += Math.floor(Math.random() * 10).toString()
          break
        case "A":
          result += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
          break
        case "a":
          result += "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
          break
        case "!":
          result += "!@#$%^&*()_+-=[]{}|;:,.<>?"[Math.floor(Math.random() * 23)]
          break
        default:
          result += char
      }
    }
    return result
  }

  const handleGenerate = () => {
    if (!pattern) {
      toast({
        title: "Error",
        description: "Please enter a pattern",
        variant: "destructive",
      })
      return
    }
    const value = generateFromPattern(pattern)
    setGeneratedValue(value)
  }

  const handleCopy = async () => {
    if (!generatedValue) return
    await navigator.clipboard.writeText(generatedValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "Pattern-based value copied to clipboard",
    })
  }

  const presetPatterns = [
    { name: "Product Key", pattern: "XXXX-XXXX-XXXX-XXXX" },
    { name: "License Code", pattern: "XXX-999-XXX" },
    { name: "Order ID", pattern: "ORD-9999999" },
    { name: "Coupon Code", pattern: "AAAA-AAAA" },
    { name: "Serial Number", pattern: "SN-9999-XXXX" },
  ]

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="pattern">Pattern Template</Label>
          <Input
            id="pattern"
            placeholder="e.g., XXX-999-XXX"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">Pattern Symbols</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <Badge variant="outline" className="mr-1">
                  X
                </Badge>{" "}
                Uppercase letter
              </div>
              <div>
                <Badge variant="outline" className="mr-1">
                  x
                </Badge>{" "}
                Lowercase letter
              </div>
              <div>
                <Badge variant="outline" className="mr-1">
                  9
                </Badge>{" "}
                Digit (0-9)
              </div>
              <div>
                <Badge variant="outline" className="mr-1">
                  A
                </Badge>{" "}
                Uppercase alphanumeric
              </div>
              <div>
                <Badge variant="outline" className="mr-1">
                  a
                </Badge>{" "}
                Lowercase alphanumeric
              </div>
              <div>
                <Badge variant="outline" className="mr-1">
                  !
                </Badge>{" "}
                Symbol
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Any other character will be used as-is (e.g., dashes, spaces)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {presetPatterns.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => setPattern(preset.pattern)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full gap-2">
          <Sparkles className="h-4 w-4" />
          Generate from Pattern
        </Button>
      </div>

      {generatedValue && (
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
            <code className="text-lg font-mono break-all">{generatedValue}</code>
          </div>
          <Button onClick={handleCopy} variant="outline" className="w-full gap-2 bg-transparent">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Value
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}
