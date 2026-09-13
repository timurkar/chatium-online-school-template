import { jsx } from '@app/html-jsx'
import { requireAccountRole, requireRealUser } from '@app/auth'
import { getUploadGetPutUrl } from '@app/storage'
import Lessons from '../school/tables/lessons.table'
import { Page } from '../school/layout'
import { getAdminCourse, lessonOrder, toLessonFull } from '../school/server/course-data'
import AdminCoursePage from './pages/CourseFormPage.vue'

/** Форма курса и его уроков: без id — создание, с id — редактирование. */
export const adminCourseRoute = app.get('/')
  .query(s => ({ id: s.string().optional() }))
  .handle(async (ctx, req) => {
    requireRealUser(ctx)
    requireAccountRole(ctx, 'Staff')
    const course = req.query.id ? await getAdminCourse(ctx, req.query.id) : null
    const lessons = course
      ? (await Lessons.findAll(ctx, { where: { course: course.id }, order: lessonOrder, limit: 500 })).map(toLessonFull)
      : []
    return (
      <Page title={course ? `Курс: ${course.title}` : 'Новый курс'}>
        <AdminCoursePage course={course} lessons={lessons} uploadUrl={getUploadGetPutUrl(ctx)} />
      </Page>
    )
  })
