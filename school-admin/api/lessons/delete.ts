import { requireAccountRole } from '@app/auth'
import Lessons from '../../../school/tables/lessons.table'

export const lessonDeleteRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    await Lessons.delete(ctx, req.query.id)
    return { ok: true }
  })
