"use client"

interface StrengthMeterProps {
  password: string
}

export function StrengthMeter({ password }: StrengthMeterProps) {
  const calculateStrength = (pwd: string) => {
    let strength = 0

    if (pwd.length >= 8) strength += 20
    if (pwd.length >= 12) strength += 20
    if (pwd.length >= 16) strength += 10
    if (/[a-z]/.test(pwd)) strength += 15
    if (/[A-Z]/.test(pwd)) strength += 15
    if (/[0-9]/.test(pwd)) strength += 10
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10

    return Math.min(strength, 100)
  }

  const strength = calculateStrength(password)
  const getStrengthLabel = () => {
    if (strength < 40) return "Weak"
    if (strength < 60) return "Fair"
    if (strength < 80) return "Good"
    return "Excellent"
  }

  const getStrengthColor = () => {
    if (strength < 40) return "bg-destructive"
    if (strength < 60) return "bg-yellow-500"
    if (strength < 80) return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-2 p-4 rounded-lg border border-border/40 bg-muted/20">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Strength</span>
        <span className="font-semibold">{getStrengthLabel()}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-500 ${getStrengthColor()}`} style={{ width: `${strength}%` }} />
      </div>
    </div>
  )
}
