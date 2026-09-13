import { requireAccountRole } from '@app/auth'
import Enrollments from '../../../school/tables/enrollments.table'
import { toEnrollmentDataList } from '../../../school/server/enrollment-data'

export const enrollmentUpdateStatusRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .body(s => ({ status: s.enum(['pending', 'active', 'completed', 'cancelled']) }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const row = await Enrollments.update(ctx, { id: req.query.id, status: req.body.status })
    const [data] = await toEnrollmentDataList(ctx, [row])
    return data
  })
