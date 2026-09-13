import { listLessons } from '../../server/course-data'

/** Программа курса без содержимого уроков (метаданные публичны). */
export const lessonsListRoute = app.get('/')
  .query(s => ({ course: s.string() }))
  .handle(async (ctx, req) => listLessons(ctx, req.query.course))
