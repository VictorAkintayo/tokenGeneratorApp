import { generateObject } from "ai"
import { z } from "zod"

const passwordAnalysisSchema = z.object({
  score: z.number().min(0).max(100).describe("Overall security score from 0-100"),
  strengths: z.array(z.string()).describe("What makes this password strong"),
  weaknesses: z.array(z.string()).describe("Security vulnerabilities or weaknesses"),
  suggestions: z.array(z.string()).describe("Specific actionable improvements"),
  useCaseRecommendations: z.object({
    banking: z.boolean().describe("Suitable for banking/financial services"),
    corporate: z.boolean().describe("Suitable for corporate/work accounts"),
    personal: z.boolean().describe("Suitable for personal accounts"),
    highSecurity: z.boolean().describe("Suitable for high-security applications"),
  }),
})

export async function POST(req: Request) {
  try {
    const { password, context } = await req.json()

    if (!password) {
      return Response.json({ error: "Password is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema: passwordAnalysisSchema,
      prompt: `Analyze this password for security: "${password}"
      
Context: ${context || "General use"}

Provide:
1. Security score (0-100)
2. Strengths (what's good about it)
3. Weaknesses (specific vulnerabilities)
4. Actionable suggestions for improvement
5. Use case recommendations (is it suitable for banking, corporate, personal, or high-security use?)

Be specific and technical in your analysis.`,
      maxOutputTokens: 1000,
    })

    return Response.json({ analysis: object })
  } catch (error) {
    console.error("Password analysis error:", error)
    return Response.json({ error: "Failed to analyze password" }, { status: 500 })
  }
}
