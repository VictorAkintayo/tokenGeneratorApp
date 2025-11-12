"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react"

interface AISuggestionsProps {
  generationType: "token" | "password" | "secret"
  value: string
}

export function AISuggestions({ generationType, value }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const newSuggestions = generateSuggestions(generationType, value)
      setSuggestions(newSuggestions)
      setIsLoading(false)
    }, 500)
  }, [generationType, value])

  const generateSuggestions = (type: string, val: string) => {
    const suggestions: string[] = []

    if (type === "password") {
      if (val.length < 12) {
        suggestions.push("Consider using at least 12 characters for better security")
      }
      if (!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(val)) {
        suggestions.push("Adding special characters significantly improves password strength")
      }
      if (/(.)\1{2,}/.test(val)) {
        suggestions.push("Avoid repeating characters in sequence")
      }
      if (suggestions.length === 0) {
        suggestions.push("This password meets strong security standards")
        suggestions.push("Store this password in a secure password manager")
      }
    } else if (type === "token") {
      suggestions.push("Use this token for API authentication or temporary access codes")
      suggestions.push("Tokens should be regenerated periodically for security")
    } else if (type === "secret") {
      suggestions.push("Perfect for JWT signing, API keys, or encryption operations")
      suggestions.push("Store this in environment variables, never commit to version control")
      suggestions.push("Rotate secret keys regularly in production environments")
    }

    return suggestions
  }

  if (isLoading) {
    return (
      <Card className="mt-6 p-6 border-border/40 bg-card/50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-semibold">AI Analysis</h3>
          <Badge variant="outline" className="ml-auto">
            Processing...
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="mt-6 p-6 border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Suggestions</h3>
        <Badge variant="outline" className="ml-auto gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Analyzed
        </Badge>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
            {suggestion.includes("Consider") || suggestion.includes("Avoid") ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            ) : suggestion.includes("Adding") ? (
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm leading-relaxed">{suggestion}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
