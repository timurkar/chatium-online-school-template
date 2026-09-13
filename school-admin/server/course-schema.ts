import { s } from '@app/schema'

/** Поля формы курса — общие для создания и обновления. */
export const courseBody = {
  title: s.string().min(1),
  description: s.string(),
  fullDescription: s.string(),
  whatYouLearn: s.array(s.string()),
  imageHash: s.string().optional(),
  price: s.number().min(0),
  oldPrice: s.number().min(0).optional(),
  level: s.enum(['beginner', 'intermediate', 'advanced']),
  durationWeeks: s.number().int().min(1),
  teacherName: s.string(),
  teacherTitle: s.string(),
  teacherImageHash: s.string().optional(),
  status: s.enum(['active', 'draft']),
  featured: s.boolean(),
  sortOrder: s.number().optional(),
}

export const lessonBody = {
  title: s.string().min(1),
  description: s.string(),
  content: s.string(),
  videoHash: s.string().optional(),
  videoUrl: s.string().optional(),
  durationMinutes: s.number().int().min(0),
  isFree: s.boolean(),
}
