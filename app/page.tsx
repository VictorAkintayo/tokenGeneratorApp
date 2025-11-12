"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  RefreshCw,
  Sparkles,
  Lock,
  Key,
  Shield,
  Check,
  Hash,
  History,
  Bookmark,
  Binary,
  Layers,
  Wrench,
  Boxes,
} from "lucide-react"
import { Clock, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AISuggestions } from "@/components/ai-suggestions"
import { StrengthMeter } from "@/components/strength-meter"
import { GeneratedOutput } from "@/components/generated-output"
import { HistoryPanel } from "@/components/history-panel"
import { PresetsPanel } from "@/components/presets-panel"
import { BatchGenerator } from "@/components/batch-generator"
import { CustomCharset } from "@/components/custom-charset"
import { PatternGenerator } from "@/components/pattern-generator"
import { ExpirationTracker } from "@/components/expiration-tracker"
import { AISecurityAudit } from "@/components/ai-security-audit"
import { AIContextSuggest } from "@/components/ai-context-suggest"
import { StorageManager, type ConfigPreset } from "@/lib/storage"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Genera8Page() {
  const [generatedValue, setGeneratedValue] = useState("")
  const [generationType, setGenerationType] = useState<"token" | "password" | "secret">("token")
  const [tokenLength, setTokenLength] = useState(8)
  const [tokenType, setTokenType] = useState<"alphanumeric" | "numeric">("alphanumeric")
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [customCharset, setCustomCharset] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | undefined>()
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const { toast } = useToast()

  const generateToken = (length: number, type: "alphanumeric" | "numeric") => {
    const chars = type === "numeric" ? "0123456789" : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let result = ""
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    return result
  }

  const generatePassword = (length: number) => {
    let chars = customCharset || ""

    if (!customCharset) {
      if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz"
      if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (includeNumbers) chars += "0123456789"
      if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    }

    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz"

    let result = ""
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    return result
  }

  const generateSecret = () => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      let value = ""
      let config: Record<string, any> = {}

      switch (generationType) {
        case "token":
          value = generateToken(tokenLength, tokenType)
          config = { tokenLength, tokenType }
          break
        case "password":
          value = generatePassword(passwordLength)
          config = {
            passwordLength,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols,
            customCharset: customCharset || undefined,
          }
          break
        case "secret":
          value = generateSecret()
          config = { bits: 256 }
          break
      }

      setGeneratedValue(value)
      setIsGenerating(false)

      StorageManager.saveToHistory({
        type: generationType,
        value,
        config,
        expiresAt,
      })
    }, 300)
  }

  const handleCopy = async () => {
    if (!generatedValue) return
    await navigator.clipboard.writeText(generatedValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied to clipboard",
      description: "Your generated value is ready to use",
    })
  }

  const handleLoadPreset = (preset: ConfigPreset) => {
    setGenerationType(preset.type)

    if (preset.type === "token") {
      setTokenLength(preset.config.tokenLength || 8)
      setTokenType(preset.config.tokenType || "alphanumeric")
    } else if (preset.type === "password") {
      setPasswordLength(preset.config.passwordLength || 16)
      setIncludeUppercase(preset.config.includeUppercase ?? true)
      setIncludeLowercase(preset.config.includeLowercase ?? true)
      setIncludeNumbers(preset.config.includeNumbers ?? true)
      setIncludeSymbols(preset.config.includeSymbols ?? true)
      if (preset.config.customCharset) {
        setCustomCharset(preset.config.customCharset)
      }
    }

    setPresetsOpen(false)
  }

  const handleApplyAIConfig = (suggestion: any) => {
    setGenerationType(suggestion.type)

    if (suggestion.type === "password" && suggestion.config) {
      if (suggestion.config.length) setPasswordLength(suggestion.config.length)
      if (suggestion.config.includeUppercase !== undefined) setIncludeUppercase(suggestion.config.includeUppercase)
      if (suggestion.config.includeLowercase !== undefined) setIncludeLowercase(suggestion.config.includeLowercase)
      if (suggestion.config.includeNumbers !== undefined) setIncludeNumbers(suggestion.config.includeNumbers)
      if (suggestion.config.includeSymbols !== undefined) setIncludeSymbols(suggestion.config.includeSymbols)
    }

    setAiOpen(false)
    toast({
      title: "Configuration applied",
      description: "AI recommendations have been applied to your settings",
    })
  }

  const getCurrentConfig = () => {
    const config: Record<string, any> = {}

    if (generationType === "token") {
      config.tokenLength = tokenLength
      config.tokenType = tokenType
    } else if (generationType === "password") {
      config.passwordLength = passwordLength
      config.includeUppercase = includeUppercase
      config.includeLowercase = includeLowercase
      config.includeNumbers = includeNumbers
      config.includeSymbols = includeSymbols
      if (customCharset) config.customCharset = customCharset
    } else {
      config.bits = 256
    }

    return { type: generationType, config }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl" />
              <Lock className="h-6 w-6 text-primary relative" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Genera8
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sheet open={aiOpen} onOpenChange={setAiOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Assistant</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>AI Security Assistant</SheetTitle>
                  <SheetDescription>
                    Get AI-powered security analysis and context-aware configuration recommendations
                  </SheetDescription>
                </SheetHeader>
                <div className="px-6 py-4 space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="context">
                      <AccordionTrigger className="text-base">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Configuration Assistant
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <AIContextSuggest onApplyConfig={handleApplyAIConfig} />
                      </AccordionContent>
                    </AccordionItem>

                    {generatedValue && generationType === "password" && (
                      <AccordionItem value="audit">
                        <AccordionTrigger className="text-base">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Security Audit
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <AISecurityAudit password={generatedValue} />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Wrench className="h-4 w-4" />
                  <span className="hidden sm:inline">Advanced</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Advanced Tools</SheetTitle>
                  <SheetDescription>
                    Batch generation, custom character sets, patterns, and expiration tracking
                  </SheetDescription>
                </SheetHeader>
                <div className="px-6 py-4 space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="batch">
                      <AccordionTrigger className="text-base">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          Batch Generator
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <BatchGenerator
                          generationType={generationType}
                          generateFunction={() => {
                            switch (generationType) {
                              case "token":
                                return generateToken(tokenLength, tokenType)
                              case "password":
                                return generatePassword(passwordLength)
                              case "secret":
                                return generateSecret()
                            }
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="charset">
                      <AccordionTrigger className="text-base">
                        <div className="flex items-center gap-2">
                          <Boxes className="h-4 w-4" />
                          Custom Character Set
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CustomCharset onCharsetChange={setCustomCharset} />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="pattern">
                      <AccordionTrigger className="text-base">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Pattern Generator
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <PatternGenerator />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="expiration">
                      <AccordionTrigger className="text-base">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Expiration Tracking
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ExpirationTracker onExpirationSet={setExpiresAt} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Generation History</SheetTitle>
                  <SheetDescription>
                    View and manage your previously generated tokens, passwords, and secret keys
                  </SheetDescription>
                </SheetHeader>
                <div className="px-6 py-4">
                  <HistoryPanel />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet open={presetsOpen} onOpenChange={setPresetsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Presets</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Configuration Presets</SheetTitle>
                  <SheetDescription>Save and load your favorite configuration settings</SheetDescription>
                </SheetHeader>
                <div className="px-6 py-4">
                  <PresetsPanel currentConfig={getCurrentConfig()} onLoadPreset={handleLoadPreset} />
                </div>
              </SheetContent>
            </Sheet>

            <Badge variant="outline" className="gap-1.5 hidden md:flex">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold text-pretty leading-tight">
            Generate Secure Tokens & Passwords
          </h1>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Create cryptographically secure tokens, passwords, and secret keys with customizable complexity levels
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-border/40 shadow-xl backdrop-blur-sm bg-card/50">
          <div className="p-4 md:p-6">
            {/* Type Selector */}
            <Tabs value={generationType} onValueChange={(v: string) => setGenerationType(v as "token" | "password" | "secret")} className="mb-6">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="token" className="gap-2 py-3">
                  <Hash className="h-4 w-4" />
                  <span className="hidden sm:inline">Token</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="gap-2 py-3">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">Password</span>
                </TabsTrigger>
                <TabsTrigger value="secret" className="gap-2 py-3">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Secret Key</span>
                </TabsTrigger>
              </TabsList>

              {/* Token Settings */}
              <TabsContent value="token" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTokenType("alphanumeric")}
                    className={`p-3 rounded-lg border transition-all ${
                      tokenType === "alphanumeric"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/40 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">Alphanumeric</div>
                    <div className="text-xs text-muted-foreground">0-9, A-Z</div>
                  </button>
                  <button
                    onClick={() => setTokenType("numeric")}
                    className={`p-3 rounded-lg border transition-all ${
                      tokenType === "numeric"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/40 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">Numeric</div>
                    <div className="text-xs text-muted-foreground">0-9 only</div>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="token-length" className="text-base">
                      Length: {tokenLength} digits
                    </Label>
                    <Badge variant="secondary">
                      {tokenLength <= 4
                        ? "Basic"
                        : tokenLength <= 8
                          ? "Standard"
                          : tokenLength <= 12
                            ? "Strong"
                            : "Maximum"}
                    </Badge>
                  </div>
                  <Slider
                    id="token-length"
                    min={4}
                    max={16}
                    step={2}
                    value={[tokenLength]}
                    onValueChange={(v) => setTokenLength(v[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4</span>
                    <span>6</span>
                    <span>8</span>
                    <span>10</span>
                    <span>12</span>
                    <span>14</span>
                    <span>16</span>
                  </div>
                </div>
              </TabsContent>

              {/* Password Settings */}
              <TabsContent value="password" className="space-y-6 mt-6">
                {customCharset && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Custom Character Set Active</div>
                      <Button variant="ghost" size="sm" onClick={() => setCustomCharset(null)} className="h-7 text-xs">
                        Clear
                      </Button>
                    </div>
                    <code className="text-xs break-all text-muted-foreground">{customCharset}</code>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password-length" className="text-base">
                      Length: {passwordLength} characters
                    </Label>
                    <Badge variant="secondary">
                      {passwordLength < 12
                        ? "Weak"
                        : passwordLength < 16
                          ? "Medium"
                          : passwordLength < 24
                            ? "Strong"
                            : "Very Strong"}
                    </Badge>
                  </div>
                  <Slider
                    id="password-length"
                    min={8}
                    max={32}
                    step={2}
                    value={[passwordLength]}
                    onValueChange={(v) => setPasswordLength(v[0])}
                    className="py-4"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2 p-3 rounded-lg border border-border/40 bg-muted/20">
                    <Label htmlFor="uppercase" className="cursor-pointer flex-1">
                      Uppercase (A-Z)
                    </Label>
                    <Switch
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                      disabled={!!customCharset}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-3 rounded-lg border border-border/40 bg-muted/20">
                    <Label htmlFor="lowercase" className="cursor-pointer flex-1">
                      Lowercase (a-z)
                    </Label>
                    <Switch
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                      disabled={!!customCharset}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-3 rounded-lg border border-border/40 bg-muted/20">
                    <Label htmlFor="numbers" className="cursor-pointer flex-1">
                      Numbers (0-9)
                    </Label>
                    <Switch
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                      disabled={!!customCharset}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-3 rounded-lg border border-border/40 bg-muted/20">
                    <Label htmlFor="symbols" className="cursor-pointer flex-1">
                      Symbols (!@#$)
                    </Label>
                    <Switch
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                      disabled={!!customCharset}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Secret Key Settings */}
              <TabsContent value="secret" className="space-y-6 mt-6">
                <div className="p-4 rounded-lg border border-border/40 bg-muted/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Binary className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">256-bit Secret Key</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Generates a cryptographically secure 64-character hexadecimal string perfect for API keys,
                    encryption keys, and authentication tokens.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {expiresAt && (
              <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/40 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Expiration tracking enabled - Items will expire on {new Date(expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              size="lg"
              className="w-full gap-2 mb-6 h-12 text-base font-semibold"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate
                </>
              )}
            </Button>

            {/* Generated Output */}
            {generatedValue && (
              <div className="space-y-4">
                <GeneratedOutput value={generatedValue} />

                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2 bg-transparent">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button onClick={handleGenerate} variant="outline" className="flex-1 gap-2 bg-transparent">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                </div>

                {generationType === "password" && <StrengthMeter password={generatedValue} />}
              </div>
            )}
          </div>
        </Card>

        {/* AI Suggestions */}
        {generatedValue && <AISuggestions generationType={generationType} value={generatedValue} />}

        {/* Security Notice */}
        <div className="mt-8 p-4 rounded-lg border border-border/40 bg-muted/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Security First</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All generation happens locally in your browser using the Web Crypto API. Nothing is sent to any server.
                Your tokens and passwords remain completely private.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </main>
  )
}
