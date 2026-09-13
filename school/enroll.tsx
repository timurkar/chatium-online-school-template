import { requireRealUser } from '@app/auth'
import Courses from './tables/courses.table'
import Enrollments from './tables/enrollments.table'
import { findEnrollment, userContact } from './server/enrollment-data'
import { courseRoute } from './course'
import { learnRoute } from './learn'
import { myRoute } from './my'

/**
 * GET /enroll?course=… — запись на курс. Требует входа: Chatium сам покажет форму авторизации
 * и вернёт пользователя сюда. Бесплатный курс открывается сразу, платный создаёт заявку.
 */
export const enrollRoute = app.get('/')
  .query(s => ({ course: s.string() }))
  .handle(async (ctx, req) => {
    const user = requireRealUser(ctx)
    const course = await Courses.findOneBy(ctx, { id: req.query.course, status: 'active' })
    if (!course) {
      ctx.resp.redirect(courseRoute.query({ id: req.query.course }).path())
      return ''
    }
    const existing = await findEnrollment(ctx, String(user.id), course.id)
    const isFree = course.price.amount <= 0
    let status = existing?.status
    if (!existing) {
      status = isFree ? 'active' : 'pending'
      await Enrollments.create(ctx, {
        user: String(user.id),
        course: course.id,
        status,
        studentName: user.fullName || user.displayName,
        studentContact: userContact(user),
        completedLessons: [],
      })
    } else if (existing.status === 'cancelled') {
      status = isFree ? 'active' : 'pending'
      await Enrollments.update(ctx, { id: existing.id, status })
    }
    const target =
      status === 'active' || status === 'completed'
        ? learnRoute.query({ course: course.id }).path()
        : myRoute.query({ enrolled: course.id }).path()
    ctx.resp.redirect(target)
    return ''
  })
