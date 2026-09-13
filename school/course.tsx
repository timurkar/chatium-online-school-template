import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import { getPublicCourse, listLessons } from './server/course-data'
import { findEnrollment } from './server/enrollment-data'
import CoursePage from './pages/CoursePage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
import { adminCourseRoute } from '../school-admin/course'

export const courseRoute = app.get('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    const course = await getPublicCourse(ctx, req.query.id)
    if (!course) {
      return (
        <Page title="Курс не найден">
          <NotFoundPage message="Такого курса нет или он ещё не опубликован." />
        </Page>
      )
    }
    const lessons = await listLessons(ctx, course.id)
    const user = ctx.user && ctx.user.type === 'Real' ? ctx.user : null
    const enrollment = user ? await findEnrollment(ctx, String(user.id), course.id) : null
    const adminUrl = ctx.user?.is('Staff') ? adminCourseRoute.query({ id: course.id }).url() : null
    return (
      <Page title={course.title} description={course.description}>
        <CoursePage
          course={course}
          lessons={lessons}
          enrollmentStatus={enrollment ? enrollment.status : null}
          completedLessons={enrollment ? enrollment.completedLessons : []}
          adminUrl={adminUrl}
        />
      </Page>
    )
  })
