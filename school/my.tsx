import { jsx } from '@app/html-jsx'
import { requireRealUser } from '@app/auth'
import { Page } from './layout'
import Lessons from './tables/lessons.table'
import { listMyEnrollments } from './server/enrollment-data'
import MyPage from './pages/MyPage.vue'

/** Личный кабинет студента: записи, прогресс, заявки. Требует входа. */
export const myRoute = app.get('/')
  .query(s => ({ enrolled: s.string().optional() }))
  .handle(async (ctx, req) => {
    const user = requireRealUser(ctx)
    const enrollments = await listMyEnrollments(ctx, String(user.id))
    const courseIds = [...new Set(enrollments.map(e => e.courseId))]
    const lessons = courseIds.length ? await Lessons.findAll(ctx, { where: { course: courseIds }, limit: 1000 }) : []
    const totals = new Map<string, number>()
    for (const l of lessons) totals.set(l.course.id, (totals.get(l.course.id) ?? 0) + 1)
    const items = enrollments.map(e => ({ ...e, lessonsTotal: totals.get(e.courseId) ?? 0 }))
    return (
      <Page title="Мои курсы">
        <MyPage
          enrollments={items}
          userName={user.firstName || user.displayName}
          justEnrolled={req.query.enrolled ?? ''}
        />
      </Page>
    )
  })
