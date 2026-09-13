import { requireRealUser } from '@app/auth'
import { listMyEnrollments } from '../../server/enrollment-data'

export const myEnrollmentsRoute = app.get('/', async ctx => {
  const user = requireRealUser(ctx)
  return listMyEnrollments(ctx, String(user.id))
})
