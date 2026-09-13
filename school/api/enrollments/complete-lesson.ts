import { requireRealUser } from '@app/auth'
import Enrollments from '../../tables/enrollments.table'
import Lessons from '../../tables/lessons.table'
import { findEnrollment, toEnrollmentData } from '../../server/enrollment-data'

/** Отмечает урок пройденным (или снимает отметку) для текущего студента. */
export const completeLessonRoute = app.post('/')
  .query(s => ({ lesson: s.string() }))
  .body(s => ({ completed: s.boolean() }))
  .handle(async (ctx, req) => {
    const user = requireRealUser(ctx)
    const lesson = await Lessons.getById(ctx, req.query.lesson)
    const enrollment = await findEnrollment(ctx, String(user.id), lesson.course.id)
    if (!enrollment || enrollment.status !== 'active') {
      return { ok: false as const, error: 'Сначала запишитесь на курс' }
    }
    const set = new Set(enrollment.completedLessons)
    if (req.body.completed) set.add(lesson.id)
    else set.delete(lesson.id)
    const total = await Lessons.countBy(ctx, { course: lesson.course.id })
    const completedLessons = [...set]
    const updated = await Enrollments.update(ctx, {
      id: enrollment.id,
      completedLessons,
      lastLessonId: lesson.id,
      status: completedLessons.length >= total && total > 0 ? 'completed' : 'active',
    })
    return { ok: true as const, enrollment: toEnrollmentData(updated, null) }
  })
