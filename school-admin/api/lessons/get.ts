import { requireAccountRole } from '@app/auth'
import Lessons from '../../../school/tables/lessons.table'
import { toLessonFull } from '../../../school/server/course-data'

/** Полное содержимое урока для редактора (админка). Для студентов урок отдаёт страница /learn. */
export const lessonAdminGetRoute = app.get('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    return toLessonFull(await Lessons.getById(ctx, req.query.id))
  })
