import { requireAccountRole } from '@app/auth'
import Enrollments from '../../../school/tables/enrollments.table'
import { attachStudentContacts, toEnrollmentDataList } from '../../../school/server/enrollment-data'

export const enrollmentsListRoute = app.get('/', async ctx => {
  requireAccountRole(ctx, 'Staff')
  const rows = await Enrollments.findAll(ctx, { limit: 500, order: [{ createdAt: 'desc' }, { id: 'asc' }] })
  return attachStudentContacts(ctx, await toEnrollmentDataList(ctx, rows))
})
