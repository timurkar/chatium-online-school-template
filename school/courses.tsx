import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import { listCourses } from './server/course-data'
import { LEVELS, Level } from './shared/config'
import CoursesPage from './pages/CoursesPage.vue'

const levelKeys = Object.keys(LEVELS) as Level[]

export const coursesRoute = app.get('/')
  .query(s => ({ q: s.string().optional(), level: s.string().optional() }))
  .handle(async (ctx, req) => {
    const level = levelKeys.find(k => k === req.query.level) ?? ''
    const q = req.query.q ?? ''
    const courses = await listCourses(ctx, { q: q || undefined, level: level || undefined, limit: 200 })
    return (
      <Page title="Курсы">
        <CoursesPage courses={courses} filter={{ q, level }} />
      </Page>
    )
  })
