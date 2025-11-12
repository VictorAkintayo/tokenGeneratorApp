"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, ShieldAlert, ShieldCheck, Lightbulb, Building2, CreditCard, User, Lock, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SecurityAuditProps {
  password: string
  context?: string
}

interface Analysis {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  useCaseRecommendations: {
    banking: boolean
    corporate: boolean
    personal: boolean
    highSecurity: boolean
  }
}

export function AISecurityAudit({ password, context }: SecurityAuditProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/analyze-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, context }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze password")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError("Failed to analyze password. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Weak"
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Security Audit</h3>
        </div>
        <Button onClick={handleAnalyze} disabled={isAnalyzing || !password} size="sm" className="gap-2">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Security Score</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={getScoreColor(analysis.score)}>
                  {analysis.score}/100
                </Badge>
                <span className="text-xs text-muted-foreground">{getScoreLabel(analysis.score)}</span>
              </div>
            </div>
            <Progress value={analysis.score} className="h-2" />
          </div>

          {analysis.strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold">Strengths</span>
              </div>
              <div className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="p-2 rounded-md bg-green-500/10 border border-green-500/20 text-sm">
                    {strength}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.weaknesses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold">Vulnerabilities</span>
              </div>
              <div className="space-y-2">
                {analysis.weaknesses.map((weakness, index) => (
                  <div key={index} className="p-2 rounded-md bg-red-500/10 border border-red-500/20 text-sm">
                    {weakness}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Recommendations</span>
              </div>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-2 rounded-md bg-primary/10 border border-primary/20 text-sm">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-sm font-semibold">Use Case Suitability</span>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-3 rounded-lg border ${
                  analysis.useCaseRecommendations.banking
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs font-semibold">Banking</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {analysis.useCaseRecommendations.banking ? "Suitable" : "Not recommended"}
                </span>
              </div>
              <div
                className={`p-3 rounded-lg border ${
                  analysis.useCaseRecommendations.corporate
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-semibold">Corporate</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {analysis.useCaseRecommendations.corporate ? "Suitable" : "Not recommended"}
                </span>
              </div>
              <div
                className={`p-3 rounded-lg border ${
                  analysis.useCaseRecommendations.personal
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-semibold">Personal</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {analysis.useCaseRecommendations.personal ? "Suitable" : "Not recommended"}
                </span>
              </div>
              <div
                className={`p-3 rounded-lg border ${
                  analysis.useCaseRecommendations.highSecurity
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="text-xs font-semibold">High Security</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {analysis.useCaseRecommendations.highSecurity ? "Suitable" : "Not recommended"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!analysis && !isAnalyzing && (
        <div className="p-8 text-center">
          <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click "Analyze" to get AI-powered security insights</p>
        </div>
      )}
    </Card>
  )
}
