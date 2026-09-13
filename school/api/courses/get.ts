import { getPublicCourse } from '../../server/course-data'

export const courseGetRoute = app.get('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => getPublicCourse(ctx, req.query.id))
