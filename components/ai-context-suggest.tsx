"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Lightbulb, Loader2, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ConfigSuggestion {
  type: "token" | "password" | "secret"
  config: {
    length?: number
    includeUppercase?: boolean
    includeLowercase?: boolean
    includeNumbers?: boolean
    includeSymbols?: boolean
    excludeAmbiguous?: boolean
  }
  reasoning: string
  securityLevel: "basic" | "standard" | "high" | "maximum"
}

interface AIContextSuggestProps {
  onApplyConfig?: (config: any) => void
}

export function AIContextSuggest({ onApplyConfig }: AIContextSuggestProps) {
  const [useCase, setUseCase] = useState("")
  const [requirements, setRequirements] = useState("")
  const [suggestion, setSuggestion] = useState<ConfigSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const quickUseCases = [
    "Database password",
    "API key",
    "JWT secret",
    "User PIN",
    "Admin password",
    "Temporary access code",
  ]

  const handleSuggest = async () => {
    if (!useCase.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/suggest-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, requirements }),
      })

      if (!response.ok) {
        throw new Error("Failed to get suggestion")
      }

      const data = await response.json()
      setSuggestion(data.suggestion)
    } catch (err) {
      setError("Failed to generate suggestion. Please try again.")
      console.error("Suggestion error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = () => {
    if (suggestion && onApplyConfig) {
      onApplyConfig(suggestion)
    }
  }

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case "maximum":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20"
      case "high":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      case "standard":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Configuration Assistant</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="use-case">What will you use this for?</Label>
          <Input
            id="use-case"
            placeholder="e.g., Database password, API key, User PIN"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {quickUseCases.map((uc) => (
              <Button key={uc} variant="outline" size="sm" onClick={() => setUseCase(uc)} className="text-xs">
                {uc}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Additional Requirements (Optional)</Label>
          <Textarea
            id="requirements"
            placeholder="e.g., Must comply with NIST standards, needs to be memorable, etc."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={2}
          />
        </div>

        <Button onClick={handleSuggest} disabled={isLoading || !useCase.trim()} className="w-full gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting Recommendations...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4" />
              Get AI Recommendations
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestion && (
        <div className="space-y-3 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {suggestion.type}
            </Badge>
            <Badge className={getSecurityBadgeColor(suggestion.securityLevel)}>
              {suggestion.securityLevel} security
            </Badge>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
            <div className="flex items-start gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm font-semibold">Reasoning</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.reasoning}</p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold">Recommended Configuration</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {suggestion.config.length && (
                <div className="p-2 rounded-md bg-muted/20 border border-border/40">
                  <span className="text-muted-foreground">Length:</span>{" "}
                  <span className="font-semibold">{suggestion.config.length} characters</span>
                </div>
              )}
              {suggestion.config.includeUppercase !== undefined && (
                <div className="p-2 rounded-md bg-muted/20 border border-border/40">
                  <span className="text-muted-foreground">Uppercase:</span>{" "}
                  <span className="font-semibold">{suggestion.config.includeUppercase ? "Yes" : "No"}</span>
                </div>
              )}
              {suggestion.config.includeLowercase !== undefined && (
                <div className="p-2 rounded-md bg-muted/20 border border-border/40">
                  <span className="text-muted-foreground">Lowercase:</span>{" "}
                  <span className="font-semibold">{suggestion.config.includeLowercase ? "Yes" : "No"}</span>
                </div>
              )}
              {suggestion.config.includeNumbers !== undefined && (
                <div className="p-2 rounded-md bg-muted/20 border border-border/40">
                  <span className="text-muted-foreground">Numbers:</span>{" "}
                  <span className="font-semibold">{suggestion.config.includeNumbers ? "Yes" : "No"}</span>
                </div>
              )}
              {suggestion.config.includeSymbols !== undefined && (
                <div className="p-2 rounded-md bg-muted/20 border border-border/40">
                  <span className="text-muted-foreground">Symbols:</span>{" "}
                  <span className="font-semibold">{suggestion.config.includeSymbols ? "Yes" : "No"}</span>
                </div>
              )}
              {suggestion.config.excludeAmbiguous !== undefined && (
                <div className="p-2 rounded-md bg-muted/20 border border-border/40">
                  <span className="text-muted-foreground">Exclude Ambiguous:</span>{" "}
                  <span className="font-semibold">{suggestion.config.excludeAmbiguous ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleApply} className="w-full gap-2" variant="default">
            <Check className="h-4 w-4" />
            Apply This Configuration
          </Button>
        </div>
      )}
    </Card>
  )
}
