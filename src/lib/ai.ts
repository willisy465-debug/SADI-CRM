import { GoogleGenAI } from "@google/genai"

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Falling back to mock AI response.")
    return generateMockResponse(prompt)
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    })

    return response.text || ""
  } catch (error) {
    console.error("Gemini API Error:", error)
    return "Error generating content. Please check the server logs."
  }
}

function generateMockResponse(prompt: string): string {
  if (prompt.includes("Proposal")) {
    return `
# Custom Training Proposal
**Prepared for:** Valued Client
**Date:** ${new Date().toLocaleDateString()}

## 1. Executive Summary
Thank you for the opportunity to present this proposal. SADI is committed to delivering world-class capacity development tailored to your specific organizational needs.

## 2. Proposed Modules
- **Module 1**: Leadership & Strategic Management
- **Module 2**: Operations & Process Optimization
- **Module 3**: Financial Acumen for Non-Financial Managers

## 3. Delivery & Investment
The programme will be delivered over 5 days by our expert facilitators.
**Total Investment**: Please refer to the CRM Deal amount.

*Note: This is an AI-generated mock proposal because the GEMINI_API_KEY was not configured.*
    `.trim()
  }

  return `
Subject: Exploring synergy with SADI Training Programmes

Dear Client,

I hope this email finds you well. 

I'm reaching out because I noticed your recent interest in capacity development. At the Southern Africa Development Institute (SADI), we specialize in bespoke training programmes designed to elevate your team's operational excellence.

I'd love to schedule a brief 10-minute call next week to discuss how our solutions might align with your current objectives.

Best regards,
The SADI Team

[Note: This is an AI-generated mock email because the GEMINI_API_KEY was not configured.]
  `.trim()
}
