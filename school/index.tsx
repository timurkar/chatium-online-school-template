import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import { listCourses } from './server/course-data'
import HomePage from './pages/HomePage.vue'

export const indexRoute = app.get('/', async ctx => {
  const courses = await listCourses(ctx, { limit: 100 })
  const featured = courses.filter(c => c.featured).slice(0, 6)
  return (
    <Page title="">
      <HomePage courses={featured.length ? featured : courses.slice(0, 6)} totalCourses={courses.length} />
    </Page>
  )
})
