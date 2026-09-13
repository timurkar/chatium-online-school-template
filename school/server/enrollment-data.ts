import { findUsersByIds } from '@app/auth'
import Courses from '../tables/courses.table'
import Enrollments from '../tables/enrollments.table'
import { EnrollmentStatus } from '../shared/config'

export type EnrollmentData = {
  id: string
  courseId: string
  courseTitle: string
  courseImageHash: string | null
  userId: string
  studentName: string
  studentContact: string
  status: EnrollmentStatus
  comment: string | null
  completedLessons: string[]
  lastLessonId: string | null
  createdAt: string
}

export function toEnrollmentData(row: typeof Enrollments.T, course: typeof Courses.T | null): EnrollmentData {
  return {
    id: row.id,
    courseId: row.course.id,
    courseTitle: course?.title ?? 'Курс удалён',
    courseImageHash: course?.imageHash ?? null,
    userId: row.user.id,
    studentName: row.studentName,
    studentContact: row.studentContact,
    status: row.status,
    comment: row.comment ?? null,
    completedLessons: row.completedLessons,
    lastLessonId: row.lastLessonId ?? null,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function toEnrollmentDataList(ctx: app.Ctx, rows: Array<typeof Enrollments.T>) {
  const courseIds = [...new Set(rows.map(r => r.course.id))]
  const courses = courseIds.length ? await Courses.findAll(ctx, { where: { id: courseIds }, limit: 500 }) : []
  const byId = new Map(courses.map(c => [c.id, c]))
  return rows.map(row => toEnrollmentData(row, byId.get(row.course.id) ?? null))
}

/** Записи текущего пользователя. */
export async function listMyEnrollments(ctx: app.Ctx, userId: string) {
  const rows = await Enrollments.findAll(ctx, {
    where: { user: userId },
    order: [{ createdAt: 'desc' }, { id: 'asc' }],
    limit: 200,
  })
  return toEnrollmentDataList(ctx, rows)
}

export async function findEnrollment(ctx: app.Ctx, userId: string, courseId: string) {
  return Enrollments.findOneBy(ctx, { user: userId, course: courseId })
}

/** Контакт пользователя для админки: подтверждённый телефон или email. */
export function userContact(user: { confirmedPhone?: string; confirmedEmail?: string; username?: string }) {
  return user.confirmedPhone || user.confirmedEmail || user.username || '—'
}

export async function attachStudentContacts(ctx: app.Ctx, list: EnrollmentData[]) {
  const ids = [...new Set(list.map(e => e.userId))]
  const users = ids.length ? await findUsersByIds(ctx, ids) : []
  const byId = new Map(users.map(u => [String(u.id), u]))
  return list.map(e => {
    const user = byId.get(e.userId)
    return user ? { ...e, studentName: user.fullName || e.studentName, studentContact: userContact(user) } : e
  })
}
