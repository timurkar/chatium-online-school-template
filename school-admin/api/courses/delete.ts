import { requireAccountRole } from '@app/auth'
import Courses from '../../../school/tables/courses.table'
import Lessons from '../../../school/tables/lessons.table'

/** Удаляет курс вместе с уроками. Записи студентов остаются (в админке показываются как «Курс удалён»). */
export const courseDeleteRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const lessons = await Lessons.findAll(ctx, { where: { course: req.query.id }, limit: 1000 })
    for (const lesson of lessons) await Lessons.delete(ctx, lesson.id)
    await Courses.delete(ctx, req.query.id)
    return { ok: true }
  })
