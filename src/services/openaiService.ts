import OpenAI from 'openai'

export interface AIQuestionRequest {
  jobRole: string
  existingQuestions: string[]
  difficulty?: 'Easy' | 'Intermediate' | 'Advanced'
  count?: number
}

export interface AIFeedbackRequest {
  applicantName: string
  jobRole: string
  interviewResponses: Array<{
    question: string
    answer: string
    difficulty: string
  }>
}


export interface AIAnalyticsRequest {
  applicants: Array<{
    name: string
    responses: Array<{
      question: string
      answer: string
      difficulty: string
    }>
    status: string
  }>
  jobRole: string
}

export interface GeneratedQuestion {
  question: string
  difficulty: 'Easy' | 'Intermediate' | 'Advanced'
  rationale: string
}

export interface ApplicantFeedback {
  personalityProfile: {
    traits: string[]
    communicationStyle: string
    confidence: number
  }
  performanceAnalysis: {
    strengths: string[]
    weaknesses: string[]
    technicalSkills: string[]
  }
  improvementSuggestions: string[]
  overallScore: number
  recommendation: string
}

export interface PerformanceAnalytics {
  predictiveScores: Array<{
    applicantName: string
    successProbability: number
    reasoning: string
    rank: number
  }>
  insights: {
    topCandidates: string[]
    skillGaps: string[]
    interviewQuality: string
    recommendations: string[]
  }
}

class OpenAIService {
  private client: OpenAI | null = null
  private isConfigured: boolean = false

