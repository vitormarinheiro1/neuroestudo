"use client"

export interface Discipline {
  id: string
  userId: string
  name: string
  color: string
  goal: number
  createdAt: string
}

export interface StudySession {
  id: string
  userId: string
  disciplineId: string
  startTime: string
  endTime?: string
  duration?: number
  notes?: string
  createdAt: string
}

export interface Review {
  id: string
  userId: string
  disciplineId: string
  topic: string
  lastReview: string
  nextReview: string
  interval: number
  easeFactor: number
  repetitions: number
}

// Disciplines
export function getDisciplines(userId: string): Discipline[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(`studyflow_disciplines_${userId}`)
  return data ? JSON.parse(data) : []
}

export function saveDiscipline(discipline: Discipline) {
  const disciplines = getDisciplines(discipline.userId)
  const index = disciplines.findIndex((d) => d.id === discipline.id)
  if (index >= 0) {
    disciplines[index] = discipline
  } else {
    disciplines.push(discipline)
  }
  localStorage.setItem(`studyflow_disciplines_${discipline.userId}`, JSON.stringify(disciplines))
}

export function deleteDiscipline(userId: string, disciplineId: string) {
  const disciplines = getDisciplines(userId).filter((d) => d.id !== disciplineId)
  localStorage.setItem(`studyflow_disciplines_${userId}`, JSON.stringify(disciplines))
}

// Study Sessions
export function getStudySessions(userId: string): StudySession[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(`studyflow_sessions_${userId}`)
  return data ? JSON.parse(data) : []
}

export function saveStudySession(session: StudySession) {
  const sessions = getStudySessions(session.userId)
  const index = sessions.findIndex((s) => s.id === session.id)
  if (index >= 0) {
    sessions[index] = session
  } else {
    sessions.push(session)
  }
  localStorage.setItem(`studyflow_sessions_${session.userId}`, JSON.stringify(sessions))
}

// Reviews
export function getReviews(userId: string): Review[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(`studyflow_reviews_${userId}`)
  return data ? JSON.parse(data) : []
}

export function saveReview(review: Review) {
  const reviews = getReviews(review.userId)
  const index = reviews.findIndex((r) => r.id === review.id)
  if (index >= 0) {
    reviews[index] = review
  } else {
    reviews.push(review)
  }
  localStorage.setItem(`studyflow_reviews_${review.userId}`, JSON.stringify(reviews))
}

export function deleteReview(userId: string, reviewId: string) {
  const reviews = getReviews(userId).filter((r) => r.id !== reviewId)
  localStorage.setItem(`studyflow_reviews_${userId}`, JSON.stringify(reviews))
}
