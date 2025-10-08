// Base interface for database records
export interface BaseModel {
  id: number
  username: string
  created_at?: string
  updated_at?: string
}

// Interview interface with RLS compliance
export interface Interview extends BaseModel {
  title: string
  job_role: string
  description: string
  status: 'Draft' | 'Published'
}

// Interview creation/update payload (without id)
export interface InterviewInput {
  title: string
  job_role: string
  description: string
  status: 'Draft' | 'Published'
  username?: string  // Will be added by interceptor
}

// Question interface
export interface Question extends BaseModel {
  interview_id: number
  question_text: string
  question_type: 'multiple_choice' | 'text' | 'code' | 'video'
  options?: string[]  // For multiple choice questions
  correct_answer?: string
  time_limit?: number  // In minutes
  points: number
  difficulty?: 'Easy' | 'Intermediate' | 'Advanced'  // Optional difficulty level
}

// Question creation/update payload
export interface QuestionInput {
  interview_id: number
  question_text: string
  question_type: 'multiple_choice' | 'text' | 'code' | 'video'
  options?: string[]
  correct_answer?: string
  time_limit?: number
  points: number
  difficulty?: 'Easy' | 'Intermediate' | 'Advanced'  // Optional difficulty level
  username?: string  // Will be added by interceptor
}


// Applicant interface
export interface Applicant extends BaseModel {
  interview_id: number
  title: string
  firstname: string
  surname: string
  phone_number: string
  email_address: string
  interview_status: 'Not Started' | 'Completed'
}

// Applicant creation/update payload
export interface ApplicantInput {
  interview_id: number
  name: string
  email: string
  status: 'invited' | 'in_progress' | 'completed' | 'reviewed'
  score?: number
  feedback?: string
  username?: string  // Will be added by interceptor
}

// API Response types
export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
}