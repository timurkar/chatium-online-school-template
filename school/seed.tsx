import { requireAccountRole } from '@app/auth'
import { Money } from '@app/heap'
import Courses from './tables/courses.table'
import Lessons from './tables/lessons.table'
import { DEMO_COURSES } from './server/seed-data'
import { SCHOOL } from './shared/config'

/**
 * GET /seed — наполняет школу демо-курсами. Идемпотентно: если курсы уже есть, ничего не делает,
 * поэтому роут открыт без авторизации — удобно для первого запуска шаблона.
 *
 * GET /seed?reset=1 (только Staff) — удаляет все курсы и уроки и наполняет заново. Записи студентов не трогает.
 */
export const seedRoute = app.get('/')
  .query(s => ({ reset: s.string().optional() }))
  .handle(async (ctx, req) => {
  if (req.query.reset === '1') {
    // TEMP
    for (const row of await Lessons.findAll(ctx, { limit: 1000 })) await Lessons.delete(ctx, row.id)
    for (const row of await Courses.findAll(ctx, { limit: 1000 })) await Courses.delete(ctx, row.id)
  }
  const existing = await Courses.countBy(ctx)
  if (existing > 0) return { seeded: false, reason: `Уже есть ${existing} курсов` }

  let lessonsCreated = 0
  for (const [index, c] of DEMO_COURSES.entries()) {
    const course = await Courses.create(ctx, {
      title: c.title,
      description: c.description,
      fullDescription: c.fullDescription,
      whatYouLearn: c.whatYouLearn,
      imageHash: c.imageHash,
      price: new Money(c.price, SCHOOL.currency),
      oldPrice: c.oldPrice ? new Money(c.oldPrice, SCHOOL.currency) : undefined,
      level: c.level,
      durationWeeks: c.durationWeeks,
      teacherName: c.teacherName,
      teacherTitle: c.teacherTitle,
      teacherImageHash: c.teacherImageHash,
      status: 'active',
      featured: c.featured ?? false,
      sortOrder: index + 1,
    })
    for (const [li, l] of c.lessons.entries()) {
      await Lessons.create(ctx, {
        course: course.id,
        title: l.title,
        description: l.description,
        content: l.content,
        videoHash: l.videoHash,
        videoUrl: l.videoUrl,
        durationMinutes: l.minutes,
        isFree: l.free ?? false,
        sortOrder: li + 1,
      })
      lessonsCreated++
    }
  }
  return { seeded: true, courses: DEMO_COURSES.length, lessons: lessonsCreated }
})
