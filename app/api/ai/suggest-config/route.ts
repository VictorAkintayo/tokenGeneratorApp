import { generateObject } from "ai"
import { z } from "zod"

const configSuggestionSchema = z.object({
  type: z.enum(["token", "password", "secret"]),
  config: z.object({
    length: z.number().optional(),
    includeUppercase: z.boolean().optional(),
    includeLowercase: z.boolean().optional(),
    includeNumbers: z.boolean().optional(),
    includeSymbols: z.boolean().optional(),
    excludeAmbiguous: z.boolean().optional(),
  }),
  reasoning: z.string().describe("Why this configuration is recommended"),
  securityLevel: z.enum(["basic", "standard", "high", "maximum"]),
})

export async function POST(req: Request) {
  try {
    const { useCase, requirements } = await req.json()

    if (!useCase) {
      return Response.json({ error: "Use case is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema: configSuggestionSchema,
      prompt: `Suggest optimal password/token configuration for this use case: "${useCase}"
      
Additional requirements: ${requirements || "None specified"}

Consider:
- Industry standards and compliance requirements
- Security best practices
- Usability vs security tradeoffs
- The specific context and risk level

Provide recommended configuration with detailed reasoning.`,
      maxOutputTokens: 800,
    })

    return Response.json({ suggestion: object })
  } catch (error) {
    console.error("Config suggestion error:", error)
    return Response.json({ error: "Failed to generate suggestion" }, { status: 500 })
  }
}