  constructor() {
    const apiKey = import.meta.env.VITE_LLM_API_KEY

    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      })
      this.isConfigured = true
    } else {
      console.error('OpenAI API key not configured')
      this.isConfigured = false
    }
  }

  private ensureConfigured() {
    if (!this.isConfigured || !this.client) {
      throw new Error('OpenAI service is not properly configured. Please check your API key.')
    }
  }

  private async tryCreateCompletion(messages: any[], temperature: number, maxTokens: number) {
    this.ensureConfigured()

    // Try models in order of preference
    const models = ['gpt-5', 'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`)
        const response = await this.client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens
        })
        console.log(`Successfully using model: ${model}`)
        return response
      } catch (error: any) {
        console.log(`Model ${model} not available:`, error?.message || error)
        continue
      }
    }

    throw new Error('No available OpenAI models found. Please check your API key permissions and quota.')
  }

  private cleanJsonResponse(content: string): string {
    // Strip markdown code blocks if present
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    return cleanContent
  }

  async generateInterviewQuestions(request: AIQuestionRequest): Promise<GeneratedQuestion[]> {
    const { jobRole, existingQuestions, difficulty = 'Intermediate', count = 3 } = request

    const existingQuestionsText = existingQuestions.length > 0
      ? `Existing questions to avoid duplicating: ${existingQuestions.join(', ')}`
      : 'No existing questions to avoid.'

    const prompt = `
You are an expert interview question generator. Generate ${count} high-quality interview questions for a ${jobRole} position.

Requirements:
- Difficulty level: ${difficulty}
- Questions should be specific to ${jobRole}
- Avoid questions similar to existing ones
- Focus on practical skills and experience
- Include behavioral and technical aspects

${existingQuestionsText}

For each question, provide:
1. The question text
2. The difficulty level (Easy/Intermediate/Advanced)
3. A brief rationale for why this question is valuable

Return the response as a JSON array with this structure:
[
  {
    "question": "Your question text here",
    "difficulty": "${difficulty}",
    "rationale": "Why this question is valuable for assessing ${jobRole} candidates"
  }
]
`

    try {
      const response = await this.tryCreateCompletion([
        {
          role: 'system',
          content: 'You are an expert HR professional and interview question generator. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.7, 2000)

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response content from OpenAI')
      }

      const cleanContent = this.cleanJsonResponse(content)
      const questions = JSON.parse(cleanContent) as GeneratedQuestion[]
      return questions

    } catch (error) {
      console.error('Error generating interview questions:', error)
      throw new Error('Failed to generate interview questions. Please try again.')
    }
  }

  async generateApplicantFeedback(request: AIFeedbackRequest): Promise<ApplicantFeedback> {
    const { applicantName, jobRole, interviewResponses } = request

    const responseText = interviewResponses.map(r =>
      `Q: ${r.question} (${r.difficulty})\nA: ${r.answer}`
    ).join('\n\n')

    const prompt = `
Analyze the interview performance of ${applicantName} for the ${jobRole} position based on their responses.

Interview Responses:
${responseText}

Provide a comprehensive analysis including:
1. Personality profile based on speech patterns and content
2. Performance analysis (strengths, weaknesses, technical skills)
3. Specific improvement suggestions
4. Overall score (0-100)
5. Hiring recommendation

Return the response as JSON with this structure:
{
  "personalityProfile": {
    "traits": ["trait1", "trait2", ...],
    "communicationStyle": "description",
    "confidence": 85
  },
  "performanceAnalysis": {
    "strengths": ["strength1", "strength2", ...],
    "weaknesses": ["weakness1", "weakness2", ...],
    "technicalSkills": ["skill1", "skill2", ...]
  },
  "improvementSuggestions": ["suggestion1", "suggestion2", ...],
  "overallScore": 85,
  "recommendation": "Detailed recommendation"
}
`

    try {
      const response = await this.tryCreateCompletion([
        {
          role: 'system',
          content: 'You are an expert HR analyst specializing in interview assessment and candidate profiling. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.6, 2500)

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response content from OpenAI')
      }

      const cleanContent = this.cleanJsonResponse(content)
      const feedback = JSON.parse(cleanContent) as ApplicantFeedback
      return feedback

    } catch (error) {
      console.error('Error generating applicant feedback:', error)
      throw new Error('Failed to generate applicant feedback. Please try again.')
    }
  }


  async generatePerformanceAnalytics(request: AIAnalyticsRequest): Promise<PerformanceAnalytics> {
    this.ensureConfigured()

    const { applicants, jobRole } = request

    const applicantsText = applicants.map(applicant =>
      `Applicant: ${applicant.name} (Status: ${applicant.status})\n` +
      applicant.responses.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n')
    ).join('\n\n---\n\n')

    const prompt = `
Analyze the interview performance data for ${applicants.length} candidates for the ${jobRole} position.

Candidate Data:
${applicantsText}

Provide comprehensive analytics including:
1. Predictive success scores for each candidate with reasoning
2. Candidate ranking
3. Overall insights about top candidates
4. Identified skill gaps
5. Interview quality assessment
6. Hiring recommendations

Return the response as JSON with this structure:
{
  "predictiveScores": [
    {
      "applicantName": "Name",
      "successProbability": 85,
      "reasoning": "Detailed explanation",
      "rank": 1
    }
  ],
  "insights": {
    "topCandidates": ["candidate1", "candidate2"],
    "skillGaps": ["gap1", "gap2"],
    "interviewQuality": "Assessment of question quality and coverage",
    "recommendations": ["recommendation1", "recommendation2"]
  }
}
`

    try {
      const response = await this.tryCreateCompletion([
        {
          role: 'system',
          content: 'You are an expert HR analytics specialist with deep knowledge of predictive hiring analysis. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.5, 3000)

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response content from OpenAI')
      }

      const cleanContent = this.cleanJsonResponse(content)
      const analytics = JSON.parse(cleanContent) as PerformanceAnalytics
      return analytics

    } catch (error) {
      console.error('Error generating performance analytics:', error)
      throw new Error('Failed to generate performance analytics. Please try again.')
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.ensureConfigured()

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a connection test. Please respond with "Connection successful".'
          }
        ],
        max_tokens: 10
      })

      return response.choices[0]?.message?.content?.includes('successful') ?? false
    } catch (error) {
      console.error('OpenAI connection test failed:', error)
      return false
    }
  }
}

export const openaiService = new OpenAI({
  apiKey: import.meta.env.VITE_LLM_API_KEY,
  dangerouslyAllowBrowser: true
})

export const aiService = new OpenAIService()
export default aiService