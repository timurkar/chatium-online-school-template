import { jsx } from '@app/html-jsx'
import Lessons from './tables/lessons.table'
import { Page } from './layout'
import { getPublicCourse, lessonOrder, toLessonFull, toLessonMeta } from './server/course-data'
import { findEnrollment } from './server/enrollment-data'
import LearnPage from './pages/LearnPage.vue'
import { adminLessonRoute } from '../school-admin/lesson'
import NotFoundPage from './pages/NotFoundPage.vue'

/**
 * GET /learn?course=…&lesson=… — просмотр урока. Открытые уроки доступны всем,
 * остальные — студентам с активной записью и сотрудникам.
 */
export const learnRoute = app.get('/')
  .query(s => ({ course: s.string(), lesson: s.string().optional() }))
  .handle(async (ctx, req) => {
    const course = await getPublicCourse(ctx, req.query.course)
    if (!course) {
      return (
        <Page title="Курс не найден">
          <NotFoundPage message="Такого курса нет или он ещё не опубликован." />
        </Page>
      )
    }
    const rows = await Lessons.findAll(ctx, { where: { course: course.id }, order: lessonOrder, limit: 500 })
    const user = ctx.user && ctx.user.type === 'Real' ? ctx.user : null
    const enrollment = user ? await findEnrollment(ctx, String(user.id), course.id) : null
    const enrolled = !!enrollment && (enrollment.status === 'active' || enrollment.status === 'completed')
    const isStaff = !!ctx.user?.is('Staff')
    const completed = enrollment ? enrollment.completedLessons : []

    const requested = req.query.lesson ? rows.find(r => r.id === req.query.lesson) : undefined
    const resume = enrollment?.lastLessonId ? rows.find(r => r.id === enrollment.lastLessonId) : undefined
    const current = requested ?? resume ?? rows.find(r => !completed.includes(r.id)) ?? rows[0]
    const canAccess = !!current && (current.isFree || enrolled || isStaff)
    const adminUrl = isStaff && current ? adminLessonRoute.query({ course: course.id, id: current.id }).url() : null

    return (
      <Page title={current ? `${current.title} — ${course.title}` : course.title}>
        <LearnPage
          course={course}
          lessons={rows.map(toLessonMeta)}
          lesson={current && canAccess ? toLessonFull(current) : current ? toLessonMeta(current) : null}
          canAccess={canAccess}
          enrolled={enrolled}
          enrollmentStatus={enrollment ? enrollment.status : null}
          signedIn={!!user}
          completedLessons={completed}
          adminUrl={adminUrl}
        />
      </Page>
    )
  })
