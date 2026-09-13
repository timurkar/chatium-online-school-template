import { requireAccountRole } from '@app/auth'
import Lessons from '../../../school/tables/lessons.table'

/** Принимает id уроков курса в новом порядке. */
export const lessonsReorderRoute = app.post('/')
  .query(s => ({ course: s.string() }))
  .body(s => ({ ids: s.array(s.string()) }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const lessons = await Lessons.findAll(ctx, { where: { course: req.query.course }, limit: 1000 })
    const own = new Set(lessons.map(l => l.id))
    let order = 1
    for (const id of req.body.ids) {
      if (own.has(id)) await Lessons.update(ctx, { id, sortOrder: order++ })
    }
    return { ok: true }
  })
