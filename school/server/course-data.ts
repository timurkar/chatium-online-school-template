import Courses from '../tables/courses.table'
import Lessons from '../tables/lessons.table'
import { LEVELS, Level } from '../shared/config'

const moneyFormat = { minimumFractionDigits: 0, maximumFractionDigits: 0 }

export type CourseData = {
  id: string
  title: string
  description: string
  fullDescription: string
  whatYouLearn: string[]
  emoji: string
  imageHash: string | null
  price: number
  priceFormatted: string
  isFree: boolean
  oldPrice: number | null
  oldPriceFormatted: string | null
  level: Level
  levelLabel: string
  durationWeeks: number
  teacherName: string
  teacherTitle: string
  teacherEmoji: string
  status: 'active' | 'draft'
  featured: boolean
  sortOrder: number
  lessonsCount: number
  freeLessonsCount: number
  totalMinutes: number
  createdAt: string
}

export type LessonMeta = {
  id: string
  courseId: string
  title: string
  description: string
  durationMinutes: number
  isFree: boolean
  sortOrder: number
  hasVideo: boolean
}

export type LessonFull = LessonMeta & { content: string; videoUrl: string | null }

export function toLessonMeta(row: typeof Lessons.T): LessonMeta {
  return {
    id: row.id,
    courseId: row.course.id,
    title: row.title,
    description: row.description,
    durationMinutes: row.durationMinutes,
    isFree: row.isFree,
    sortOrder: row.sortOrder,
    hasVideo: !!row.videoUrl,
  }
}

export function toLessonFull(row: typeof Lessons.T): LessonFull {
  return { ...toLessonMeta(row), content: row.content, videoUrl: row.videoUrl ?? null }
}

export const lessonOrder = [{ sortOrder: 'asc' as const }, { id: 'asc' as const }]

export async function listLessons(ctx: app.Ctx, courseId: string) {
  const rows = await Lessons.findAll(ctx, { where: { course: courseId }, order: lessonOrder, limit: 500 })
  return rows.map(toLessonMeta)
}

/** Уроки для набора курсов одним запросом (для счётчиков в карточках). */
async function lessonsByCourse(ctx: app.Ctx, courseIds: string[]) {
  const map = new Map<string, Array<typeof Lessons.T>>()
  if (!courseIds.length) return map
  const rows = await Lessons.findAll(ctx, { where: { course: courseIds }, limit: 1000 })
  for (const row of rows) {
    const list = map.get(row.course.id) ?? []
    list.push(row)
    map.set(row.course.id, list)
  }
  return map
}

export function toCourseData(ctx: app.Ctx, row: typeof Courses.T, lessons: Array<typeof Lessons.T>): CourseData {
  const oldPrice = row.oldPrice ?? null
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    fullDescription: row.fullDescription,
    whatYouLearn: row.whatYouLearn,
    emoji: row.emoji,
    imageHash: row.imageHash ?? null,
    price: row.price.amount,
    priceFormatted: row.price.amount > 0 ? row.price.format(ctx, moneyFormat) : 'Бесплатно',
    isFree: row.price.amount <= 0,
    oldPrice: oldPrice ? oldPrice.amount : null,
    oldPriceFormatted: oldPrice && oldPrice.amount > row.price.amount ? oldPrice.format(ctx, moneyFormat) : null,
    level: row.level,
    levelLabel: LEVELS[row.level],
    durationWeeks: row.durationWeeks,
    teacherName: row.teacherName,
    teacherTitle: row.teacherTitle,
    teacherEmoji: row.teacherEmoji,
    status: row.status,
    featured: row.featured,
    sortOrder: row.sortOrder,
    lessonsCount: lessons.length,
    freeLessonsCount: lessons.filter(l => l.isFree).length,
    totalMinutes: lessons.reduce((sum, l) => sum + l.durationMinutes, 0),
    createdAt: row.createdAt.toISOString(),
  }
}

export async function toCourseDataList(ctx: app.Ctx, rows: Array<typeof Courses.T>): Promise<CourseData[]> {
  const lessons = await lessonsByCourse(ctx, rows.map(r => r.id))
  return rows.map(row => toCourseData(ctx, row, lessons.get(row.id) ?? []))
}

export type CourseFilter = {
  q?: string
  level?: Level
  featured?: boolean
  includeDrafts?: boolean
  limit?: number
}

export async function listCourses(ctx: app.Ctx, filter: CourseFilter = {}): Promise<CourseData[]> {
  const conditions: Array<Record<string, unknown>> = []
  if (!filter.includeDrafts) conditions.push({ status: 'active' })
  if (filter.featured) conditions.push({ featured: true })
  if (filter.level) conditions.push({ level: filter.level })
  const q = filter.q?.trim()
  if (q) {
    const pattern = `%${q.replace(/[%_]/g, '')}%`
    conditions.push({ $or: [{ title: { $ilike: pattern } }, { description: { $ilike: pattern } }] })
  }
  const rows = await Courses.findAll(ctx, {
    where: conditions.length ? ({ $and: conditions } as any) : undefined,
    order: [{ featured: 'desc' }, { sortOrder: 'asc' }, { id: 'asc' }],
    limit: Math.min(filter.limit ?? 100, 500),
  })
  return toCourseDataList(ctx, rows)
}

export async function getPublicCourse(ctx: app.Ctx, id: string): Promise<CourseData | null> {
  const row = await Courses.findOneBy(ctx, { id, status: 'active' })
  if (!row) return null
  const [data] = await toCourseDataList(ctx, [row])
  return data ?? null
}

export async function getAdminCourse(ctx: app.Ctx, id: string): Promise<CourseData> {
  const row = await Courses.getById(ctx, id)
  const [data] = await toCourseDataList(ctx, [row])
  if (!data) throw new Error('Course not found')
  return data
}
