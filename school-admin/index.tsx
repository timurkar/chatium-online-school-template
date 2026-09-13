import { jsx } from '@app/html-jsx'
import { requireAccountRole, requireRealUser } from '@app/auth'
import { Page } from '../school/layout'
import Enrollments from '../school/tables/enrollments.table'
import { listCourses } from '../school/server/course-data'
import { attachStudentContacts, toEnrollmentDataList } from '../school/server/enrollment-data'
import AdminPage from './pages/DashboardPage.vue'

export const adminRoute = app.get('/')
  .query(s => ({ tab: s.string().optional() }))
  .handle(async (ctx, req) => {
    requireRealUser(ctx)
    requireAccountRole(ctx, 'Staff')
    const [courses, enrollmentRows] = await Promise.all([
      listCourses(ctx, { includeDrafts: true, limit: 500 }),
      Enrollments.findAll(ctx, { limit: 500, order: [{ createdAt: 'desc' }, { id: 'asc' }] }),
    ])
    const enrollments = await attachStudentContacts(ctx, await toEnrollmentDataList(ctx, enrollmentRows))
    const tab = req.query.tab === 'students' ? 'students' : 'courses'
    return (
      <Page title="Панель управления">
        <AdminPage courses={courses} enrollments={enrollments} initialTab={tab} />
      </Page>
    )
  })
