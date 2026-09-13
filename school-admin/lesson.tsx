import { jsx } from '@app/html-jsx'
import { requireAccountRole, requireRealUser } from '@app/auth'
import Lessons from '../school/tables/lessons.table'
import { Page } from '../school/layout'
import { getAdminCourse, toLessonFull } from '../school/server/course-data'
import LessonFormPage from './pages/LessonFormPage.vue'

/** Форма урока: ?course=… без id — создание, с id — редактирование. */
export const adminLessonRoute = app.get('/')
  .query(s => ({ course: s.string(), id: s.string().optional() }))
  .handle(async (ctx, req) => {
    requireRealUser(ctx)
    requireAccountRole(ctx, 'Staff')
    const course = await getAdminCourse(ctx, req.query.course)
    const lesson = req.query.id ? toLessonFull(await Lessons.getById(ctx, req.query.id)) : null
    const count = await Lessons.countBy(ctx, { course: course.id })
    return (
      <Page title={lesson ? `Урок: ${lesson.title}` : `Новый урок — ${course.title}`}>
        <LessonFormPage course={course} lesson={lesson} lessonsCount={count} />
      </Page>
    )
  })
