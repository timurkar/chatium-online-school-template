import { listCourses } from '../../server/course-data'
import { LEVELS, Level } from '../../shared/config'

const levelKeys = Object.keys(LEVELS) as Level[]

/** Публичный список курсов: только опубликованные. */
export const coursesListRoute = app.get('/')
  .query(s => ({ q: s.string().optional(), level: s.string().optional(), featured: s.string().optional() }))
  .handle(async (ctx, req) =>
    listCourses(ctx, {
      q: req.query.q || undefined,
      level: levelKeys.find(k => k === req.query.level),
      featured: req.query.featured === '1',
    }),
  )
