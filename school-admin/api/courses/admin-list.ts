import { requireAccountRole } from '@app/auth'
import { listCourses } from '../../../school/server/course-data'

export const coursesAdminListRoute = app.get('/', async ctx => {
  requireAccountRole(ctx, 'Staff')
  return listCourses(ctx, { includeDrafts: true, limit: 500 })
})
